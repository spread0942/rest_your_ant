<template>
  <div id="app">
    <header class="app-header">
      <h1>🍽️ Restaurant Management System</h1>
      <p class="subtitle">Welcome to the Restaurant Management Frontend</p>
    </header>
    
    <main class="main-content">
      <div class="hello-container">
        <h2>{{ msg }}</h2>
        <p class="description">
          This is a Vue.js frontend for the Restaurant Management API.
          The application is running in a Docker container and ready for development!
        </p>
        
        <div class="features">
          <h3>🚀 Features Coming Soon:</h3>
          <ul>
            <li>Restaurant Management</li>
            <li>Menu & Plate Management</li>
            <li>Order Processing</li>
            <li>Table Reservation</li>
            <li>User Authentication</li>
          </ul>
        </div>
        
        <div class="status">
          <h3>📡 API Status:</h3>
          <button @click="checkApiStatus" :disabled="loading">
            {{ loading ? 'Checking...' : 'Check API Connection' }}
          </button>
          <p v-if="apiStatus" :class="apiStatus.success ? 'success' : 'error'">
            {{ apiStatus.message }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      msg: 'Hello World from Vue.js! 👋',
      loading: false,
      apiStatus: null
    }
  },
  methods: {
    async checkApiStatus() {
      this.loading = true;
      this.apiStatus = null;
      
      try {
        // Try to connect to the API container
        const response = await fetch('http://localhost:3000/api/health');
        
        if (response.ok) {
          const data = await response.json();
          this.apiStatus = {
            success: true,
            message: `✅ API is running! ${data.message || 'Connection successful'}`
          };
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        this.apiStatus = {
          success: false,
          message: `❌ Cannot connect to API: ${error.message}`
        };
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hello-container {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
}

.hello-container h2 {
  color: #667eea;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2rem;
}

.features {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 2rem 0;
  text-align: left;
}

.features h3 {
  color: #667eea;
  margin-top: 0;
  text-align: center;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.features li:before {
  content: "✨ ";
  margin-right: 0.5rem;
}

.status {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.status h3 {
  color: #667eea;
  margin-top: 0;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.success {
  color: #28a745;
  font-weight: bold;
  margin-top: 1rem;
}

.error {
  color: #dc3545;
  font-weight: bold;
  margin-top: 1rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
}
</style>
