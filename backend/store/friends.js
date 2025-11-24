const Group=require("../db/friends.js")

// Function to store group data
const storedata = async (req, res) => {
  try {
    const { groupName, friends, place } = req.body;

    // Check if group with the same name already exists
    const existingGroup = await Group.findOne({ groupName });

    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists" });
    }

    // If not exists, create and save
    const newGroup = new Group({
      groupName,
      friends,
      place
    });

    const savedGroup = await newGroup.save();
    res.status(201).json({ message: "Group data saved successfully", data: savedGroup });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Function to get all group data
const getdata = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const groupName = req.query.group;
   
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required" });
    }
console.log(groupName);
    // Find the group by name
    const group = await Group.findOne({ groupName: groupName });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Return the friends array
    res.status(200).json({ friends: group.friends || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
async function checkFriendExists(req, res) {
   try {
    const { payerName, groupName } = req.body;
console.log(payerName,groupName);
    if (!payerName || !groupName) {
      return res.status(400).json({
        success: false,
        message: "Both payerName and groupName are required."
      });
    }

    // Step 1: Check if group exists
    const group = await Group.findOne({ groupName: groupName });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: `Group '${groupName}' not found.`
      });
    }

    // Step 2: Check if payerName exists in friends array
    const isFriend = group.friends.includes(payerName);

    if (isFriend) {
      return res.status(200).json({
        success: true,
        message: `${payerName} is a member of group '${groupName}'.`
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `${payerName} is not in group '${groupName}'.`
      });
    }

  } catch (err) {
    console.error("Error in /checkFriends:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
}
async function checkExistsGroup(req,res){
  const {groupName}=req.body;
   const group = await Group.findOne({ groupName });
      //  const isFriend = group.friends.includes(payerName);
    if(!group ){
          return res.status(400).json({ error: "Group not exists" });
    }else{
      return res.status(200).json({res1:"successfull"});
    }
}
module.exports = { storedata, getdata, getMembers,checkFriendExists,checkExistsGroup };
