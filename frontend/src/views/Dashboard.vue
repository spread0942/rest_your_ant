<template>
  <div class="dashboard">
    <!-- Top Navigation Bar -->
    <nav class="dashboard-nav">
      <div class="nav-brand">
        <h1>🍽️ {{ selectedRestaurant.name || 'Restaurant Manager' }}</h1>
      </div>
      <div class="nav-user">
        <span class="welcome-text">Welcome back, {{ user.firstname || 'User' }}!</span>
        <button @click="goToRestaurants" class="restaurant-btn">
          <span>🏪</span> Cambia Ristorante
        </button>
        <div class="user-avatar">{{ getUserInitial() }}</div>
        <button @click="logout" class="logout-btn">
          <span>🚪</span> Logout
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Quick Stats -->
      <section class="stats-section">
        <h2>📊 Today's Overview</h2>
        <div class="stats-grid">
          <div class="stat-card orders">
            <div class="stat-icon">🛒</div>
            <div class="stat-content">
              <h3>{{ stats.todayOrders }}</h3>
              <p>Orders Today</p>
            </div>
          </div>
          <div class="stat-card revenue">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>${{ stats.todayRevenue }}</h3>
              <p>Revenue Today</p>
            </div>
          </div>
          <div class="stat-card tables">
            <div class="stat-icon">🪑</div>
            <div class="stat-content">
              <h3>{{ stats.activeTables }}/{{ stats.totalTables }}</h3>
              <p>Active Tables</p>
            </div>
          </div>
          <div class="stat-card customers">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>{{ stats.todayCustomers }}</h3>
              <p>Customers Served</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="actions-section">
        <h2>⚡ Azioni Rapide</h2>
        <div class="actions-grid">
          <div class="action-card" @click="navigateTo('/menu')">
            <div class="action-icon">📖</div>
            <h3>Vedi i Menu</h3>
            <p>Modifica piatti e prezzi</p>
          </div>
          <div class="action-card" @click="navigateTo('/orders')">
            <div class="action-icon">📋</div>
            <h3>Gestisci Ordini</h3>
            <p>Visualizza e gestisci gli ordini dei clienti</p>
          </div>
          <div class="action-card" @click="navigateTo('/tables')">
            <div class="action-icon">🍽️</div>
            <h3>Gestisci Tavoli</h3>
            <p>Monitora lo stato dei tavoli</p>
          </div>
          <div class="action-card" @click="navigateTo('/inventory')">
            <div class="action-icon">📦</div>
            <h3>Gestisci Magazzino</h3>
            <p>Controlla i livelli di stock</p>
          </div>
        </div>
      </section>

      <!-- Recent Orders -->
      <section class="recent-orders">
        <h2>🕒 Ordini Recenti</h2>
        <div class="orders-list">
          <div v-for="order in recentOrders" :key="order.id" class="order-item">
            <div class="order-info">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-table">Table {{ order.table }}</span>
              <span class="order-time">{{ formatTime(order.createdAt) }}</span>
            </div>
            <div class="order-status" :class="order.status.toLowerCase()">
              {{ order.status }}
            </div>
            <div class="order-total">${{ order.total }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      user: {
        firstname: '',
        lastname: '',
        email: '',
        role: ''
      },
      selectedRestaurant: {
        id: null,
        name: '',
        address: '',
        phone: ''
      },
      stats: {
        todayOrders: 47,
        todayRevenue: 1250.50,
        activeTables: 8,
        totalTables: 12,
        todayCustomers: 123
      },
      recentOrders: [
        {
          id: 1023,
          table: 5,
          status: 'Preparing',
          total: 45.30,
          createdAt: new Date(Date.now() - 5 * 60000) // 5 minutes ago
        },
        {
          id: 1022,
          table: 3,
          status: 'Ready',
          total: 78.90,
          createdAt: new Date(Date.now() - 12 * 60000) // 12 minutes ago
        },
        {
          id: 1021,
          table: 7,
          status: 'Delivered',
          total: 32.50,
          createdAt: new Date(Date.now() - 25 * 60000) // 25 minutes ago
        },
        {
          id: 1020,
          table: 2,
          status: 'Paid',
          total: 89.75,
          createdAt: new Date(Date.now() - 45 * 60000) // 45 minutes ago
        }
      ]
    }
  },
  methods: {
    getUserInitial() {
      if (this.user.firstname) {
        return this.user.firstname.charAt(0).toUpperCase();
      }
      return 'U'; // Default fallback
    },
    loadUserData() {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          this.user = JSON.parse(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to default
        this.user = {
          firstname: 'User',
          lastname: '',
          email: '',
          role: 'user'
        };
      }
    },
    loadRestaurantData() {
      try {
        const restaurantData = localStorage.getItem('selectedRestaurant');
        if (restaurantData) {
          this.selectedRestaurant = JSON.parse(restaurantData);
        } else {
          // No restaurant selected, redirect to restaurants page
          this.$router.push('/restaurants');
        }
      } catch (error) {
        console.error('Error loading restaurant data:', error);
        this.$router.push('/restaurants');
      }
    },
    goToRestaurants() {
      this.$router.push('/restaurants');
    },
    logout() {
      // Clear authentication and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedRestaurant');
      this.$router.push('/login');
    },
    navigateTo(path) {
      this.$router.push(path);
    },
    formatTime(date) {
      return date.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
    async loadDashboardData() {
      try {
        // Here you would normally fetch data from your API
        const response = await fetch('http://localhost:3000/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          this.stats = data.stats;
          this.recentOrders = data.recentOrders;
        }
      } catch (error) {
        console.log('Using mock data - API not available');
      }
    }
  },
  async mounted() {
    // Load user data from localStorage
    this.loadUserData();
    
    // Load restaurant data from localStorage
    this.loadRestaurantData();
    
    // Load dashboard data
    await this.loadDashboardData();
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Navigation */
.dashboard-nav {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand h1 {
  color: #667eea;
  margin: 0;
  font-size: 1.8rem;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: #666;
  font-weight: 500;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
}

.restaurant-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  margin-right: 1rem;
}

.restaurant-btn:hover {
  background: #0056b3;
}

/* Main Content */
.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-content section {
  margin-bottom: 3rem;
}

.dashboard-content h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

/* Stats Section */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orders .stat-icon { background: #e3f2fd; }
.revenue .stat-icon { background: #f3e5f5; }
.tables .stat-icon { background: #e8f5e8; }
.customers .stat-icon { background: #fff3e0; }

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.stat-content p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

/* Actions Section */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.action-card p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

/* Recent Orders */
.orders-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  overflow: hidden;
}

.order-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;
}

.order-item:last-child {
  border-bottom: none;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-id {
  font-weight: bold;
  color: #333;
}

.order-table, .order-time {
  font-size: 0.8rem;
  color: #666;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.order-status.preparing {
  background: #fff3cd;
  color: #856404;
}

.order-status.ready {
  background: #d4edda;
  color: #155724;
}

.order-status.delivered {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status.paid {
  background: #f8d7da;
  color: #721c24;
}

.order-total {
  font-weight: bold;
  color: #28a745;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-nav {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-user {
    flex-direction: column;
    gap: 0.5rem;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .order-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
