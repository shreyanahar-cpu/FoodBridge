const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['donor', 'ngo', 'volunteer', 'admin'],
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: 'Mumbai',
    },
    donorDetails: {
      businessType: {
        type: String,
        enum: ['restaurant', 'hotel', 'mess', 'packaged_food', 'caterer', 'other'],
        default: 'restaurant',
      },
      fssaiLicense: {
        type: String,
        default: '',
      },
    },
    ngoDetails: {
      registrationNumber: {
        type: String,
        default: '',
      },
      authorizedPerson: {
        type: String,
        default: '',
      },
      mission: {
        type: String,
        default: '',
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: {
        type: Date,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    volunteerDetails: {
      vehicleType: {
        type: String,
        enum: ['two_wheeler', 'car', 'van', 'auto', 'none'],
        default: 'two_wheeler',
      },
      availability: {
        type: String,
        default: 'Flexible (Evenings & Weekends)',
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
