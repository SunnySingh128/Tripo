const ActivityGroup = require("../db/activity");

async function storeActivities(req, res) {
  try {
    const { GroupName, name } = req.body;

    const updatedGroup = await ActivityGroup.findOneAndUpdate(
      { groupName:GroupName },
      { $addToSet: { activities: name } }, // avoids duplicate
      { new: true, upsert: true } // create if not exists
    );

    res.json(updatedGroup);
  } catch (error) {
    console.error("❌ Error storing activities:", error);
    res.status(500).send("Error storing activities");
  }
}



async function fetchActivities(req, res) {
  try {
    const { GroupName } = req.body;

    if (!GroupName) {
      return res.status(400).json({ error: "GroupName is required" });
    }

    console.log("Fetching activities for:", GroupName);

    const group = await ActivityGroup.findOne(
      { GroupName },
      { activities: 1, _id: 0 }
    );

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ activities: group.activities });

  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Error fetching activities" });
  }
}


module.exports = {fetchActivities,storeActivities};
