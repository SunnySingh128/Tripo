const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
activities: [
    {
      activityName: String,
      amount: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  totalPaid: { type: Number, default: 0 },
  totalOwed: { type: Number, default: 0 },

  // This user owes money to other users
  givesTo: [
    {
      friendName: String,
      amount: Number,
      activityName: String
    }
  ],

  // Other users owe money to this user
  getsFrom: [
    {
      friendName: String,
      amount: Number,
      activityName: String
    }
  ],

  latestActivityName: { type: String, default: '' }
});

module.exports = mongoose.model('UserBalance', userBalanceSchema);
