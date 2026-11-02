const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
  : '/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('foodbridge_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (updates) => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  // Donations
  getDonations: async (filters = {}) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${BASE_URL}/donations?${query.toString()}`);
    return handleResponse(res);
  },

  getDonationById: async (id) => {
    const res = await fetch(`${BASE_URL}/donations/${id}`);
    return handleResponse(res);
  },

  createDonation: async (donationData) => {
    const res = await fetch(`${BASE_URL}/donations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData),
    });
    return handleResponse(res);
  },

  updateDonation: async (id, updates) => {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  deleteDonation: async (id) => {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Donation Workflow Actions
  requestDonation: async (id, notes = '') => {
    const res = await fetch(`${BASE_URL}/donations/${id}/request`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes }),
    });
    return handleResponse(res);
  },

  confirmRequest: async (id, action) => {
    const res = await fetch(`${BASE_URL}/donations/${id}/confirm-request`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action }), // 'accept' or 'reject'
    });
    return handleResponse(res);
  },

  claimTask: async (id) => {
    const res = await fetch(`${BASE_URL}/donations/${id}/claim-task`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateDeliveryStatus: async (id, status, notes = '') => {
    const res = await fetch(`${BASE_URL}/donations/${id}/update-delivery`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(res);
  },

  // Public Stats & Contact
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`);
    return handleResponse(res);
  },

  submitContact: async (data) => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Admin APIs (Protected by JWT and requireRole('admin'))
  getAdminOverview: async () => {
    const res = await fetch(`${BASE_URL}/admin/overview`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminUsers: async (role) => {
    const url = role ? `${BASE_URL}/admin/users?role=${role}` : `${BASE_URL}/admin/users`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  toggleNgoVerification: async (ngoId, isVerified) => {
    const res = await fetch(`${BASE_URL}/admin/ngos/${ngoId}/verify`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ isVerified }),
    });
    return handleResponse(res);
  },

  deleteDonationAdmin: async (donationId) => {
    const res = await fetch(`${BASE_URL}/admin/donations/${donationId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAdminMessages: async () => {
    const res = await fetch(`${BASE_URL}/admin/messages`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
