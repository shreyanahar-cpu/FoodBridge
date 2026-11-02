const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    foodTitle: {
      type: String,
      required: [true, 'Food title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Cooked Meals',
        'Raw Groceries',
        'Packaged Food',
        'Bakery & Snacks',
        'Fruits & Vegetables',
        'Dairy & Milk Products',
        'Beverages',
        'Other',
      ],
      default: 'Cooked Meals',
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true,
    },
    servingsCount: {
      type: Number,
      default: 10,
    },
    preparationTime: {
      type: Date,
      default: Date.now,
    },
    expiryTime: {
      type: Date,
      required: [true, 'Expiry time is required'],
    },
    pickupLocation: {
      address: {
        type: String,
        required: [true, 'Pickup address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      landmark: {
        type: String,
        default: '',
      },
      contactPhone: {
        type: String,
        required: [true, 'Contact phone is required'],
      },
      instructions: {
        type: String,
        default: '',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Available',
        'Requested',
        'Accepted',
        'Pickup Scheduled',
        'In Transit',
        'Delivered',
        'Cancelled',
      ],
      default: 'Available',
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedByNgo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    requestedAt: {
      type: Date,
      default: null,
    },
    ngoRequestNotes: {
      type: String,
      default: '',
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    deliveryProofNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for searching
donationSchema.index({ foodTitle: 'text', description: 'text', 'pickupLocation.city': 'text' });

module.exports = mongoose.model('Donation', donationSchema);
