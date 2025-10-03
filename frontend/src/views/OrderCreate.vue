<template>
  <div class="order-create-container">
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
          <h1>{{ isEditMode ? 'Modifica Ordine' : 'Crea Nuovo Ordine' }}</h1>
          <p>{{ isEditMode ? 'Aggiorna le informazioni dell\'ordine' : 'Inserisci i dettagli del nuovo ordine' }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-state">
        <div class="spinner"></div>
        <p>{{ isEditMode ? 'Caricamento ordine...' : 'Caricamento dati...' }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="main-content">
      <div class="content-container">
        
        <!-- Order Basic Info -->
        <div class="form-section">
          <div class="section-card">
            <div class="section-header">
              <h2>Informazioni Ordine</h2>
              <p>{{ isEditMode ? 'Modifica i dettagli dell\'ordine' : 'Inserisci i dettagli di base dell\'ordine' }}</p>
            </div>
            
            <form @submit.prevent="saveOrder" class="order-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="tableId">Tavolo</label>
                  <select 
                    id="tableId"
                    v-model="orderData.tableId"
                  >
                    <option value="">Asporto/Delivery</option>
                    <option v-for="table in tables" :key="table.id" :value="table.id">
                      {{ table.number }} ({{ table.seats }} posti)
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="status">Stato</label>
                  <select 
                    id="status"
                    v-model="orderData.status"
                    required
                  >
                    <option value="pending">In attesa</option>
                    <option value="preparing">In preparazione</option>
                    <option value="ready">Pronto</option>
                    <option value="delivered">Consegnato</option>
                    <option value="cancelled">Annullato</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="notes">Note Ordine</label>
                <textarea 
                  id="notes"
                  v-model="orderData.notes"
                  placeholder="Note aggiuntive per l'ordine..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" @click="goBack" class="cancel-btn">Annulla</button>
                <button type="submit" class="save-btn" :disabled="saving">
                  {{ saving ? 'Salvataggio...' : (isEditMode ? 'Aggiorna Ordine' : 'Crea Ordine') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Order Items Section (only show for existing orders) -->
        <div v-if="isEditMode && orderData.id" class="items-section">
          
          <!-- Add Items Section -->
          <div class="section-card">
            <div class="section-header">
              <h2>Aggiungi Elementi</h2>
              <p>Aggiungi piatti e bevande all'ordine</p>
            </div>

            <!-- Add Plate -->
            <div class="add-item-form">
              <h3>Aggiungi Piatto</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="plateSelect">Piatto</label>
                  <select 
                    id="plateSelect"
                    v-model="newPlate.plateId"
                  >
                    <option value="">Seleziona un piatto</option>
                    <option v-for="plate in plates" :key="plate.id" :value="plate.id">
                      {{ plate.name }} - € {{ parseFloat(plate.price || 0).toFixed(2) }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="plateQuantity">Quantità</label>
                  <input 
                    type="number" 
                    id="plateQuantity"
                    v-model="newPlate.quantity"
                    min="1"
                    placeholder="1"
                  />
                </div>
                <div class="form-group">
                  <label for="plateNotes">Note</label>
                  <input 
                    type="text" 
                    id="plateNotes"
                    v-model="newPlate.notes"
                    placeholder="Note per il piatto..."
                  />
                </div>
                <div class="form-group">
                  <label>&nbsp;</label>
                  <button type="button" @click="addPlate" class="add-btn" :disabled="!newPlate.plateId">
                    Aggiungi Piatto
                  </button>
                </div>
              </div>
            </div>

            <!-- Add Drink -->
            <div class="add-item-form">
              <h3>Aggiungi Bevanda</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="drinkSelect">Bevanda</label>
                  <select 
                    id="drinkSelect"
                    v-model="newDrink.drinkId"
                  >
                    <option value="">Seleziona una bevanda</option>
                    <option v-for="drink in drinks" :key="drink.id" :value="drink.id">
                      {{ drink.name }} - € {{ parseFloat(drink.price || 0).toFixed(2) }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="drinkQuantity">Quantità</label>
                  <input 
                    type="number" 
                    id="drinkQuantity"
                    v-model="newDrink.quantity"
                    min="1"
                    placeholder="1"
                  />
                </div>
                <div class="form-group">
                  <label for="drinkNotes">Note</label>
                  <input 
                    type="text" 
                    id="drinkNotes"
                    v-model="newDrink.notes"
                    placeholder="Note per la bevanda..."
                  />
                </div>
                <div class="form-group">
                  <label>&nbsp;</label>
                  <button type="button" @click="addDrink" class="add-btn" :disabled="!newDrink.drinkId">
                    Aggiungi Bevanda
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Order Items -->
          <div v-if="orderItems.plates.length > 0 || orderItems.drinks.length > 0" class="section-card">
            <div class="section-header">
              <h2>Elementi Ordine</h2>
              <p>Piatti e bevande presenti nell'ordine</p>
            </div>

            <!-- Plates List -->
            <div v-if="orderItems.plates.length > 0" class="items-list">
              <h3>Piatti ({{ orderItems.plates.length }})</h3>
              <div class="items-grid">
                <div v-for="item in orderItems.plates" :key="item.id" class="item-card">
                  <div class="item-header">
                    <h4>{{ item.plate?.name || 'Piatto non trovato' }}</h4>
                    <span class="quantity">x{{ item.quantity }}</span>
                    <span class="price">€ {{ parseFloat(item.subtotal || 0).toFixed(2) }}</span>
                  </div>
                  <div class="item-details">
                    <span class="unit-price">€ {{ parseFloat(item.unitPrice || 0).toFixed(2) }} cad.</span>
                    <span class="line-id">Linea: {{ item.lineId }}</span>
                  </div>
                  <div v-if="item.notes" class="item-notes">
                    <span class="notes-label">Note:</span> {{ item.notes }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Drinks List -->
            <div v-if="orderItems.drinks.length > 0" class="items-list">
              <h3>Bevande ({{ orderItems.drinks.length }})</h3>
              <div class="items-grid">
                <div v-for="item in orderItems.drinks" :key="item.id" class="item-card">
                  <div class="item-header">
                    <h4>{{ item.drink?.name || 'Bevanda non trovata' }}</h4>
                    <span class="quantity">x{{ item.quantity }}</span>
                    <span class="price">€ {{ parseFloat(item.subtotal || 0).toFixed(2) }}</span>
                  </div>
                  <div class="item-details">
                    <span class="unit-price">€ {{ parseFloat(item.unitPrice || 0).toFixed(2) }} cad.</span>
                    <span class="line-id">Linea: {{ item.lineId }}</span>
                  </div>
                  <div v-if="item.notes" class="item-notes">
                    <span class="notes-label">Note:</span> {{ item.notes }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Total -->
            <div class="order-total">
              <div class="total-line">
                <span>Totale Ordine:</span>
                <span class="total-amount">€ {{ calculateTotal().toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/config/api.js'

export default {
  name: 'OrderCreate',
  data() {
    return {
      isEditMode: false,
      loading: true,
      saving: false,
      orderData: {
        id: null,
        restaurantId: null,
        tableId: '',
        status: 'pending',
        notes: '',
        totalAmount: 0
      },
      tables: [],
      plates: [],
      drinks: [],
      orderItems: {
        plates: [],
        drinks: []
      },
      newPlate: {
        plateId: '',
        quantity: 1,
        notes: ''
      },
      newDrink: {
        drinkId: '',
        quantity: 1,
        notes: ''
      }
    }
  },
  mounted() {
    this.initializeData()
  },
  methods: {
    async initializeData() {
      try {
        this.loading = true
        
        // Check if we're in edit mode
        const orderId = this.$route.params.id
        this.isEditMode = !!orderId
        
        // Get restaurant ID
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        this.orderData.restaurantId = selectedRestaurant.id
        
        if (!this.orderData.restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        // Load required data
        await Promise.all([
          this.loadTables(),
          this.loadPlates(),
          this.loadDrinks()
        ])
        
        // Load order data if editing
        if (this.isEditMode) {
          await this.loadOrder(orderId)
        }
        
      } catch (error) {
        console.error('Error initializing data:', error)
        alert('Errore nel caricamento dei dati. Riprova.')
      } finally {
        this.loading = false
      }
    },

    async loadTables() {
      try {
        const response = await fetch(`${apiConfig.apiEndpoint}/tables?limit=100&restaurantId=${this.orderData.restaurantId}`, {
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

    async loadPlates() {
      try {
        const response = await fetch(`${apiConfig.apiEndpoint}/plates?limit=100&restaurantId=${this.orderData.restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.plates = data.data.plates || []
        }
      } catch (error) {
        console.error('Error loading plates:', error)
      }
    },

    async loadDrinks() {
      try {
        const response = await fetch(`${apiConfig.apiEndpoint}/drinks?limit=100&restaurantId=${this.orderData.restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.drinks = data.data.drinks || []
        }
      } catch (error) {
        console.error('Error loading drinks:', error)
      }
    },

    async loadOrder(orderId) {
      try {
        const response = await fetch(`${apiConfig.apiEndpoint}/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const order = data.data
          
          this.orderData = {
            id: order.id,
            restaurantId: order.restaurantId,
            tableId: order.tableId || '',
            status: order.status,
            notes: order.notes || '',
            totalAmount: order.totalAmount
          }
          
          this.orderItems = {
            plates: order.orderPlates || [],
            drinks: order.orderDrinks || []
          }
        } else {
          throw new Error('Failed to load order')
        }
      } catch (error) {
        console.error('Error loading order:', error)
        alert('Errore nel caricamento dell\'ordine.')
        this.goBack()
      }
    },

    async saveOrder() {
      try {
        this.saving = true
        
        const orderPayload = {
          restaurantId: this.orderData.restaurantId,
          tableId: this.orderData.tableId || null,
          status: this.orderData.status,
          notes: this.orderData.notes || null
        }
        
        let response
        if (this.isEditMode) {
          response = await fetch(`${apiConfig.apiEndpoint}/orders/${this.orderData.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(orderPayload)
          })
        } else {
          response = await fetch(`${apiConfig.apiEndpoint}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(orderPayload)
          })
        }

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            if (this.isEditMode) {
              // Go to order detail page
              this.$router.push(`/orders/${this.orderData.id}`)
            } else {
              // Go to edit page for the new order
              this.$router.push(`/orders/${data.data.id}/edit`)
            }
          } else {
            throw new Error(data.message || 'Failed to save order')
          }
        } else {
          throw new Error('Failed to save order')
        }
      } catch (error) {
        console.error('Error saving order:', error)
        alert('Errore nel salvataggio dell\'ordine. Riprova.')
      } finally {
        this.saving = false
      }
    },

    async addPlate() {
      try {
        if (!this.newPlate.plateId || !this.orderData.id) return
        
        const response = await fetch(`${apiConfig.apiEndpoint}/orders/${this.orderData.id}/plates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            plateId: this.newPlate.plateId,
            quantity: this.newPlate.quantity,
            notes: this.newPlate.notes || null
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Reload order to get updated data
            await this.loadOrder(this.orderData.id)
            // Reset form
            this.newPlate = { plateId: '', quantity: 1, notes: '' }
          } else {
            throw new Error(data.message || 'Failed to add plate')
          }
        } else {
          throw new Error('Failed to add plate')
        }
      } catch (error) {
        console.error('Error adding plate:', error)
        alert('Errore nell\'aggiunta del piatto. Riprova.')
      }
    },

    async addDrink() {
      try {
        if (!this.newDrink.drinkId || !this.orderData.id) return
        
        const response = await fetch(`${apiConfig.apiEndpoint}/orders/${this.orderData.id}/drinks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            drinkId: this.newDrink.drinkId,
            quantity: this.newDrink.quantity,
            notes: this.newDrink.notes || null
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Reload order to get updated data
            await this.loadOrder(this.orderData.id)
            // Reset form
            this.newDrink = { drinkId: '', quantity: 1, notes: '' }
          } else {
            throw new Error(data.message || 'Failed to add drink')
          }
        } else {
          throw new Error('Failed to add drink')
        }
      } catch (error) {
        console.error('Error adding drink:', error)
        alert('Errore nell\'aggiunta della bevanda. Riprova.')
      }
    },

    calculateTotal() {
      let total = 0
      
      this.orderItems.plates.forEach(plate => {
        total += parseFloat(plate.subtotal || 0)
      })
      
      this.orderItems.drinks.forEach(drink => {
        total += parseFloat(drink.subtotal || 0)
      })
      
      return total
    },

    goBack() {
      if (this.isEditMode && this.orderData.id) {
        this.$router.push(`/orders/${this.orderData.id}`)
      } else {
        this.$router.push('/orders')
      }
    }
  }
}
</script>

<style scoped>
.order-create-container {
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

.form-section, .items-section {
  display: grid;
  gap: 2rem;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.section-header p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.order-form {
  display: grid;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-item-form {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  background: #fafafa;
}

.add-item-form h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
}

.add-btn {
  padding: 0.75rem 1rem;
  background: #10b981;
  border: 1px solid #10b981;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add-btn:hover:not(:disabled) {
  background: #059669;
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.items-list {
  margin-bottom: 2rem;
}

.items-list h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 500;
  color: #1f2937;
}

.items-grid {
  display: grid;
  gap: 1rem;
}

.item-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  background: white;
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
  min-width: 80px;
  text-align: right;
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

.order-total {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.total-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
}

.total-amount {
  color: #059669;
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .item-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>