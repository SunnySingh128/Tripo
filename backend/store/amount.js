const UserBalance = require('../db/userbalance');
const GroupStats = require('../db/GroupAmount');
const Group = require('../db/friends');
async function storeUserContribution(req, res) {
  const { payerName, amount, activityName, groupName, selectedFriends, customSplit } = req.body;
  const totalAmount = parseFloat(amount);

  try {

    // -----------------------------------------
    // CASE 1 → selectedFriends provided
    // -----------------------------------------
    if (Array.isArray(selectedFriends) && selectedFriends.length > 0) {

      for (const friend of selectedFriends) {
        const friendName = friend.name;
        const amt = parseFloat(friend.amount);

        if (!friendName || isNaN(amt)) continue;

        await UserBalance.updateOne(
          { groupName, name: friendName },
          {
            $inc: { totalPaid: amt },
            $push: {
              activities: {
                activityName,
                amount: amt,
                date: Date.now(),
              }
            },
            $setOnInsert: {
              totalOwed: 0,
              givesTo: [],
              getsFrom: [],
              latestActivityName: ""
            }
          },
          { upsert: true }
        );
      }

      return res.status(200).json({
        message: "Split stored successfully!",
        mode: "selectedFriends"
      });
    }

    // -----------------------------------------
    // CASE 2 → customSplit provided
    // -----------------------------------------
    if (Array.isArray(customSplit) && customSplit.length > 0) {

      const groupData = await Group.findOne({ groupName });
      if (!groupData) {
        return res.status(404).json({ error: "Group not found" });
      }

      let members = [...groupData.friends];

      if (!members.includes(payerName)) {
        members.push(payerName);
      }

      members = members.filter(n => n && n.trim() !== "");

      // 1️⃣ Process individual custom split entries
      for (const entry of customSplit) {
        const friendName = entry.name;
        const amt = entry.amount;

        if (friendName !== payerName && amt > 0) {

          // Friend → Pays to payer
          await UserBalance.findOneAndUpdate(
            { groupName, name: friendName },
            {
              $push: { givesTo: { friendName: payerName, amount: amt, activityName } },
              $inc: { totalOwed: amt },
              $set: { latestActivityName: activityName }
            },
            { upsert: true }
          );

          // Payer receives
          await UserBalance.findOneAndUpdate(
            { groupName, name: payerName },
            {
              $push: { getsFrom: { friendName, amount: amt, activityName } },
              $set: { latestActivityName: activityName }
            },
            { upsert: true }
          );
        }
      }

      // 2️⃣ Add to payer's totalPaid
      await UserBalance.findOneAndUpdate(
        { groupName, name: payerName },
        { $inc: { totalPaid: totalAmount } },
        { upsert: true }
      );

      // 3️⃣ Add to group stats
      await GroupStats.findOneAndUpdate(
        { groupName },
        { $inc: { totalGroupAmount: totalAmount } },
        { upsert: true }
      );

      return res.status(200).json({
        message: "Custom split stored successfully!",
        members,
        mode: "customSplit"
      });
    }

    // -----------------------------------------
    // CASE 3 → Equal Split (default)
    // -----------------------------------------
    const groupData = await Group.findOne({ groupName });

    if (!groupData) {
      return res.status(404).json({ error: "Group not found" });
    }

    let members = [...groupData.friends];

    if (!members.includes(payerName)) {
      members.push(payerName);
    }

    members = members.filter(n => n && n.trim() !== "");

    const perPersonAmount = totalAmount / members.length;

    // Money flow
    for (let friend of members) {
      if (friend !== payerName) {

        await UserBalance.findOneAndUpdate(
          { groupName, name: friend },
          {
            $push: { givesTo: { friendName: payerName, amount: perPersonAmount, activityName } },
            $set: { latestActivityName: activityName }
          },
          { upsert: true }
        );

        await UserBalance.findOneAndUpdate(
          { groupName, name: payerName },
          {
            $push: { getsFrom: { friendName: friend, amount: perPersonAmount, activityName } },
            $set: { latestActivityName: activityName }
          },
          { upsert: true }
        );
      }
    }

    // Payer paid full amount
    await UserBalance.findOneAndUpdate(
      { groupName, name: payerName },
      { $inc: { totalPaid: totalAmount } },
      { upsert: true }
    );

    await GroupStats.findOneAndUpdate(
      { groupName },
      { $inc: { totalGroupAmount: totalAmount } },
      { upsert: true }
    );

    return res.status(200).json({
      message: "Equal split stored successfully!",
      members,
      perPersonAmount,
      mode: "equalSplit"
    });

  } catch (err) {
    console.error("Error storing contribution:", err);
    return res.status(500).json({ error: "Failed to store contribution." });
  }
}

const getTripSummary = async (req, res) => {
  try {
    const groupName = req.query.groupName;
    console.log(groupName);
    if (!groupName) {
      return res.status(400).json({ message: "groupName is required" });
    }

    // Fetch all users belonging to this group
    const members = await UserBalance.find({ groupName });

    if (!members || members.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for this group",
      });
    }

    // Total trip budget = sum of totalPaid
    const totalTripBudget = members.reduce((sum, user) => {
      return sum + (user.totalPaid || 0);
    }, 0);

    // Prepare simplified summary
    const summary = members.map((m) => ({
      name: m.name,
      totalPaid: m.totalPaid || 0,
      givesTo: m.givesTo || [],
      getsFrom: m.getsFrom || [],
      latestActivityName: m.latestActivityName || "",
      activities: m.activities || []        // ✅ Always send array
    }));

    return res.status(200).json({
      success: true,
      groupName,
      totalTripBudget,
      members: summary,
    });
  } catch (err) {
    console.error("Error fetching trip summary:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching trip summary",
    });
  }
};


module.exports = { storeUserContribution,getTripSummary };
