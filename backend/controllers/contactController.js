const store = require('../data/store');

// @desc    Submit public contact inquiry
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields: name, email, subject, and message.',
      });
    }

    const newMsg = await store.createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to FoodBridge! Our team will respond shortly.',
      data: newMsg,
    });
  } catch (error) {
    console.error('submitContact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message. Please try again.',
    });
  }
};

// @desc    Get public impact stats
// @route   GET /api/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const stats = await store.getStatistics();
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public statistics.',
    });
  }
};
