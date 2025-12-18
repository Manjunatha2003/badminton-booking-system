// ✅ Backend URL (Render)
const API_BASE = 'https://badminton-booking-system-bb3i.onrender.com/api';

export const api = {
  // ================= AUTH =================
  auth: {
    signup: async (username, email, password) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Signup failed');
      }
      return res.json();
    },

    login: async (username, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
      return res.json();
    },

    changePassword: async (userId, currentPassword, newPassword) => {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Password change failed');
      }
      return res.json();
    }
  },

  // ================= COURTS =================
  courts: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/courts`);
      return res.json();
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE}/courts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/courts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/courts/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    }
  },

  // ================= EQUIPMENT =================
  equipment: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/equipment`);
      return res.json();
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/equipment/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    }
  },

  // ================= COACHES =================
  coaches: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/coaches`);
      return res.json();
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE}/coaches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/coaches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/coaches/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    }
  },

  // ================= PRICING =================
  pricing: {
    getRules: async () => {
      const res = await fetch(`${API_BASE}/pricing/rules`);
      return res.json();
    },

    create: async (data) => {
      const res = await fetch(`${API_BASE}/pricing/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    updateRule: async (id, data) => {
      const res = await fetch(`${API_BASE}/pricing/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/pricing/rules/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    },

    calculate: async (data) => {
      const res = await fetch(`${API_BASE}/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

  // ================= BOOKINGS =================
  bookings: {
    create: async (data) => {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Booking failed');
      }
      return res.json();
    },

    getByUserId: async (userId) => {
      const res = await fetch(`${API_BASE}/bookings?userId=${userId}`);
      return res.json();
    },

    cancel: async (id) => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    },

    getAvailableSlots: async (date) => {
      const res = await fetch(`${API_BASE}/bookings/availability?date=${date}`);
      if (!res.ok) throw new Error('Failed to fetch slots');
      return res.json();
    }
  }
};
