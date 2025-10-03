<template>
  <div class="order-detail-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Indietro
        </button>
        <div class="header-text">
          <h1 v-if="order">Ordine #{{ order.nOrder }}/{{ order.year }}</h1>
          <h1 v-else>Caricamento ordine...</h1>
          <p v-if="order">{{ formatDate(order.orderDate || order.createdAt) }}</p>
        </div>
        <div class="header-actions" v-if="order">
          <button @click="editOrder" class="edit-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Modifica
          </button>
          <button @click="updateStatus" class="status-btn" :class="statusButtonClass">
            {{ getNextStatusText() }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Caricamento ordine...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="order" class="main-content">
      <div class="content-container">
        
        <!-- Order Info Card -->
        <div class="info-card">
          <h2>Informazioni Ordine</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Numero Ordine:</span>
              <span class="value">#{{ order.nOrder }}/{{ order.year }}</span>
            </div>
            <div class="info-item">
              <span class="label">Stato:</span>
              <span class="status-badge" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Tavolo:</span>
              <span class="value">
                {{ order.table ? `${order.table.number} (${order.table.seats} posti)` : 'Asporto/Delivery' }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Ristorante:</span>
              <span class="value">{{ order.restaurant?.name || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Data Ordine:</span>
              <span class="value">{{ formatDate(order.orderDate || order.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Totale:</span>
              <span class="value total-amount">€ {{ parseFloat(order.totalAmount || 0).toFixed(2) }}</span>
            </div>
          </div>
          <div v-if="order.notes" class="notes-section">
            <span class="label">Note:</span>
            <p class="notes">{{ order.notes }}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="items-section">
          
          <!-- Plates Section -->
          <div v-if="order.orderPlates && order.orderPlates.length > 0" class="plates-card">
            <h3>Piatti ({{ order.orderPlates.length }})</h3>
            <div class="items-list">
              <div v-for="orderPlate in order.orderPlates" :key="orderPlate.id" class="item-card">
                <div class="item-header">
                  <h4>{{ orderPlate.plate?.name || 'Piatto non trovato' }}</h4>
                  <span class="quantity">x{{ orderPlate.quantity }}</span>
                  <span class="price">€ {{ parseFloat(orderPlate.subtotal || 0).toFixed(2) }}</span>
                </div>
                <div class="item-details">
                  <span class="unit-price">€ {{ parseFloat(orderPlate.unitPrice || 0).toFixed(2) }} cad.</span>
                  <span class="line-id">Linea: {{ orderPlate.lineId }}</span>
                </div>
                <div v-if="orderPlate.notes" class="item-notes">
                  <span class="notes-label">Note:</span> {{ orderPlate.notes }}
                </div>
                
                <!-- Plate Products (Add/Remove) -->
                <div v-if="orderPlate.orderPlateProducts && orderPlate.orderPlateProducts.length > 0" class="plate-products">
                  <h5>Modifiche:</h5>
                  <div class="products-list">
                    <div v-for="plateProduct in orderPlate.orderPlateProducts" :key="plateProduct.id" class="product-item">
                      <span class="product-action" :class="plateProduct.action">
                        {{ plateProduct.action === 'add' ? '+' : '-' }}
                      </span>
                      <span class="product-name">{{ plateProduct.product?.name || 'Prodotto non trovato' }}</span>
                      <span class="product-quantity">x{{ plateProduct.quantity }}</span>
                      <span class="product-price">€ {{ parseFloat(plateProduct.subtotal || 0).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Drinks Section -->
          <div v-if="order.orderDrinks && order.orderDrinks.length > 0" class="drinks-card">
            <h3>Bevande ({{ order.orderDrinks.length }})</h3>
            <div class="items-list">
              <div v-for="orderDrink in order.orderDrinks" :key="orderDrink.id" class="item-card">
                <div class="item-header">
                  <h4>{{ orderDrink.drink?.name || 'Bevanda non trovata' }}</h4>
                  <span class="quantity">x{{ orderDrink.quantity }}</span>
                  <span class="price">€ {{ parseFloat(orderDrink.subtotal || 0).toFixed(2) }}</span>
                </div>
                <div class="item-details">
                  <span class="unit-price">€ {{ parseFloat(orderDrink.unitPrice || 0).toFixed(2) }} cad.</span>
                  <span class="line-id">Linea: {{ orderDrink.lineId }}</span>
                </div>
                <div v-if="orderDrink.notes" class="item-notes">
                  <span class="notes-label">Note:</span> {{ orderDrink.notes }}
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="(!order.orderPlates || order.orderPlates.length === 0) && (!order.orderDrinks || order.orderDrinks.length === 0)" class="empty-state">
            <p>Nessun elemento presente in questo ordine</p>
            <button @click="editOrder" class="add-items-btn">Aggiungi elementi</button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="summary-card">
          <h3>Riepilogo Ordine</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span>Piatti:</span>
              <span>{{ order.orderPlates?.length || 0 }}</span>
            </div>
            <div class="summary-item">
              <span>Bevande:</span>
              <span>{{ order.orderDrinks?.length || 0 }}</span>
            </div>
            <div class="summary-item total">
              <span>Totale:</span>
              <span>€ {{ parseFloat(order.totalAmount || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <h2>Ordine non trovato</h2>
      <p>L'ordine richiesto non è stato trovato o non hai i permessi per visualizzarlo.</p>
      <button @click="goBack" class="back-to-list-btn">Torna alla lista</button>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/config/api.js'

export default {
  name: 'OrderDetail',
  data() {
    return {
      order: null,
      loading: true,
      updating: false
    }
  },
  computed: {
    statusButtonClass() {
      if (!this.order) return ''
      
      switch (this.order.status) {
        case 'pending': return 'status-btn-preparing'
        case 'preparing': return 'status-btn-ready'
        case 'ready': return 'status-btn-delivered'
        default: return 'status-btn-disabled'
      }
    }
  },
  mounted() {
    this.loadOrder()
  },
  methods: {
    async loadOrder() {
      try {
        this.loading = true
        const orderId = this.$route.params.id
        
        const response = await fetch(`${apiConfig.apiEndpoint}/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.order = data.data
        } else {
          throw new Error('Failed to fetch order')
        }
      } catch (error) {
        console.error('Error loading order:', error)
        this.order = null
      } finally {
        this.loading = false
      }
    },

    getStatusText(status) {
      const statusMap = {
        pending: 'In attesa',
        preparing: 'In preparazione',
        ready: 'Pronto',
        delivered: 'Consegnato',
        cancelled: 'Annullato'
      }
      return statusMap[status] || status
    },

    getStatusClass(status) {
      return `status-${status}`
    },

    getNextStatusText() {
      if (!this.order) return ''
      
      switch (this.order.status) {
        case 'pending': return 'Inizia preparazione'
        case 'preparing': return 'Segna come pronto'
        case 'ready': return 'Segna come consegnato'
        default: return 'Stato non modificabile'
      }
    },

    async updateStatus() {
      if (!this.order || this.updating) return
      
      const nextStatus = this.getNextStatus()
      if (!nextStatus) return
      
      try {
        this.updating = true
        
        const response = await fetch(`${apiConfig.apiEndpoint}/orders/${this.order.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ status: nextStatus })
        })

        if (response.ok) {
          const data = await response.json()
          this.order = data.data
        } else {
          throw new Error('Failed to update order status')
        }
      } catch (error) {
        console.error('Error updating order status:', error)
        alert('Errore nell\'aggiornamento dello stato dell\'ordine. Riprova.')
      } finally {
        this.updating = false
      }
    },

    getNextStatus() {
      switch (this.order?.status) {
        case 'pending': return 'preparing'
        case 'preparing': return 'ready'
        case 'ready': return 'delivered'
        default: return null
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    goBack() {
      this.$router.push('/orders')
    },

    editOrder() {
      this.$router.push(`/orders/${this.order.id}/edit`)
    }
  }
}
</script>

<style scoped>
.order-detail-container {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #e5e7eb;
}

.header-text {
  flex: 1;
}

.header-text h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.header-text p {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-btn, .status-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.edit-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.status-btn-preparing {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.status-btn-preparing:hover {
  background: #2563eb;
}

.status-btn-ready {
  background: #10b981;
  border: 1px solid #10b981;
  color: white;
}

.status-btn-ready:hover {
  background: #059669;
}

.status-btn-delivered {
  background: #6b7280;
  border: 1px solid #6b7280;
  color: white;
}

.status-btn-delivered:hover {
  background: #4b5563;
}

.status-btn-disabled {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-state {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-left: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.main-content {
  padding: 2rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
}

.info-card, .plates-card, .drinks-card, .summary-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card h2, .plates-card h3, .drinks-card h3, .summary-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6b7280;
}

.value {
  color: #1f2937;
  font-weight: 500;
}

.total-amount {
  font-size: 1.125rem;
  color: #059669;
  font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-pending { background: #fef3c7; color: #92400e; }
.status-preparing { background: #dbeafe; color: #1e40af; }
.status-ready { background: #d1fae5; color: #065f46; }
.status-delivered { background: #f3f4f6; color: #374151; }
.status-cancelled { background: #fee2e2; color: #991b1b; }

.notes-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.notes {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-style: italic;
}

.items-list {
  display: grid;
  gap: 1rem;
}

.item-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: #fafafa;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.item-header h4 {
  flex: 1;
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
}

.quantity {
  padding: 0.25rem 0.5rem;
  background: #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.price {
  font-weight: 600;
  color: #059669;
}

.item-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.item-notes {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.notes-label {
  font-weight: 500;
}

.plate-products {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.plate-products h5 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.products-list {
  display: grid;
  gap: 0.5rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.875rem;
}

.product-action {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.75rem;
}

.product-action.add {
  background: #d1fae5;
  color: #065f46;
}

.product-action.remove {
  background: #fee2e2;
  color: #991b1b;
}

.product-name {
  flex: 1;
  color: #374151;
}

.product-quantity {
  color: #6b7280;
}

.product-price {
  font-weight: 500;
  color: #1f2937;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.add-items-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.add-items-btn:hover {
  background: #2563eb;
}

.summary-grid {
  display: grid;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item.total {
  font-size: 1.125rem;
  font-weight: 600;
  color: #059669;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.error-state h2 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.error-state p {
  margin: 0 0 2rem 0;
  color: #6b7280;
}

.back-to-list-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease;
}

.back-to-list-btn:hover {
  background: #2563eb;
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .main-content {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .item-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>