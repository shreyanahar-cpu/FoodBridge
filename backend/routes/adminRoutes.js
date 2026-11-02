const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

// STRICT SECURITY: All routes in this file require valid Admin JWT & role
router.use(verifyToken, requireRole(['admin']));

router.get('/overview', adminController.getAdminOverview);
router.get('/users', adminController.getUsers);
router.put('/ngos/:id/verify', adminController.toggleNgoVerification);
router.delete('/donations/:id', adminController.removeDonationAdmin);
router.get('/messages', adminController.getMessages);

module.exports = router;
