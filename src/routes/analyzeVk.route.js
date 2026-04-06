const express = require('express');
const analyzeVkController = require('../controllers/analyzeVk.controller');

const router = express.Router();

router.post('/analyze-vk', analyzeVkController);

module.exports = router;
