const express = require('express');
const router = express.Router();
const {fetchActivities,storeActivities}=require("../store/activity")
router.post("/activity",fetchActivities);
router.post("/store1",storeActivities);
module.exports = router;