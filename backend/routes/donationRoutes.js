const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const donationController = require('../controllers/donationController');
const { verifyToken, requireRole, requireVerifiedNgo } = require('../middleware/auth');

// Multer storage for food image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `food_${Date.now()}_${Math.round(Math.random() * 1e4)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

// Public endpoints
router.get('/', donationController.getDonations);
router.get('/:id', donationController.getDonationById);

// Protected endpoints
// Donor actions
router.post('/', verifyToken, requireRole(['donor']), upload.single('image'), donationController.createDonation);
router.put('/:id', verifyToken, requireRole(['donor', 'admin']), donationController.updateDonation);
router.delete('/:id', verifyToken, requireRole(['donor', 'admin']), donationController.deleteDonation);
router.post('/:id/confirm-request', verifyToken, requireRole(['donor', 'admin']), donationController.confirmRequest);

// NGO actions (requires verified NGO!)
router.post('/:id/request', verifyToken, requireVerifiedNgo, donationController.requestDonation);

// Volunteer actions
router.post('/:id/claim-task', verifyToken, requireRole(['volunteer', 'admin']), donationController.claimTask);
router.post('/:id/update-delivery', verifyToken, requireRole(['volunteer', 'admin']), donationController.updateDeliveryStatus);

module.exports = router;
