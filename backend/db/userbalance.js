// 1. Import mongoose
const mongoose = require('mongoose');

// 2. Define schema
const userBalanceSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  totalOwed: {
    type: Number,
    default: 0
  },
  latestActivityName: {
    type: String,
    default: ''
  }
});

// 3. Create model
const UserBalance = mongoose.model('UserBalance', userBalanceSchema);

// 4. Export the model
module.exports = UserBalance;
