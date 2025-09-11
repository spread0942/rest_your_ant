<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🍽️ Restaurant Manager</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="credentials.email"
              required 
              placeholder="Enter your email"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="credentials.password"
              required 
              placeholder="Enter your password"
            >
          </div>
          
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
        
        <div class="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: admin@restaurant.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/config/api.js'

export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;
      
      try {
        // Demo login - accept admin credentials
        if (this.credentials.email === 'admin@restaurant.com' && 
            this.credentials.password === 'admin123') {
          
          // Store auth token (in real app, get from API)
          localStorage.setItem('authToken', 'demo-token-123');
          localStorage.setItem('user', JSON.stringify({
            firstname: 'Mario',
            lastname: 'Rossi',
            email: this.credentials.email,
            role: 'admin'
          }));
          
          // Redirect to restaurants page
          this.$router.push('/restaurants');
        } else {
          // Try real API login
          const response = await fetch(`${apiConfig.apiEndpoint}/accounts/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.credentials)
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Store auth token and user data including firstname
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('user', JSON.stringify({
              firstname: data.data.account.firstName || data.data.account.username || 'User',
              lastname: data.data.account.lastName || '',
              email: data.data.account.email,
              role: data.data.account.role || 'user'
            }));
            
            this.$router.push('/restaurants');
          } else {
            throw new Error('Invalid credentials');
          }
        }
      } catch (error) {
        this.error = 'Invalid email or password. Try the demo credentials.';
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    // Check if already logged in
    if (localStorage.getItem('authToken')) {
      this.$router.push('/restaurants');
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #667eea;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.login-header p {
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
}

.demo-credentials {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.demo-credentials p {
  margin: 0.25rem 0;
  color: #666;
}

.demo-credentials p:first-child {
  color: #333;
  margin-bottom: 0.5rem;
}

@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
}
</style>
