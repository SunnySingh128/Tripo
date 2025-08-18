const express = require('express');
const router = express.Router();
router.post('/amount', require('../store/amount'));
module.exports = router;