const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/contact', contactController.submitContact);
router.get('/stats', contactController.getStats);

module.exports = router;
