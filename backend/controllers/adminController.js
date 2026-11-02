const store = require('../data/store');

// @desc    Get admin high-level system overview & metrics
// @route   GET /api/admin/overview
// @access  Private (Admin only)
exports.getAdminOverview = async (req, res) => {
  try {
    const stats = await store.getStatistics();
    const users = await store.getAllUsers();
    const donations = await store.getAllDonations();
    const messages = await store.getAllContactMessages();

    // Pending verification NGOs
    const pendingNgos = users.filter((u) => u.role === 'ngo' && !u.ngoDetails?.isVerified);

    // Expired or urgent listings
    const now = new Date();
    const expiredDonations = donations.filter((d) => new Date(d.expiryTime) < now && d.status === 'Available');

    res.status(200).json({
      success: true,
      data: {
        stats,
        pendingNgosCount: pendingNgos.length,
        expiredDonationsCount: expiredDonations.length,
        recentUsers: users.slice(0, 8),
        recentDonations: donations.slice(0, 8),
        messagesCount: messages.length,
      },
    });
  } catch (error) {
    console.error('getAdminOverview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin system overview.',
    });
  }
};

// @desc    Get all users with optional role filtering
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await store.getAllUsers(role);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user list.',
    });
  }
};

// @desc    Verify or revoke verification for an NGO
// @route   PUT /api/admin/ngos/:id/verify
// @access  Private (Admin only)
exports.toggleNgoVerification = async (req, res) => {
  try {
    const user = await store.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'NGO user account not found.',
      });
    }

    if (user.role !== 'ngo') {
      return res.status(400).json({
        success: false,
        message: 'Selected user is not an NGO account.',
      });
    }

    const { isVerified } = req.body;
    const newStatus = typeof isVerified === 'boolean' ? isVerified : !user.ngoDetails?.isVerified;

    const updatedUser = await store.updateUser(req.params.id, {
      ngoDetails: {
        ...user.ngoDetails,
        isVerified: newStatus,
        verifiedAt: newStatus ? new Date().toISOString() : null,
        verifiedBy: newStatus ? req.user._id : null,
      },
    });

    res.status(200).json({
      success: true,
      message: newStatus
        ? `NGO '${user.name}' has been verified successfully. Food donation claiming is now unlocked.`
        : `Verification for '${user.name}' has been revoked.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('toggleNgoVerification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update NGO verification status.',
    });
  }
};

// @desc    Admin delete inappropriate or expired listing
// @route   DELETE /api/admin/donations/:id
// @access  Private (Admin only)
exports.removeDonationAdmin = async (req, res) => {
  try {
    const deleted = await store.deleteDonation(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Listing removed by administrator.',
      donation: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete donation listing.',
    });
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/admin/messages
// @access  Private (Admin only)
exports.getMessages = async (req, res) => {
  try {
    const messages = await store.getAllContactMessages();
    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages.',
    });
  }
};
