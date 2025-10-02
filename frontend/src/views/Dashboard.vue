<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent 
        :restaurants="restaurants" 
        :selectedRestaurant="selectedRestaurant"
        @restaurant-changed="handleRestaurantChanged" 
      />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Panoramica generale del ristorante</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon orders-icon">
                <i class="fi fi-rr-shopping-cart"></i>
              </div>
              <div class="stat-info">
                <h3 class="stat-title">Ordini Oggi</h3>
                <p class="stat-value">{{ stats.todayOrders }}</p>
              </div>
            </div>
            <div class="stat-trend positive">
              <span class="trend-icon">↗</span>
              <span class="trend-text">+12% da ieri</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon revenue-icon">
                <i class="fi fi-rr-euro"></i>
              </div>
              <div class="stat-info">
                <h3 class="stat-title">Incasso Oggi</h3>
                <p class="stat-value">€{{ stats.todayRevenue }}</p>
              </div>
            </div>
            <div class="stat-trend positive">
              <span class="trend-icon">↗</span>
              <span class="trend-text">+8% da ieri</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon tables-icon">
                <i class="fi fi-rr-table"></i>
              </div>
              <div class="stat-info">
                <h3 class="stat-title">Tavoli Attivi</h3>
                <p class="stat-value">{{ stats.activeTables }}/{{ stats.totalTables }}</p>
              </div>
            </div>
            <div class="stat-trend neutral">
              <span class="trend-icon">→</span>
              <span class="trend-text">Stabile</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon customers-icon">
                <i class="fi fi-rr-users"></i>
              </div>
              <div class="stat-info">
                <h3 class="stat-title">Clienti Serviti</h3>
                <p class="stat-value">{{ stats.todayCustomers }}</p>
              </div>
            </div>
            <div class="stat-trend positive">
              <span class="trend-icon">↗</span>
              <span class="trend-text">+15% da ieri</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="actions-section">
        <h2 class="section-title">Azioni Rapide</h2>
        <div class="actions-grid">
          <div class="action-card" @click="navigateTo('/menu')">
            <div class="action-icon">
              <i class="fi fi-rr-book-alt"></i>
            </div>
            <div class="action-content">
              <h3 class="action-title">Gestisci Menu</h3>
              <p class="action-description">Modifica piatti e categorie</p>
            </div>
            <div class="action-arrow">
              <i class="fi fi-rr-angle-right"></i>
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/aree-tavoli')">
            <div class="action-icon">
              <i class="fi fi-rr-reservation-table"></i>
            </div>
            <div class="action-content">
              <h3 class="action-title">Gestisci Tavoli</h3>
              <p class="action-description">Monitora aree e tavoli</p>
            </div>
            <div class="action-arrow">
              <i class="fi fi-rr-angle-right"></i>
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/piatti')">
            <div class="action-icon">
              <i class="fi fi-rr-plate-wheat"></i>
            </div>
            <div class="action-content">
              <h3 class="action-title">Gestisci Piatti</h3>
              <p class="action-description">Modifica ingredienti e prezzi</p>
            </div>
            <div class="action-arrow">
              <i class="fi fi-rr-angle-right"></i>
            </div>
          </div>

          <div class="action-card" @click="navigateTo('/drinks')">
            <div class="action-icon">
              <i class="fi fi-rr-glass"></i>
            </div>
            <div class="action-content">
              <h3 class="action-title">Bevande</h3>
              <p class="action-description">Gestisci bevande del menu</p>
            </div>
            <div class="action-arrow">
              <i class="fi fi-rr-angle-right"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Section -->
      <div class="recent-section">
        <h2 class="section-title">Ordini Recenti</h2>
        <div class="orders-container">
          <div class="order-item" v-for="order in recentOrders" :key="order.id">
            <div class="order-info">
              <div class="order-id">#{{ order.id }}</div>
              <div class="order-details">
                <span class="order-table">Tavolo {{ order.table }}</span>
                <span class="order-time">{{ formatTime(order.createdAt) }}</span>
              </div>
            </div>
            <div class="order-status" :class="order.status.toLowerCase()">
              {{ getStatusText(order.status) }}
            </div>
            <div class="order-total">€{{ order.total.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/SidebarComponent.vue'
import restaurantMixin from '@/mixins/restaurantMixin.js'

export default {
  name: 'DashboardView',
  mixins: [restaurantMixin],
  components: {
    SidebarComponent
  },
  data() {
    return {
      loading: true,
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
          status: 'preparing',
          total: 45.30,
          createdAt: new Date(Date.now() - 5 * 60000) // 5 minutes ago
        },
        {
          id: 1022,
          table: 3,
          status: 'ready',
          total: 78.90,
          createdAt: new Date(Date.now() - 12 * 60000) // 12 minutes ago
        },
        {
          id: 1021,
          table: 7,
          status: 'delivered',
          total: 32.50,
          createdAt: new Date(Date.now() - 25 * 60000) // 25 minutes ago
        },
        {
          id: 1020,
          table: 2,
          status: 'paid',
          total: 89.75,
          createdAt: new Date(Date.now() - 45 * 60000) // 45 minutes ago
        }
      ]
    }
  },
  methods: {
    handleRestaurantChanged(restaurant) {
      console.log('Restaurant changed in Dashboard:', restaurant)
      // The mixin will handle updating the service
      restaurantMixin.methods.handleRestaurantChanged.call(this, restaurant)
      // Update dashboard data based on selected restaurant
      this.loadDashboardData()
    },
    navigateTo(path) {
      this.$router.push(path)
    },
    formatTime(date) {
      return date.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
    getStatusText(status) {
      const statusMap = {
        'preparing': 'In Preparazione',
        'ready': 'Pronto',
        'delivered': 'Consegnato',
        'paid': 'Pagato'
      }
      return statusMap[status] || status
    },
    async loadDashboardData() {
      try {
        // Here you would normally fetch data from your API
        const response = await fetch('http://localhost:3000/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          this.stats = data.stats
          this.recentOrders = data.recentOrders
        }
      } catch (error) {
        console.log('Using mock data - API not available')
      }
    }
  },
  async mounted() {
    // The mixin will handle loading restaurants
    // Just load dashboard data after restaurants are loaded
    await this.loadDashboardData()
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  background: #f3f4f6;
  display: flex;
  font-family: 'Urbanist', sans-serif;
  padding: 40px 20px;
  gap: 26px;
}

/* Sidebar */
.sidebar-wrapper {
  flex-shrink: 0;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 32px;
}

/* Header Section */
.header-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.page-subtitle {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

/* Stats Section */
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  padding: 24px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #140003;
  background: #f3f4f6;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #dfe2e7;
}

.orders-icon {
  color: #007bff;
}

.revenue-icon {
  color: #28a745;
}

.tables-icon {
  color: #ffc107;
}

.customers-icon {
  color: #dc3545;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin: 0 0 4px 0;
  line-height: normal;
}

.stat-value {
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.positive {
  color: #28a745;
}

.stat-trend.negative {
  color: #dc3545;
}

.stat-trend.neutral {
  color: #666;
}

.trend-icon {
  font-size: 14px;
}

/* Actions Section */
.actions-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.action-card {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #acacac;
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f3f4f6;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #dfe2e7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #140003;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #140003;
  margin: 0 0 4px 0;
  line-height: normal;
}

.action-description {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin: 0;
  line-height: normal;
}

.action-arrow {
  font-size: 16px;
  color: #666;
  flex-shrink: 0;
}

/* Recent Orders Section */
.recent-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.orders-container {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  overflow: hidden;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.2s ease;
}

.order-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.order-item:last-child {
  border-bottom: none;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.order-id {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #140003;
  line-height: normal;
}

.order-details {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.order-table,
.order-time {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 16px;
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
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #28a745;
  line-height: normal;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
  
  .sidebar-wrapper {
    width: 100%;
  }
  
  .main-content {
    padding: 0;
    width: 100%;
  }

  .page-title {
    font-size: 32px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-details {
    flex-direction: column;
    gap: 4px;
  }

  .order-status {
    margin: 0;
    align-self: flex-start;
  }
}

/* Font Loading */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600&display=swap');
</style>
