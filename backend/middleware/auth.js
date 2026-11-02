const jwt = require('jsonwebtoken');
const store = require('../data/store');

const JWT_SECRET = process.env.JWT_SECRET || 'foodbridge_super_secret_jwt_key_2026_cep_project';

// Verify token middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await store.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: user not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
    });
  }
};

// Require specific role(s)
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: restricted to [${roles.join(', ')}] role. Your role is '${req.user.role}'.`,
      });
    }

    next();
  };
};

// Require verified NGO status for claiming food
const requireVerifiedNgo = (req, res, next) => {
  if (!req.user || req.user.role !== 'ngo') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Only registered NGOs can perform this action.',
    });
  }

  if (!req.user.ngoDetails || !req.user.ngoDetails.isVerified) {
    return res.status(403).json({
      success: false,
      isPendingVerification: true,
      message:
        'NGO Verification Pending: Your NGO account is pending verification by the FoodBridge Administrator. Food donation requests will be unlocked once approved.',
    });
  }

  next();
};

module.exports = {
  verifyToken,
  requireRole,
  requireVerifiedNgo,
};
