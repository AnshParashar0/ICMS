/* ============================================
   ICMS - Backend API Integration (React/Vite copy)
   Connects frontend to Java Spring Boot backend
   ============================================ */

// API Configuration
const API_BASE_URL = "http://localhost:8081/api";

// Store JWT token
let authToken = localStorage.getItem("icms_token");

// ============================================
// API CLIENT CLASS
// ============================================

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

    // Attach JWT token if available
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(url, config);

      // Safely read response text first
      const text = await response.text();
      let data = null;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Response is not JSON:", text);
        }
      }

      if (!response.ok) {
  if (response.status === 400) {
    throw new Error(data?.message || 'Invalid request');
  } else if (response.status === 401) {
    throw new Error(data?.message || 'Invalid email or password');
  } else if (response.status === 403) {
    throw new Error(data?.message || 'Access denied');
  } else if (response.status === 500) {
    throw new Error(data?.message || 'Server error. Please try again.');
  } else {
    throw new Error(data?.message || 'Something went wrong');
  }
}

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // =========================
  // HTTP METHODS
  // =========================

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  // =========================
  // TOKEN MANAGEMENT
  // =========================

  setToken(token) {
    authToken = token;
    localStorage.setItem("icms_token", token);
  }

  removeToken() {
    authToken = null;
    localStorage.removeItem("icms_token");
  }

  getToken() {
    return authToken;
  }

  isAuthenticated() {
    return !!authToken;
  }
}

// Create API client instance
const api = new ApiClient(API_BASE_URL);

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);

    if (response?.token) {
      api.setToken(response.token);
    }

    return response;
  },

  async register(userData) {
    return await api.post("/auth/register", userData);
  },

  async getProfile(email) {
    return await api.get("/auth/profile", { email });
  },

  logout() {
    api.removeToken();
  },
};

// ============================================
// COMPLAINTS API
// ============================================

export const complaintsAPI = {
  // ADMIN
  async getAllComplaints() {
    return await api.get("/complaints");
  },

  // STUDENT
  async getMyComplaints() {
    return await api.get("/complaints/my");
  },

  async createComplaint(formData) {
  // ✅ Send FormData directly, no JSON stringify
  const url = `${API_BASE_URL}/complaints`;
  const currentToken = localStorage.getItem("icms_token");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      // ✅ Don't set Content-Type — browser sets it automatically for FormData
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    },
    body: formData,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch (e) { console.warn("Not JSON:", text); }
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create complaint");
  }

  return data;
},

  async updateComplaintStatus(id, status) {
    return await api.put(`/complaints/${id}/status`, {}, { status });
  },

  async deleteComplaint(id) {
    return await api.delete(`/complaints/${id}`);
  },
};

// ============================================
// API UTILITIES
// ============================================

export const apiUtils = {
  handleError(error, customMessage = "Something went wrong") {
    console.error("API Error:", error);

    let message = customMessage;

    if (error.message) {
      message = error.message;
    }

    if (typeof window !== "undefined") {
      // Fallback basic alert; can be replaced with a nicer UI
      // eslint-disable-next-line no-alert
      alert(message);
    }

    return message;
  },

  showLoading() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.classList.remove("d-none");
  },

  hideLoading() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.classList.add("d-none");
  },

  formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  },

  getStatusBadge(status) {
    const badges = {
      PENDING: '<span class="status-badge status-pending">Pending</span>',
      IN_PROGRESS:
        '<span class="status-badge status-in-progress">In Progress</span>',
      RESOLVED: '<span class="status-badge status-resolved">Resolved</span>',
    };

    return badges[status] || badges.PENDING;
  },
};

export default api;

