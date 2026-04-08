/* ============================================
   ICMS - Backend API Integration (React/Vite)
   ============================================ */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:8081";

let authToken = localStorage.getItem("icms_token");

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    };
    if (authToken) config.headers.Authorization = `Bearer ${authToken}`;

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); } catch (e) { console.warn("Response is not JSON:", text); }
      }
      if (!response.ok) {
        if (response.status === 400) throw new Error(data?.message || 'Invalid request');
        else if (response.status === 401) throw new Error(data?.message || 'Invalid email or password');
        else if (response.status === 403) throw new Error(data?.message || 'Access denied');
        else if (response.status === 500) throw new Error(data?.message || 'Server error. Please try again.');
        else throw new Error(data?.message || 'Something went wrong');
      }
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, { method: "POST", body: JSON.stringify(data) });
  }

  put(endpoint, data, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "PUT", body: JSON.stringify(data) });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  setToken(token) { authToken = token; localStorage.setItem("icms_token", token); }
  removeToken() { authToken = null; localStorage.removeItem("icms_token"); }
  getToken() { return authToken; }
  isAuthenticated() { return !!authToken; }
}

const api = new ApiClient(API_BASE_URL);

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    if (response?.token) api.setToken(response.token);
    return response;
  },
  async register(userData) { return await api.post("/auth/register", userData); },
  async verifyOtp(email, otp) { return await api.post("/auth/verify-otp", { email, otp }); },
  async resendOtp(email) { return await api.post("/auth/resend-otp", { email }); },
  async getProfile(email) { return await api.get("/auth/profile", { email }); },
  logout() { api.removeToken(); },
};

// ============================================
// COMPLAINTS API
// ============================================

export const complaintsAPI = {
  async getAllComplaints() { return await api.get("/complaints"); },
  async getMyComplaints() { return await api.get("/complaints/my"); },

  async createComplaint(formData) {
    const url = `${API_BASE_URL}/complaints`;
    const currentToken = localStorage.getItem("icms_token");
    const response = await fetch(url, {
      method: "POST",
      headers: { ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}) },
      body: formData,
    });
    const text = await response.text();
    let data = null;
    if (text) { try { data = JSON.parse(text); } catch (e) { console.warn("Not JSON:", text); } }
    if (!response.ok) throw new Error(data?.message || "Failed to create complaint");
    return data;
  },

  async updateComplaintStatus(id, status) {
    return await api.put(`/complaints/${id}/status`, {}, { status });
  },

  async deleteComplaint(id) { return await api.delete(`/complaints/${id}`); },
};

// ============================================
// WORKERS API
// ============================================

export const workersAPI = {
  async getAllWorkers() { return await api.get("/workers"); },
  async addWorker(worker) { return await api.post("/workers", worker); },
  async updateWorker(id, worker) { return await api.put(`/workers/${id}`, worker); },
  async deleteWorker(id) { return await api.delete(`/workers/${id}`); },
  async getDepartmentStats() { return await api.get("/workers/stats"); },
  async getByDepartment(dept) { return await api.get(`/workers/department/${encodeURIComponent(dept)}`); },
};

// ============================================
// API UTILITIES
// ============================================

export const apiUtils = {
  handleError(error, customMessage = "Something went wrong") {
    console.error("API Error:", error);
    return error.message || customMessage;
  },

  formatDate(dateString) {
    if (!dateString) return '—';
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  },

  getImageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${UPLOADS_BASE_URL}/${imagePath}`;
  },

  getStatusBadge(status) {
    const badges = {
      PENDING: '<span class="status-badge status-pending">Pending</span>',
      IN_PROGRESS: '<span class="status-badge status-in-progress">In Progress</span>',
      RESOLVED: '<span class="status-badge status-resolved">Resolved</span>',
    };
    return badges[status] || badges.PENDING;
  },
};

export { UPLOADS_BASE_URL };
export default api;
