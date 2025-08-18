const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amountSpent: { type: Number, required: true },
  activity: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const GroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true, unique: true },
  members: [MemberSchema]
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
