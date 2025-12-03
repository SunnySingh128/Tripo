const express = require('express');
const router = express.Router();
const {storeUserContribution, getTripSummary} = require('../store/amount');
router.post('/amount',storeUserContribution );
router.get('/summary',getTripSummary );
module.exports = router;