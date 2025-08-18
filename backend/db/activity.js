const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true
    },
    activities: {
      type: [String], // Array of activity names
      default: []
    }
  },
  { timestamps: true }
);

// Optional: Automatically fetch activities (middleware example)
activitySchema.methods.getActivities = function () {
  return this.activities;
};

const ActivityGroup = mongoose.model("ActivityGroup", activitySchema);

module.exports = ActivityGroup;
