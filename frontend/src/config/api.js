const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000/api';

// Simple HTTP client
const api = {
  apiEndpoint: API_ENDPOINT,

  async request(url, options = {}) {
    const fullUrl = `${API_ENDPOINT}${url}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(fullUrl, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options });
  },

  async post(url, data, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  },

  async patch(url, data, options = {}) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  },

  async delete(url, options = {}) {
    return this.request(url, { method: 'DELETE', ...options });
  }
};

export default api;