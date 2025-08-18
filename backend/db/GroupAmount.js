const mongoose = require('mongoose');

const groupStatsSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  totalGroupAmount: {
    type: Number,
    default: 0,
  }
});

const GroupStats = mongoose.model('GroupStats', groupStatsSchema);

module.exports = GroupStats;