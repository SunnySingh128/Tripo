const UserBalance = require('../db/userbalance');
const GroupStats = require('../db/GroupAmount');

async function storeUserContribution(req, res) {
  const { payerName, amount, activityName,groupName } = req.body;
  const totalAmount = parseFloat(amount);

  try {
    // 1. Update or insert the payer's balance in UserBalance
    await UserBalance.findOneAndUpdate(
      { groupName, name: payerName },
      {
        $inc: { totalPaid: totalAmount },
        $set: { latestActivityName: activityName }
      },
      { upsert: true, new: true }
    );

    // 2. Update total group amount in GroupStats
    await GroupStats.findOneAndUpdate(
      { groupName },
      { $inc: { totalGroupAmount: totalAmount } },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'User contribution and group total updated successfully.'
    });
  } catch (err) {
    console.error('Error storing contribution:', err);
    res.status(500).json({ error: 'Failed to store contribution.' });
  }
}


module.exports = storeUserContribution;