const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const store = require('../data/store');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing from environment variables.');
}

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user (Donor, NGO, or Volunteer ONLY)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      city,
      donorDetails,
      ngoDetails,
      volunteerDetails,
    } = req.body;

    // Strict security check: Disallow public admin registration
    if (role === 'admin' || req.body.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Admin accounts cannot be created via public registration.',
      });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and role.',
      });
    }

    if (!['donor', 'ngo', 'volunteer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Permitted roles are: donor, ngo, volunteer.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const existing = await store.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Process role-specific details
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      phone: phone || '',
      address: address || '',
      city: city || 'Mumbai',
    };

    if (role === 'donor') {
      userData.donorDetails = {
        businessType: donorDetails?.businessType || 'restaurant',
        fssaiLicense: donorDetails?.fssaiLicense || '',
      };
    } else if (role === 'ngo') {
      userData.ngoDetails = {
        registrationNumber: ngoDetails?.registrationNumber || '',
        authorizedPerson: ngoDetails?.authorizedPerson || name,
        mission: ngoDetails?.mission || '',
        isVerified: false, // Must be verified by Admin!
        verifiedAt: null,
      };
    } else if (role === 'volunteer') {
      userData.volunteerDetails = {
        vehicleType: volunteerDetails?.vehicleType || 'two_wheeler',
        availability: volunteerDetails?.availability || 'Flexible',
      };
    }

    const createdUser = await store.createUser(userData);
    const token = generateToken(createdUser);

    res.status(201).json({
      success: true,
      message:
        role === 'ngo'
          ? 'Registration successful! Your NGO account has been submitted for administrative verification.'
          : 'Registration successful! Welcome to FoodBridge.',
      token,
      user: createdUser,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred during registration. Please try again.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const userWithPass = await store.findUserByEmail(email);
    if (!userWithPass) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, userWithPass.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const { password: _, ...user } = userWithPass;
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await store.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, donorDetails, ngoDetails, volunteerDetails } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (city) updates.city = city;

    if (req.user.role === 'donor' && donorDetails) {
      updates.donorDetails = { ...req.user.donorDetails, ...donorDetails };
    }
    if (req.user.role === 'ngo' && ngoDetails) {
      // Prevent self-verifying NGO!
      const { isVerified, verifiedAt, verifiedBy, ...safeNgoDetails } = ngoDetails;
      updates.ngoDetails = { ...req.user.ngoDetails, ...safeNgoDetails };
    }
    if (req.user.role === 'volunteer' && volunteerDetails) {
      updates.volunteerDetails = { ...req.user.volunteerDetails, ...volunteerDetails };
    }

    const updatedUser = await store.updateUser(req.user._id, updates);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
};
