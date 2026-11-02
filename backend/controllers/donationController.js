const store = require('../data/store');

// @desc    Get all donations (Public catalog with filters)
// @route   GET /api/donations
// @access  Public
exports.getDonations = async (req, res) => {
  try {
    const { status, category, city, search, donorId, ngoId, volunteerId } = req.query;

    const donations = await store.getAllDonations({
      status,
      category,
      city,
      search,
      donorId,
      ngoId,
      volunteerId,
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    console.error('getDonations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations.',
    });
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public
exports.getDonationById = async (req, res) => {
  try {
    const donation = await store.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Food donation listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation details.',
    });
  }
};

// @desc    Create new donation listing
// @route   POST /api/donations
// @access  Private (Donor only)
exports.createDonation = async (req, res) => {
  try {
    const {
      foodTitle,
      category,
      quantity,
      servingsCount,
      preparationTime,
      expiryTime,
      pickupLocation,
      description,
      imageUrl,
    } = req.body;

    if (!foodTitle || !quantity || !expiryTime || !pickupLocation?.address || !pickupLocation?.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: food title, quantity, expiry time, and pickup address.',
      });
    }

    // Default image if none provided
    const fallbackImages = {
      'Cooked Meals': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60',
      'Bakery & Snacks': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
      'Packaged Food': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800&auto=format&fit=crop&q=60',
      'Fruits & Vegetables': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=60',
      'Dairy & Milk Products': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=60',
      'Beverages': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=60',
      Other: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60',
    };

    const finalImageUrl =
      req.file
        ? `/uploads/${req.file.filename}`
        : imageUrl || fallbackImages[category] || fallbackImages.Other;

    const donationData = {
      foodTitle: foodTitle.trim(),
      category: category || 'Cooked Meals',
      quantity: quantity.trim(),
      servingsCount: Number(servingsCount) || 10,
      preparationTime: preparationTime ? new Date(preparationTime).toISOString() : new Date().toISOString(),
      expiryTime: new Date(expiryTime).toISOString(),
      pickupLocation: {
        address: pickupLocation.address.trim(),
        city: pickupLocation.city.trim(),
        landmark: pickupLocation.landmark || '',
        contactPhone: pickupLocation.contactPhone || req.user.phone || '',
        instructions: pickupLocation.instructions || '',
      },
      description: description ? description.trim() : '',
      imageUrl: finalImageUrl,
    };

    const createdDonation = await store.createDonation(donationData, req.user);

    res.status(201).json({
      success: true,
      message: 'Food donation listing published successfully and is now visible to verified NGOs.',
      donation: createdDonation,
    });
  } catch (error) {
    console.error('createDonation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create food donation listing.',
    });
  }
};

// @desc    Update donation listing (by donor or admin)
// @route   PUT /api/donations/:id
// @access  Private (Donor owner or Admin)
exports.updateDonation = async (req, res) => {
  try {
    const donation = await store.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    const donorId = donation.donor?._id || donation.donor;
    if (String(donorId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own donation listings.',
      });
    }

    const updated = await store.updateDonation(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Donation listing updated successfully.',
      donation: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update donation.',
    });
  }
};

// @desc    Delete donation listing (Donor or Admin)
// @route   DELETE /api/donations/:id
// @access  Private (Donor owner or Admin)
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await store.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    const donorId = donation.donor?._id || donation.donor;
    if (String(donorId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own donation listings.',
      });
    }

    await store.deleteDonation(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Donation listing removed successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete donation listing.',
    });
  }
};

// ==========================================
// WORKFLOW ACTIONS
// ==========================================

// @desc    NGO requests / claims available food donation
// @route   POST /api/donations/:id/request
// @access  Private (Verified NGO only)
exports.requestDonation = async (req, res) => {
  try {
    const donation = await store.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    if (donation.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: `This donation is no longer available (current status: ${donation.status}).`,
      });
    }

    // Check if expiry has passed
    if (new Date(donation.expiryTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This donation has expired and cannot be requested.',
      });
    }

    const { notes } = req.body;

    const updated = await store.updateDonation(req.params.id, {
      status: 'Requested',
      requestedByNgo: req.user,
      requestedAt: new Date().toISOString(),
      ngoRequestNotes: notes || 'Request submitted for immediate community distribution.',
    });

    res.status(200).json({
      success: true,
      message: 'Food donation request sent to donor for confirmation.',
      donation: updated,
    });
  } catch (error) {
    console.error('requestDonation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request food donation.',
    });
  }
};

// @desc    Donor confirms/accepts or rejects NGO request
// @route   POST /api/donations/:id/confirm-request
// @access  Private (Donor owner)
exports.confirmRequest = async (req, res) => {
  try {
    const donation = await store.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    const donorId = donation.donor?._id || donation.donor;
    if (String(donorId) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the donating establishment can confirm this request.',
      });
    }

    const { action } = req.body; // 'accept' or 'reject'

    if (action === 'accept') {
      const updated = await store.updateDonation(req.params.id, {
        status: 'Accepted',
        acceptedAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: 'Donation confirmed for NGO pickup! Volunteers can now claim transport.',
        donation: updated,
      });
    } else if (action === 'reject') {
      const updated = await store.updateDonation(req.params.id, {
        status: 'Available',
        requestedByNgo: null,
        requestedAt: null,
        ngoRequestNotes: '',
      });

      return res.status(200).json({
        success: true,
        message: 'NGO request declined. The listing has returned to Available status.',
        donation: updated,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'accept' or 'reject'.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process request confirmation.',
    });
  }
};

// @desc    Volunteer claims pickup/delivery task
// @route   POST /api/donations/:id/claim-task
// @access  Private (Volunteer only)
exports.claimTask = async (req, res) => {
  try {
    const donation = await store.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    if (donation.status !== 'Accepted') {
      return res.status(400).json({
        success: false,
        message: `Task is not ready for pickup (status: ${donation.status}). Must be 'Accepted' by donor.`,
      });
    }

    const updated = await store.updateDonation(req.params.id, {
      status: 'Pickup Scheduled',
      assignedVolunteer: req.user,
      assignedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Delivery task assigned to you! Please review pickup details and head to donor location.',
      donation: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to claim delivery task.',
    });
  }
};

// @desc    Volunteer updates delivery status: 'In Transit' or 'Delivered'
// @route   POST /api/donations/:id/update-delivery
// @access  Private (Assigned Volunteer or Admin)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const donation = await store.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation listing not found.',
      });
    }

    const volId = donation.assignedVolunteer?._id || donation.assignedVolunteer;
    if (String(volId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the assigned volunteer can update delivery status.',
      });
    }

    const { status, notes } = req.body; // 'In Transit' or 'Delivered'

    if (!['In Transit', 'Delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'In Transit' or 'Delivered'.",
      });
    }

    const updates = {
      status,
      deliveryProofNotes: notes || donation.deliveryProofNotes,
    };

    if (status === 'In Transit') {
      updates.pickedUpAt = new Date().toISOString();
    } else if (status === 'Delivered') {
      updates.deliveredAt = new Date().toISOString();
    }

    const updated = await store.updateDonation(req.params.id, updates);

    res.status(200).json({
      success: true,
      message:
        status === 'Delivered'
          ? 'Food donation marked as successfully Delivered! Thank you for reducing hunger.'
          : 'Food marked as In Transit. Safe travels!',
      donation: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update delivery status.',
    });
  }
};
