<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Header with Logo -->
      <div class="login-header">
        <h1 class="logo-title">
          <span class="logo-perfect">Perfect</span><span class="logo-menu">Menu</span>
        </h1>
        <p class="logo-subtitle">Gestisci i tuoi menu tutto in un unica piattaforma</p>
      </div>

      <!-- Login Card with Neumorphism -->
      <div class="login-card">
        <div class="card-content">
          <!-- Login Title -->
          <div class="login-title-section">
            <h2 class="login-title">Accedi</h2>
            <p class="login-subtitle">Inserisci le tue credenziali per continuare</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-fields">
              <!-- Email Field -->
              <div class="form-group">
                <label for="email" class="field-label">Email</label>
                <div class="input-container">
                  <i class="fi fi-rr-envelope input-icon"></i>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="credentials.email"
                    required 
                    placeholder="Inserisci la tua email"
                    class="form-input"
                  >
                </div>
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <label for="password" class="field-label">Password</label>
                <div class="input-container">
                  <i class="fi fi-rr-lock input-icon"></i>
                  <input 
                    type="password" 
                    id="password" 
                    v-model="credentials.password"
                    required 
                    placeholder="Inserisci la tua password"
                    class="form-input"
                  >
                </div>
              </div>
            </div>

            <!-- Forgot Password Link -->
            <div class="forgot-password">
              <a href="#" class="forgot-link">Password dimenticata?</a>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="login-btn" :disabled="loading">
              {{ loading ? 'Accesso in corso...' : 'Accedi' }}
            </button>

            <!-- Error Message -->
            <p v-if="error" class="error-message">{{ error }}</p>
          </form>
        </div>
      </div>

      <!-- Demo Credentials (for development) -->
      <div class="demo-credentials" v-if="showDemo">
        <p><strong>Credenziali Demo:</strong></p>
        <p>Email: admin@restaurant.com</p>
        <p>Password: admin123</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      loading: false,
      error: null,
      showDemo: process.env.NODE_ENV === 'development' // Show demo credentials only in development
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
          const response = await fetch('http://localhost:3000/api/accounts/login', {
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
        this.error = 'Email o password non validi. Prova le credenziali demo.';
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
/* Login Page with Neumorphism Design */
.login-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Urbanist', sans-serif;
}

.login-container {
  width: 100%;
  max-width: 448px;
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
}

/* Header Section */
.login-header {
  text-align: center;
  width: 338px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logo-title {
  font-size: 48px;
  font-weight: 400;
  margin: 0;
  line-height: normal;
  letter-spacing: -2.88px;
}

.logo-perfect {
  font-family: 'Urbanist', sans-serif;
  font-weight: 800;
  color: #f92561;
}

.logo-menu {
  font-family: 'Urbanist', sans-serif;
  font-weight: 300;
  color: rgba(20, 0, 3, 0.58);
}

.logo-subtitle {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  line-height: normal;
}

/* Login Card with Neumorphism */
.login-card {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 25px 28px;
  width: 100%;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  box-sizing: border-box;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 392px;
  margin: 0 auto;
}

/* Login Title Section */
.login-title-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 282px;
  margin: 0 auto;
}

.login-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.login-subtitle {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #979ea5;
  margin: 0;
  line-height: normal;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  line-height: normal;
}

.input-container {
  position: relative;
  background: #f3f4f6;
  border-radius: 8px;
  height: 45px;
  display: flex;
  align-items: center;
  padding: 12px 17px;
  box-shadow: -8px -8px 16px 0px inset #ffffff, 8px 8px 16px 0px inset #dfe2e7;
  box-sizing: border-box;
}

.input-icon {
  font-size: 16px;
  color: #979ea5;
  margin-right: 12px;
  flex-shrink: 0;
}

.form-input {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #140003;
  line-height: normal;
}

.form-input::placeholder {
  color: #979ea5;
  font-family: 'Urbanist', sans-serif;
}

.form-input:focus {
  outline: none;
}

/* Forgot Password */
.forgot-password {
  text-align: center;
}

.forgot-link {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #d41e51;
  text-decoration: underline;
  text-underline-position: from-font;
  line-height: normal;
}

.forgot-link:hover {
  color: #c11d4a;
}

/* Login Button */
.login-btn {
  background: #d41e51;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 5px 26px;
  height: 46px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #f2abbf;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: normal;
}

.login-btn:hover:not(:disabled) {
  background: #c11d4a;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #f2abbf;
}

.login-btn:active:not(:disabled) {
  box-shadow: inset -2px -2px 4px 0px #ffffff, inset 2px 2px 4px 0px #f2abbf;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  color: #d41e51;
  text-align: center;
  margin: 0;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
}

/* Demo Credentials (development only) */
.demo-credentials {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
}

.demo-credentials p {
  margin: 0.25rem 0;
  color: #666;
  font-family: 'Urbanist', sans-serif;
}

.demo-credentials p:first-child {
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-container {
    gap: 32px;
  }

  .login-header {
    width: 100%;
  }

  .logo-title {
    font-size: 36px;
  }

  .login-card {
    padding: 20px;
  }

  .card-content {
    width: 100%;
    gap: 24px;
  }

  .login-title-section {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .logo-title {
    font-size: 28px;
    letter-spacing: -1.68px;
  }

  .login-title {
    font-size: 24px;
  }

  .input-container {
    padding: 10px 15px;
  }
}
</style>
