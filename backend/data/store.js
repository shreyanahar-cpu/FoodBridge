const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getMongoStatus } = require('../config/db');
const User = require('../models/User');
const Donation = require('../models/Donation');
const ContactMessage = require('../models/ContactMessage');

const DATA_DIR = path.join(__dirname);
const DB_FILE = path.join(DATA_DIR, 'database.json');

// In-memory data collections
let memoryStore = {
  users: [],
  donations: [],
  messages: [],
};

const saveToDisk = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist in-memory DB to disk:', err.message);
  }
};

const loadFromDisk = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryStore = JSON.parse(content);
      return true;
    }
  } catch (err) {
    console.warn('Could not read existing database.json, re-initializing...', err.message);
  }
  return false;
};

// Seed initial dataset
const seedInitialData = async () => {
  const salt = await bcrypt.genSalt(10);
  const defaultAdminPass = await bcrypt.hash('Admin@12345', salt);
  const defaultDonorPass = await bcrypt.hash('Donor@123', salt);
  const defaultNgoPass = await bcrypt.hash('Ngo@123', salt);
  const defaultVolPass = await bcrypt.hash('Vol@123', salt);

  const initialUsers = [
    {
      _id: 'usr_admin_001',
      name: 'FoodBridge Super Admin',
      email: 'admin@foodbridge.org',
      password: defaultAdminPass,
      role: 'admin',
      phone: '+91 98201 11223',
      address: 'FoodBridge Central HQ, Nariman Point',
      city: 'Mumbai',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_donor_001',
      name: 'Royal Spice Restaurant & Caterers',
      email: 'spicekitchen@donor.org',
      password: defaultDonorPass,
      role: 'donor',
      phone: '+91 98202 33445',
      address: 'Shop 14-16, Linking Road, Bandra West',
      city: 'Mumbai',
      donorDetails: {
        businessType: 'restaurant',
        fssaiLicense: 'FSSAI-11522001004521',
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_donor_002',
      name: 'Grand Horizon Banquet & Hotel',
      email: 'grandpalace@donor.org',
      password: defaultDonorPass,
      role: 'donor',
      phone: '+91 98110 55667',
      address: 'Sector 29, City Center',
      city: 'Delhi',
      donorDetails: {
        businessType: 'hotel',
        fssaiLicense: 'FSSAI-10018011002341',
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_donor_003',
      name: 'Apex University Student Mess',
      email: 'campusmess@donor.org',
      password: defaultDonorPass,
      role: 'donor',
      phone: '+91 94220 77889',
      address: 'Hostel Block C, Apex Campus, Viman Nagar',
      city: 'Pune',
      donorDetails: {
        businessType: 'mess',
        fssaiLicense: 'FSSAI-12219012000892',
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_ngo_001',
      name: 'Roti Bank Foundation',
      email: 'roti@ngo.org',
      password: defaultNgoPass,
      role: 'ngo',
      phone: '+91 99300 12345',
      address: 'Community Center 4, Dadar West',
      city: 'Mumbai',
      ngoDetails: {
        registrationNumber: 'NGO-MH-2018-00912',
        authorizedPerson: 'Anil Deshmukh',
        mission: 'Eliminating hunger across municipal wards by redistributing nutritious meals daily.',
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_ngo_002',
      name: 'FeedTheHungry Trust',
      email: 'feedindia@ngo.org',
      password: defaultNgoPass,
      role: 'ngo',
      phone: '+91 98100 98765',
      address: 'Plot 45, Lajpat Nagar III',
      city: 'Delhi',
      ngoDetails: {
        registrationNumber: 'NGO-DL-2020-00441',
        authorizedPerson: 'Dr. Sunita Rao',
        mission: 'Serving children, senior citizens and daily-wage earners through community kitchens.',
        isVerified: true,
        verifiedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_ngo_003',
      name: 'Hope For All Welfare Society',
      email: 'hopeforall@ngo.org',
      password: defaultNgoPass,
      role: 'ngo',
      phone: '+91 98450 67890',
      address: '12th Cross, Indiranagar',
      city: 'Bangalore',
      ngoDetails: {
        registrationNumber: 'NGO-KA-2024-00128',
        authorizedPerson: 'Vikram Seth',
        mission: 'Newly formed charitable initiative aiming to support urban shelter homes.',
        isVerified: false, // PENDING VERIFICATION by Admin!
        verifiedAt: null,
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_vol_001',
      name: 'Rahul Sharma',
      email: 'rahul.vol@volunteer.org',
      password: defaultVolPass,
      role: 'volunteer',
      phone: '+91 98700 45678',
      address: 'Santacruz East',
      city: 'Mumbai',
      volunteerDetails: {
        vehicleType: 'two_wheeler',
        availability: 'All afternoons & weekends',
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_vol_002',
      name: 'Priya Patel',
      email: 'priya.vol@volunteer.org',
      password: defaultVolPass,
      role: 'volunteer',
      phone: '+91 98210 65432',
      address: 'Andheri West',
      city: 'Mumbai',
      volunteerDetails: {
        vehicleType: 'car',
        availability: 'Evenings 6 PM - 10 PM',
      },
      createdAt: new Date().toISOString(),
    },
  ];

  const now = new Date();
  const plusHours = (h) => new Date(now.getTime() + h * 3600 * 1000).toISOString();
  const minusHours = (h) => new Date(now.getTime() - h * 3600 * 1000).toISOString();

  const initialDonations = [
    {
      _id: 'don_001',
      foodTitle: '45 Packs of Fresh Dum Biryani with Veg Raita',
      category: 'Cooked Meals',
      quantity: '45 Meal Boxes',
      servingsCount: 45,
      preparationTime: minusHours(2),
      expiryTime: plusHours(8),
      pickupLocation: {
        address: 'Royal Spice Restaurant, Shop 14, Linking Road, Bandra West',
        city: 'Mumbai',
        landmark: 'Near Bandra Medical Store',
        contactPhone: '+91 98202 33445',
        instructions: 'Please collect from the rear kitchen loading bay.',
      },
      description: 'Hot vegetarian dum biryani prepared for a corporate luncheon. Packed hygienically in sealed eco-friendly containers with fresh raita on the side.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60',
      status: 'Available',
      donor: initialUsers[1],
      requestedByNgo: null,
      requestedAt: null,
      ngoRequestNotes: '',
      acceptedAt: null,
      assignedVolunteer: null,
      assignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      deliveryProofNotes: '',
      createdAt: minusHours(2),
    },
    {
      _id: 'don_002',
      foodTitle: 'Fresh Artisan Loaves & Whole Wheat Breads',
      category: 'Bakery & Snacks',
      quantity: '30 kg (65 Loaves)',
      servingsCount: 80,
      preparationTime: minusHours(4),
      expiryTime: plusHours(24),
      pickupLocation: {
        address: 'Grand Horizon Bakery Wing, Sector 29, City Center',
        city: 'Delhi',
        landmark: 'Opposite Metro Station Gate 2',
        contactPhone: '+91 98110 55667',
        instructions: 'Inquire with head chef at back kitchen gate.',
      },
      description: 'Unsold freshly baked baguettes, sandwich loaves, dinner rolls, and multigrain bread from our breakfast buffet. Fully edible and stored in dry conditions.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
      status: 'Available',
      donor: initialUsers[2],
      requestedByNgo: null,
      requestedAt: null,
      ngoRequestNotes: '',
      acceptedAt: null,
      assignedVolunteer: null,
      assignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      deliveryProofNotes: '',
      createdAt: minusHours(4),
    },
    {
      _id: 'don_003',
      foodTitle: 'Dal Tadka, Steamed Basmati Rice & Mixed Veg Sabzi',
      category: 'Cooked Meals',
      quantity: '60 Full Meal Servings',
      servingsCount: 60,
      preparationTime: minusHours(3),
      expiryTime: plusHours(6),
      pickupLocation: {
        address: 'Apex University Mess Kitchen, Hostel Block C, Viman Nagar',
        city: 'Pune',
        landmark: 'North Campus Gate',
        contactPhone: '+91 94220 77889',
        instructions: 'Please bring large food-grade transport vessels or insulated containers.',
      },
      description: 'Surplus dinner preparation from the central university dining hall. Kept hot in commercial bain-marie warming units.',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60',
      status: 'Requested',
      donor: initialUsers[3],
      requestedByNgo: initialUsers[4], // Roti Bank Foundation
      requestedAt: minusHours(1),
      ngoRequestNotes: 'We have a night shelter distribution drive in Hadapsar that can consume these 60 meals immediately upon pickup.',
      acceptedAt: null,
      assignedVolunteer: null,
      assignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      deliveryProofNotes: '',
      createdAt: minusHours(3),
    },
    {
      _id: 'don_004',
      foodTitle: 'Assorted Packaged Juices, Biscuits & Healthy Energy Bars',
      category: 'Packaged Food',
      quantity: '120 Units (Sealed)',
      servingsCount: 120,
      preparationTime: minusHours(12),
      expiryTime: plusHours(720), // 30 days
      pickupLocation: {
        address: 'Royal Spice Pantry Store, Shop 16, Linking Road, Bandra West',
        city: 'Mumbai',
        landmark: 'Bandra West Market',
        contactPhone: '+91 98202 33445',
        instructions: 'Boxes ready in front counter.',
      },
      description: 'Cartons of unopened fruit juices and calcium biscuits from an event promotion. 100% factory sealed with 6 months until best-before date.',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800&auto=format&fit=crop&q=60',
      status: 'Accepted',
      donor: initialUsers[1],
      requestedByNgo: initialUsers[4], // Roti Bank Foundation
      requestedAt: minusHours(5),
      ngoRequestNotes: 'Ideal for our afternoon children educational cluster.',
      acceptedAt: minusHours(3),
      assignedVolunteer: null, // Ready for volunteer pickup!
      assignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      deliveryProofNotes: '',
      createdAt: minusHours(5),
    },
    {
      _id: 'don_005',
      foodTitle: '50 Vegetable Pulao & Paneer Gravy Boxes',
      category: 'Cooked Meals',
      quantity: '50 Sealed Boxes',
      servingsCount: 50,
      preparationTime: minusHours(4),
      expiryTime: plusHours(5),
      pickupLocation: {
        address: 'Grand Horizon Kitchen, Sector 29',
        city: 'Delhi',
        landmark: 'Near Gate 1 Security',
        contactPhone: '+91 98110 55667',
        instructions: 'Security guard has pass for FoodBridge volunteer.',
      },
      description: 'Fresh banquet food packed neatly in aluminium foil boxes with spoons and napkins.',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60',
      status: 'In Transit',
      donor: initialUsers[2],
      requestedByNgo: initialUsers[5], // FeedTheHungry Trust
      requestedAt: minusHours(3),
      ngoRequestNotes: 'Urgent distribution at Old Delhi transit camp.',
      acceptedAt: minusHours(2),
      assignedVolunteer: initialUsers[7], // Rahul Sharma
      assignedAt: minusHours(1),
      pickedUpAt: minusHours(0.5),
      deliveredAt: null,
      deliveryProofNotes: 'Picked up 50 hot boxes from banquet loading dock.',
      createdAt: minusHours(4),
    },
    {
      _id: 'don_006',
      foodTitle: '100 Chapati & Seasonal Veg Curry Meals',
      category: 'Cooked Meals',
      quantity: '100 Meals',
      servingsCount: 100,
      preparationTime: minusHours(24),
      expiryTime: minusHours(14),
      pickupLocation: {
        address: 'Apex University Mess, Viman Nagar',
        city: 'Pune',
        landmark: 'Hostel Block C',
        contactPhone: '+91 94220 77889',
        instructions: 'Delivered successfully to city shelter.',
      },
      description: 'Nutritious dinner meals distributed smoothly yesterday evening.',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60',
      status: 'Delivered',
      donor: initialUsers[3],
      requestedByNgo: initialUsers[4],
      requestedAt: minusHours(23),
      ngoRequestNotes: 'Distributed to 100 shelter residents.',
      acceptedAt: minusHours(22),
      assignedVolunteer: initialUsers[8],
      assignedAt: minusHours(20),
      pickedUpAt: minusHours(19),
      deliveredAt: minusHours(18),
      deliveryProofNotes: 'Handed over directly to NGO Coordinator Mrs. Nalini at Dadar community kitchen.',
      createdAt: minusHours(24),
    },
  ];

  const initialMessages = [
    {
      _id: 'msg_001',
      name: 'Aditya Sen',
      email: 'aditya.sen@hospitality.com',
      phone: '+91 98200 44332',
      subject: 'Corporate Hotel Chain Partnership',
      message: 'Hello FoodBridge team, we operate 5 luxury hotels in the Mumbai MMR region and would like to integrate our daily surplus food collection directly with verified NGOs on your platform.',
      status: 'unread',
      createdAt: minusHours(10),
    },
    {
      _id: 'msg_002',
      name: 'Sneha Kulkarni',
      email: 'sneha@punevolunteers.org',
      phone: '+91 98500 22119',
      subject: 'Volunteer Fleet Onboarding in Pune',
      message: 'We have a youth club of 40 active college students with two-wheelers willing to volunteer for evening food collection drives.',
      status: 'read',
      createdAt: minusHours(36),
    },
  ];

  memoryStore = {
    users: initialUsers,
    donations: initialDonations,
    messages: initialMessages,
  };

  saveToDisk();
  console.log(`[Store] Initialized demo database with ${initialUsers.length} users, ${initialDonations.length} donations, and ${initialMessages.length} messages.`);
};

// Initialize on startup
if (!loadFromDisk() || memoryStore.users.length === 0) {
  seedInitialData();
}

// Store API helper functions
const store = {
  seedInitialData: async () => seedInitialData(),
  // Check mongo or memory
  isMongo: () => getMongoStatus(),

  // Users
  findUserByEmail: async (email) => {
    if (getMongoStatus()) {
      try {
        const u = await User.findOne({ email: email.toLowerCase() });
        if (u) return u;
      } catch (e) {
        console.warn('Mongo findUserByEmail failed, using memory store:', e.message);
      }
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: async (id) => {
    if (getMongoStatus()) {
      try {
        const u = await User.findById(id).select('-password');
        if (u) return u;
      } catch (e) {
        // Fallback to memory
      }
    }
    const found = memoryStore.users.find((u) => String(u._id) === String(id));
    if (!found) return null;
    const { password, ...safeUser } = found;
    return safeUser;
  },

  findUserByIdWithPassword: async (id) => {
    if (getMongoStatus()) {
      try {
        const u = await User.findById(id);
        if (u) return u;
      } catch (e) {
        // Fallback
      }
    }
    return memoryStore.users.find((u) => String(u._id) === String(id)) || null;
  },

  createUser: async (userData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    if (getMongoStatus()) {
      try {
        const doc = new User({
          ...userData,
          email: userData.email.toLowerCase(),
        });
        await doc.save();
        newUser._id = doc._id.toString();
      } catch (e) {
        console.warn('Mongo user save failed:', e.message);
      }
    }

    memoryStore.users.push(newUser);
    saveToDisk();

    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  updateUser: async (id, updates) => {
    if (getMongoStatus()) {
      try {
        await User.findByIdAndUpdate(id, updates);
      } catch (e) {
        // Continue to memory
      }
    }
    const idx = memoryStore.users.findIndex((u) => String(u._id) === String(id));
    if (idx !== -1) {
      memoryStore.users[idx] = {
        ...memoryStore.users[idx],
        ...updates,
      };
      saveToDisk();
      const { password, ...safeUser } = memoryStore.users[idx];
      return safeUser;
    }
    return null;
  },

  getAllUsers: async (roleFilter) => {
    if (getMongoStatus()) {
      try {
        const q = roleFilter ? { role: roleFilter } : {};
        const docs = await User.find(q).select('-password').sort({ createdAt: -1 });
        if (docs && docs.length > 0) return docs;
      } catch (e) {
        // Fallback
      }
    }
    let list = memoryStore.users.map(({ password, ...rest }) => rest);
    if (roleFilter) {
      list = list.filter((u) => u.role === roleFilter);
    }
    return list;
  },

  // Donations
  createDonation: async (donationData, donorUser) => {
    const newDonation = {
      _id: 'don_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...donationData,
      status: 'Available',
      donor: donorUser,
      requestedByNgo: null,
      requestedAt: null,
      ngoRequestNotes: '',
      acceptedAt: null,
      assignedVolunteer: null,
      assignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      deliveryProofNotes: '',
      createdAt: new Date().toISOString(),
    };

    if (getMongoStatus()) {
      try {
        const doc = new Donation({
          ...donationData,
          donor: donorUser._id,
        });
        await doc.save();
        newDonation._id = doc._id.toString();
      } catch (e) {
        console.warn('Mongo donation save failed:', e.message);
      }
    }

    memoryStore.donations.unshift(newDonation);
    saveToDisk();
    return newDonation;
  },

  getDonationById: async (id) => {
    if (getMongoStatus()) {
      try {
        const doc = await Donation.findById(id)
          .populate('donor', 'name email phone address city donorDetails')
          .populate('requestedByNgo', 'name email phone address city ngoDetails')
          .populate('assignedVolunteer', 'name email phone volunteerDetails');
        if (doc) return doc;
      } catch (e) {
        // Fallback
      }
    }
    return memoryStore.donations.find((d) => String(d._id) === String(id)) || null;
  },

  getAllDonations: async (filters = {}) => {
    let list = [...memoryStore.donations];

    if (filters.status) {
      if (filters.status === 'Available') {
        list = list.filter((d) => d.status === 'Available');
      } else if (filters.status === 'active') {
        list = list.filter((d) => ['Available', 'Requested', 'Accepted', 'Pickup Scheduled', 'In Transit'].includes(d.status));
      } else {
        list = list.filter((d) => d.status.toLowerCase() === filters.status.toLowerCase());
      }
    }

    if (filters.category && filters.category !== 'All') {
      list = list.filter((d) => d.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.city) {
      list = list.filter(
        (d) =>
          d.pickupLocation?.city?.toLowerCase().includes(filters.city.toLowerCase()) ||
          d.donor?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.donorId) {
      list = list.filter((d) => String(d.donor?._id || d.donor) === String(filters.donorId));
    }

    if (filters.ngoId) {
      list = list.filter((d) => String(d.requestedByNgo?._id || d.requestedByNgo) === String(filters.ngoId));
    }

    if (filters.volunteerId) {
      list = list.filter((d) => String(d.assignedVolunteer?._id || d.assignedVolunteer) === String(filters.volunteerId));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.foodTitle.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.pickupLocation?.address?.toLowerCase().includes(q) ||
          d.pickupLocation?.city?.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  updateDonation: async (id, updates) => {
    if (getMongoStatus()) {
      try {
        await Donation.findByIdAndUpdate(id, updates);
      } catch (e) {
        // Continue
      }
    }
    const idx = memoryStore.donations.findIndex((d) => String(d._id) === String(id));
    if (idx !== -1) {
      memoryStore.donations[idx] = {
        ...memoryStore.donations[idx],
        ...updates,
      };
      saveToDisk();
      return memoryStore.donations[idx];
    }
    return null;
  },

  deleteDonation: async (id) => {
    if (getMongoStatus()) {
      try {
        await Donation.findByIdAndDelete(id);
      } catch (e) {
        // Continue
      }
    }
    const idx = memoryStore.donations.findIndex((d) => String(d._id) === String(id));
    if (idx !== -1) {
      const removed = memoryStore.donations.splice(idx, 1)[0];
      saveToDisk();
      return removed;
    }
    return null;
  },

  // Contact Messages
  createContactMessage: async (msgData) => {
    const newMsg = {
      _id: 'msg_' + Date.now(),
      ...msgData,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    if (getMongoStatus()) {
      try {
        const doc = new ContactMessage(msgData);
        await doc.save();
        newMsg._id = doc._id.toString();
      } catch (e) {
        // Fallback
      }
    }
    memoryStore.messages.unshift(newMsg);
    saveToDisk();
    return newMsg;
  },

  getAllContactMessages: async () => {
    return [...memoryStore.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // System statistics
  getStatistics: async () => {
    const donations = memoryStore.donations;
    const users = memoryStore.users;

    const totalDonations = donations.length;
    const completedDonations = donations.filter((d) => d.status === 'Delivered').length;
    const activeDonations = donations.filter((d) =>
      ['Available', 'Requested', 'Accepted', 'Pickup Scheduled', 'In Transit'].includes(d.status)
    ).length;

    // Calculate total estimated meals / servings distributed
    const totalMealsDistributed = donations
      .filter((d) => d.status === 'Delivered')
      .reduce((acc, curr) => acc + (Number(curr.servingsCount) || 20), 0);

    const availableMeals = donations
      .filter((d) => d.status === 'Available')
      .reduce((acc, curr) => acc + (Number(curr.servingsCount) || 15), 0);

    const registeredDonors = users.filter((u) => u.role === 'donor').length;
    const registeredNgos = users.filter((u) => u.role === 'ngo').length;
    const verifiedNgos = users.filter((u) => u.role === 'ngo' && u.ngoDetails?.isVerified).length;
    const registeredVolunteers = users.filter((u) => u.role === 'volunteer').length;

    return {
      totalDonations,
      completedDonations,
      activeDonations,
      totalMealsDistributed: totalMealsDistributed + 14250, // Base impact + live completed
      availableMeals,
      registeredDonors: registeredDonors + 34,
      registeredNgos: registeredNgos + 18,
      verifiedNgos,
      registeredVolunteers: registeredVolunteers + 52,
    };
  },
};

module.exports = store;
