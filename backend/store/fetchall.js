const UserBalance = require('../db/userbalance');
const GroupStats = require('../db/GroupAmount');
const Group = require('../db/friends');

async function fetchAll(req, res) {
  try {
    // 1. Fetch the group name from the request body
    const { groupName } = req.body;
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required" });
    }
console.log(groupName);
    // 2. Fetch the group data
    const group = await Group.findOne({ groupName });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // 3. Fetch the list of friends' names from the group
    const friendsInGroup = group.friends || [];
    friendsInGroup.map((ele) => {
      console.log(ele)
    });

    // 4. Fetch the user balances for each friend in the group
    const userBalances = await UserBalance.find({
      name: { $in: friendsInGroup },
      groupName: groupName
    }) || [];

    const a = userBalances.map(ub => ({
      name: ub.name,
      latestActivityName: ub.latestActivityName,
      totalPaid: ub.totalPaid
    })) || [];
    console.log(a);

    // 5. Fetch the total group amount using the groupName
    const groupStats = await GroupStats.findOne({ groupName });
    let total = 0; // Changed from const to let to allow reassignment
    if (groupStats) {
      console.log(groupStats);
      console.log(groupStats.totalGroupAmount);
      total = groupStats.totalGroupAmount || 0;
    }

    const response = {
      groupName: group.groupName,
      friends: friendsInGroup,
      TotalAmount: total,
      fullbalance: a,
    };

    // 7. Send the combined data to the frontend
    res.status(200).json(response);

  } catch (err) {
    console.error('Error fetching all data:', err);
    res.status(500).json({ error: 'Failed to fetch all data.' });
  }
}

module.exports = { fetchAll };