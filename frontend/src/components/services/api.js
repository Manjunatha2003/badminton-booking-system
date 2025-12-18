const API_BASE = 'http://localhost:3000/api';

export const api = {
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
    changePassword: async (userId, currentPassword, newPassword) => {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword })
      });
      if (!res.ok) throw new Error('Password change failed');
      return res.json();
    }
  },

  courts: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/courts`);
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/courts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

  equipment: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/equipment`);
      return res.json();
    }
  },

  coaches: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/coaches`);
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/coaches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

  pricing: {
    getRules: async () => {
      const res = await fetch(`${API_BASE}/pricing/rules`);
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
    calculate: async (data) => {
      const res = await fetch(`${API_BASE}/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

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
    getByEmail: async (email) => {
      const res = await fetch(`${API_BASE}/bookings?email=${email}`);
      return res.json();
    },
    cancel: async (id) => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    },
    getAvailableSlots: async (date) => {
      const res = await fetch(`${API_BASE}/availability?date=${date}`);
      return res.json();
    }
  }
};