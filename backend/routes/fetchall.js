const express = require('express');
const router = express.Router();
const {fetchAll}=require('../store/fetchall');
router.post('/fetchall',fetchAll);
module.exports=router;