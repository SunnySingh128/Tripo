const express = require('express');
const router = express.Router();
const {storedata,getdata,getMembers,checkFriendExists,checkExistsGroup}=require("../store/friends.js");
router.post('/store',storedata);
router.get("/get",getdata);
router.get("/getMembers",getMembers);
router.post("/checkFriend",checkFriendExists);
router.post("/check",checkExistsGroup);
module.exports = router;