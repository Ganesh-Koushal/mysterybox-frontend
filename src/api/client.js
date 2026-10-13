const rawBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;

export const getAuthToken = () => localStorage.getItem('mysterybox_token');
export const setAuthToken = (token) => localStorage.setItem('mysterybox_token', token);
export const removeAuthToken = () => localStorage.removeItem('mysterybox_token');

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    // Network / connection error
    throw new Error(`Unable to connect to MysteryBox server (${url}). Please ensure the backend is running.`);
  }
}

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getCurrentUser: () => request('/auth/me')
};

export const caseApi = {
  getAll: () => request('/cases'),
  getById: (id) => request(`/cases/${id}`),
  getClues: (id) => request(`/cases/${id}/clues`),
  getEvidence: (id) => request(`/cases/${id}/evidence`),
  submitAnswer: (id, answer) => request(`/cases/${id}/submit`, { method: 'POST', body: JSON.stringify({ answer }) })
};

export const progressApi = {
  getProgress: () => request('/progress')
};

export const adminApi = {
  getAllCases: () => request('/admin/cases'),
  getCaseById: (id) => request(`/admin/cases/${id}`),
  createCase: (caseData) => request('/admin/cases', { method: 'POST', body: JSON.stringify(caseData) }),
  updateCase: (id, caseData) => request(`/admin/cases/${id}`, { method: 'PUT', body: JSON.stringify(caseData) }),
  deleteCase: (id) => request(`/admin/cases/${id}`, { method: 'DELETE' })
};

export default {
  auth: authApi,
  cases: caseApi,
  progress: progressApi,
  admin: adminApi
};
