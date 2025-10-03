<template>
  <div class="orders-list-container">
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
        <div class="page-header">
          <div class="title-section">
            <h1 class="page-title">Ordini</h1>
            <p class="page-subtitle">Gestisci tutti gli ordini del ristorante</p>
          </div>
          <button 
            class="create-button"
            @click="navigateToCreate"
          >
            <span class="mobile-menu-icon">☰</span>
            <span class="create-text">Nuovo Ordine</span>
          </button>
        </div>
        
        <!-- Filters Section -->
        <div class="filters-section">
          <div class="filter-group">
            <label for="status-filter">Stato:</label>
            <select id="status-filter" v-model="filters.status" @change="loadOrders">
              <option value="">Tutti gli stati</option>
              <option value="pending">In attesa</option>
              <option value="preparing">In preparazione</option>
              <option value="ready">Pronto</option>
              <option value="delivered">Consegnato</option>
              <option value="cancelled">Annullato</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="table-filter">Tavolo:</label>
            <select id="table-filter" v-model="filters.tableId" @change="loadOrders">
              <option value="">Tutti i tavoli</option>
              <option v-for="table in tables" :key="table.id" :value="table.id">
                {{ table.number }} ({{ table.seats }} posti)
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="date-filter">Data:</label>
            <input 
              type="date" 
              id="date-filter" 
              v-model="filters.date" 
              @change="loadOrders"
            />
          </div>

          <button @click="clearFilters" class="clear-filters-btn">
            Pulisci filtri
          </button>
        </div>

        <!-- Orders Grid -->
        <div class="orders-grid">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Caricamento ordini...</p>
          </div>
          
          <div v-else-if="orders.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>Nessun ordine trovato</h3>
            <p>Non ci sono ordini che corrispondono ai criteri di ricerca.</p>
            <button @click="navigateToCreate" class="empty-create-btn">
              Crea primo ordine
            </button>
          </div>
          
          <div v-else class="orders-list">
            <OrderCard
              v-for="order in orders"
              :key="order.id"
              :order="order"
              @view="viewOrder"
              @edit="editOrder"
              @delete="deleteOrder"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../components/SidebarComponent.vue'
import OrderCard from '../components/OrderCard.vue'
import restaurantMixin from '@/mixins/restaurantMixin.js'
import apiConfig from '@/config/api.js'

export default {
  name: 'OrdersList',
  mixins: [restaurantMixin],
  components: {
    SidebarComponent,
    OrderCard
  },
  data() {
    return {
      orders: [],
      tables: [],
      loading: false,
      currentRestaurantId: null,
      filters: {
        status: '',
        tableId: '',
        date: ''
      }
    }
  },
  mounted() {
    this.initializeAndLoadData()
  },
  activated() {
    // Reload when component is activated (useful when coming back from create page)
    this.initializeAndLoadData()
  },
  methods: {
    initializeAndLoadData() {
      const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
      this.currentRestaurantId = selectedRestaurant.id
      this.loadTables()
      this.loadOrders()
    },
    
    handleRestaurantChanged(restaurant) {
      // Only reload if the restaurant actually changed
      if (restaurant.id !== this.currentRestaurantId) {
        this.currentRestaurantId = restaurant.id
        this.clearFilters()
        this.loadTables()
        this.loadOrders()
      }
    },

    async loadTables() {
      try {
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) return
        
        const response = await fetch(`${apiConfig.apiEndpoint}/tables?limit=100&restaurantId=${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.tables = data.data.tables || []
        }
      } catch (error) {
        console.error('Error loading tables:', error)
      }
    },

    async loadOrders() {
      try {
        this.loading = true
        
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        // Build query parameters
        const params = new URLSearchParams({
          limit: '100',
          restaurantId: restaurantId.toString()
        })
        
        if (this.filters.status) params.append('status', this.filters.status)
        if (this.filters.tableId) params.append('tableId', this.filters.tableId)
        if (this.filters.date) {
          params.append('dateFrom', this.filters.date)
          params.append('dateTo', this.filters.date)
        }
        
        const response = await fetch(`${apiConfig.apiEndpoint}/orders?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Use the orders directly without additional formatting since OrderCard handles it
          this.orders = data.data.orders || []
        } else {
          throw new Error('Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error loading orders:', error)
        this.orders = []
        alert('Errore nel caricamento degli ordini. Riprova.')
      } finally {
        this.loading = false
      }
    },

    clearFilters() {
      this.filters = {
        status: '',
        tableId: '',
        date: ''
      }
      this.loadOrders()
    },

    navigateToCreate() {
      this.$router.push('/orders/create')
    },
    
    viewOrder(order) {
      this.$router.push(`/orders/${order.id}`)
    },
    
    editOrder(order) {
      this.$router.push(`/orders/${order.id}/edit`)
    },
    
    async deleteOrder(order) {
      if (confirm(`Sei sicuro di voler eliminare l'ordine #${order.nOrder}/${order.year}?`)) {
        try {
          const response = await fetch(`${apiConfig.apiEndpoint}/orders/${order.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            if (!data.success) {
              throw new Error(data.message || 'Failed to delete order')
            }
            this.orders = this.orders.filter(o => o.id !== order.id)
          } else {
            throw new Error('Failed to delete order')
          }
        } catch (error) {
          console.error('Errore nell\'eliminazione dell\'ordine:', error)
          alert('Errore nell\'eliminazione dell\'ordine. Riprova.')
        }
      }
    }
  }
}
</script>

<style scoped>
.orders-list-container {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.sidebar-wrapper {
  width: 280px;
  flex-shrink: 0;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header-section {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title-section {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 1rem;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.create-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.mobile-menu-icon {
  display: none;
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 160px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.filter-group select,
.filter-group input {
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-filters-btn {
  padding: 0.625rem 1.25rem;
  background: #f9fafb;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  align-self: end;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.orders-grid {
  min-height: 400px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-left: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: #6b7280;
  max-width: 400px;
}

.empty-create-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.empty-create-btn:hover {
  background: #2563eb;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 1024px) {
  .orders-list-container {
    flex-direction: column;
  }
  
  .sidebar-wrapper {
    width: 100%;
  }
  
  .header-section {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .create-button {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    min-width: unset;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .mobile-menu-icon {
    display: inline;
  }
  
  .create-text {
    display: none;
  }
  
  .orders-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 0.75rem;
  }
  
  .filters-section {
    padding: 1rem;
  }
}
</style>