const UserBalance = require('../db/userbalance');
const GroupStats = require('../db/GroupAmount');
const Group = require('../db/friends');
async function storeUserContribution(req, res) {
  const { payerName, amount, activityName, groupName, selectedFriends,customSplit } = req.body;
  const totalAmount = parseFloat(amount);
   console.log(customSplit);
  try {
    let members = [];

    // -----------------------------------------
    // CASE 1 → selectedFriends provided
if (Array.isArray(selectedFriends) && selectedFriends.length > 0) {
  console.log(selectedFriends)
 for (const friend of selectedFriends) {
    const friendName = friend.name;
    const amount = parseFloat(friend.amount);
    console.log(friendName, amount,activityName)
if (!friendName || isNaN(amount)) continue;

const res = await UserBalance.updateOne(
  { groupName, name: friendName },
  {
    $inc: { totalPaid: amount },

    // Always push activity
    $push: {
      activities: {
        activityName,
        amount,
        date: Date.now(),
      }
    },

    // Set only when inserting a new doc
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
  return     res.status(200).json({message: "Split stored successfully!",}) // done processing selectedFriends
}else if (Array.isArray(customSplit) && customSplit.length > 0) {
  console.log(customSplit, payerName);

  const groupData = await Group.findOne({ groupName });
  if (!groupData) {
    return res.status(404).json({ error: "Group not found" });
  }

  let members = [...groupData.friends];

  // Add payer if not part of group
  if (!members.includes(payerName)) {
    members.push(payerName);
  }

  members = members.filter(name => name && name.trim() !== "");
  console.log("Split Logic:", { members });

  // 1️⃣ PROCESS CUSTOM SPLIT
  for (const entry of customSplit) {
    const friendName = entry.name;
    const amount = entry.amount;

    if (friendName !== payerName && amount > 0) {

      // Friend gives money to PAYER
      await UserBalance.findOneAndUpdate(
        { groupName, name: friendName },
        {
          $push: { givesTo: { friendName: payerName, amount, activityName } },
          $inc: { totalOwed: amount },
          $set: { latestActivityName: activityName }
        },
        { upsert: true }
      );

      // Payer gets money FROM friend
      await UserBalance.findOneAndUpdate(
        { groupName, name: payerName },
        {
          $push: { getsFrom: { friendName, amount, activityName } },
          $set: { latestActivityName: activityName }
        },
        { upsert: true }
      );

    }
  }

  // 2️⃣ Update payer’s totalPaid
  await UserBalance.findOneAndUpdate(
    { groupName, name: payerName },
    { $inc: { totalPaid: totalAmount } },
    { upsert: true }
  );

  // 3️⃣ Update Group Total
  await GroupStats.findOneAndUpdate(
    { groupName },
    { $inc: { totalGroupAmount: totalAmount } },
    { upsert: true }
  );

  return res.status(200).json({
    message: "Custom split stored successfully!",
    splitAmong: members
  });
}


    // -----------------------------------------
    // CASE 2 → fetch all members from GROUP MODEL
    // -----------------------------------------
    else {
      const groupData = await Group.findOne({ groupName });

      if (!groupData) {
        return res.status(404).json({ error: "Group not found" });
      }

      members = [...groupData.friends];
         
      // Include payer if not already in group
      if (!members.includes(payerName)) {
        members.push(payerName);
      }
    }

    // Remove empty names
    members = members.filter(names => names && names.trim() !== "");

    const perPersonAmount = totalAmount / members.length;

    console.log("Split Logic:", { members, perPersonAmount });

    // --------------------------------------------------------
    // 1️⃣ UPDATE givesTo and getsFrom
    // --------------------------------------------------------
    for (let friend of members) {
      if (friend !== payerName) {
        // Friend gives to payer
        await UserBalance.findOneAndUpdate(
          { groupName, name: friend },
          {
            $push: { givesTo: { friendName: payerName, amount: perPersonAmount,activityName: activityName } },
            $set: { latestActivityName: activityName }
          },
          { upsert: true }
        );

        // Payer gets from friend
        await UserBalance.findOneAndUpdate(
          { groupName, name: payerName },
          {
            $push: { getsFrom: { friendName: friend, amount: perPersonAmount,activityName: activityName } },
            $set: { latestActivityName: activityName }
          },
          { upsert: true }
        );
      }
    }

    // --------------------------------------------------------
    // 2️⃣ Update payer totalPaid
    // --------------------------------------------------------
    await UserBalance.findOneAndUpdate(
      { groupName, name: payerName },
      { $inc: { totalPaid: totalAmount } },
      { upsert: true }
    );

    // --------------------------------------------------------
    // 3️⃣ Update group total
    // --------------------------------------------------------
    await GroupStats.findOneAndUpdate(
      { groupName },
      { $inc: { totalGroupAmount: totalAmount } },
      { upsert: true }
    );

    res.status(200).json({
      message: "Split stored successfully!",
      splitAmong: members,
      perPersonAmount
    });

  } catch (err) {
    console.error("Error storing contribution:", err);
    res.status(500).json({ error: "Failed to store contribution." });
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
