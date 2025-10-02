<template>
  <div class="plate-create-container">
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
          <h1>{{ isEditMode ? 'Modifica Piatto' : 'Crea Nuovo Piatto' }}</h1>
          <p>{{ isEditMode ? 'Aggiorna le informazioni e la selezione dei prodotti' : 'Configura il piatto e seleziona i prodotti da includere' }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="loading" class="loading-container">
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Caricamento piatto...</p>
      </div>
    </div>
    <div v-else class="main-content">
      <div class="content-grid">
        <!-- Plate Form -->
        <div class="form-section">
          <div class="section-card">
            <div class="section-header">
              <h2>Informazioni Piatto</h2>
              <p>{{ isEditMode ? 'Modifica i dettagli del piatto' : 'Inserisci i dettagli del piatto' }}</p>
            </div>
            
            <form @submit.prevent="savePlate" class="plate-form">
              <div class="form-group">
                <label for="plateName">Nome Piatto *</label>
                <input 
                  type="text" 
                  id="plateName"
                  v-model="plateData.name"
                  placeholder="Es. Spaghetti alla Carbonara, Pizza Margherita"
                  required
                />
              </div>

              <div class="form-group">
                <label for="plateDescription">Descrizione</label>
                <textarea 
                  id="plateDescription"
                  v-model="plateData.description"
                  placeholder="Descrivi il piatto, ingredienti principali, allergeni..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="platePrice">Prezzo *</label>
                  <input 
                    type="number" 
                    id="platePrice"
                    v-model="plateData.price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="plateCategory">Categoria</label>
                  <input 
                    type="text" 
                    id="plateCategory"
                    v-model="plateData.category"
                    placeholder="Es. Antipasti, Primi, Secondi"
                  />
                </div>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="plateData.isAvailable"
                  />
                  <span class="checkmark"></span>
                  Piatto disponibile
                </label>
              </div>

              <div class="selected-products-summary">
                <h3>Prodotti Selezionati</h3>
                <div v-if="selectedProducts.length === 0" class="no-selection">
                  Nessun prodotto selezionato
                </div>
                <div v-else class="products-count">
                  {{ selectedProducts.length }} prodotto/i selezionato/i
                  <div class="products-list">
                    <span 
                      v-for="product in getSelectedProductsDetails()" 
                      :key="product.id"
                      class="product-tag"
                    >
                      {{ product.name }}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Products Selection -->
        <div class="products-section">
          <div class="section-card">
            <div class="section-header">
              <h2>Seleziona Prodotti</h2>
              <p>Scegli i prodotti che compongono questo piatto</p>
            </div>

            <!-- Search and Filter -->
            <div class="search-filters">
              <div class="search-box">
                <input 
                  type="text" 
                  v-model="searchTerm"
                  placeholder="Cerca prodotti..."
                  class="search-input"
                />
              </div>
              <div class="filter-box">
                <select v-model="categoryFilter" class="category-filter">
                  <option value="">Tutte le categorie</option>
                  <option v-for="category in productCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingProducts" class="loading-state">
              <div class="spinner"></div>
              <p>Caricamento prodotti...</p>
            </div>

            <!-- Products List -->
            <div v-else-if="filteredProducts.length > 0" class="products-list">
              <div 
                v-for="product in filteredProducts" 
                :key="product.id"
                class="product-item"
                :class="{ 'selected': selectedProducts.includes(product.id) }"
                @click="toggleProductSelection(product.id)"
              >
                <div class="product-info">
                  <h4>{{ product.name }}</h4>
                  <p v-if="product.description">{{ product.description }}</p>
                  <div class="product-meta">
                    <span v-if="product.category" class="category">{{ product.category }}</span>
                    <span v-if="product.unit" class="unit">{{ product.unit }}</span>
                  </div>
                </div>
                <div class="selection-indicator">
                  <div class="checkbox" :class="{ 'checked': selectedProducts.includes(product.id) }">
                    <svg v-if="selectedProducts.includes(product.id)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loadingProducts" class="empty-state">
              <p>Nessun prodotto trovato.</p>
              <p v-if="searchTerm || categoryFilter">Prova a modificare i filtri di ricerca.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button type="button" @click="goBack" class="cancel-btn">
          Annulla
        </button>
        <button 
          type="button" 
          @click="savePlate" 
          :disabled="!plateData.name || !plateData.price || saving" 
          class="submit-btn"
        >
          <span v-if="saving">{{ isEditMode ? 'Aggiornamento...' : 'Creazione...' }}</span>
          <span v-else>{{ isEditMode ? 'Aggiorna Piatto' : 'Crea Piatto' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/config/api.js'

export default {
  name: 'PlateCreate',
  data() {
    return {
      plateData: {
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true,
      },
      products: [],
      selectedProducts: [],
      loadingProducts: false,
      saving: false,
      loading: false,
      searchTerm: '',
      categoryFilter: '',
      isEditMode: false,
      plateId: null,
    }
  },
  computed: {
    filteredProducts() {
      let filtered = this.products

      // Filter by search term
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(term) ||
          (product.description && product.description.toLowerCase().includes(term))
        )
      }

      // Filter by category
      if (this.categoryFilter) {
        filtered = filtered.filter(product => product.category === this.categoryFilter)
      }

      return filtered
    },
    productCategories() {
      const categories = [...new Set(this.products.map(product => product.category))]
      return categories.filter(Boolean).sort()
    }
  },
  mounted() {
    this.checkEditMode()
    this.loadProducts()
    if (this.isEditMode) {
      this.loadPlate()
    }
  },
  methods: {
    checkEditMode() {
      this.plateId = this.$route.params.id
      this.isEditMode = !!this.plateId
    },

    async loadPlate() {
      if (!this.plateId) return
      
      try {
        this.loading = true
        
        const response = await fetch(`${apiConfig.apiEndpoint}/plates/${this.plateId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const plate = data.data
          
          // Populate form with existing data
          this.plateData = {
            name: plate.name || '',
            description: plate.description || '',
            price: plate.price || '',
            category: plate.category || '',
            isAvailable: plate.isAvailable !== undefined ? plate.isAvailable : true,
          }
          
          // Set selected products
          this.selectedProducts = plate.products ? plate.products.map(product => product.id) : []
        } else {
          throw new Error('Failed to fetch plate')
        }
      } catch (error) {
        console.error('Error loading plate:', error)
        alert('Errore nel caricamento del piatto. Riprova.')
        this.goBack()
      } finally {
        this.loading = false
      }
    },

    async loadProducts() {
      try {
        this.loadingProducts = true
        
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        const response = await fetch(`${apiConfig.apiEndpoint}/products?limit=100&restaurantId=${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.products = data.data.products || []
        } else {
          throw new Error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
        alert('Errore nel caricamento dei prodotti. Riprova.')
      } finally {
        this.loadingProducts = false
      }
    },

    toggleProductSelection(productId) {
      const index = this.selectedProducts.indexOf(productId)
      if (index > -1) {
        this.selectedProducts.splice(index, 1)
      } else {
        this.selectedProducts.push(productId)
      }
    },

    getSelectedProductsDetails() {
      return this.products.filter(product => this.selectedProducts.includes(product.id))
    },

    async createPlate() {
      const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')

      const platePayload = {
        ...this.plateData,
        price: parseFloat(this.plateData.price),
        restaurantId: selectedRestaurant.id,
        productIds: this.selectedProducts
      }

      console.log('Creating plate with payload:', platePayload)

      const response = await fetch(`${apiConfig.apiEndpoint}/plates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(platePayload)
      })
      
      console.log('Create response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Create result:', result)
        if (result.success) {
          this.$router.push('/plates')
        } else {
          throw new Error(result.message || 'Failed to create plate')
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Create error response:', errorData)
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create plate`)
      }
    },

    async updatePlate() {
      const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')

      const platePayload = {
        ...this.plateData,
        price: parseFloat(this.plateData.price),
        restaurantId: selectedRestaurant.id,
        productIds: this.selectedProducts
      }

      console.log('Updating plate with payload:', platePayload)
      console.log('Plate ID:', this.plateId)

      const response = await fetch(`${apiConfig.apiEndpoint}/plates/${this.plateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(platePayload)
      })
      
      console.log('Update response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Update result:', result)
        if (result.success) {
          this.$router.push('/plates')
        } else {
          throw new Error(result.message || 'Failed to update plate')
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Update error response:', errorData)
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update plate`)
      }
    },

    async savePlate() {
      if (!this.plateData.name.trim()) {
        alert('Il nome del piatto è obbligatorio')
        return
      }

      if (!this.plateData.price || parseFloat(this.plateData.price) < 0) {
        alert('Il prezzo deve essere maggiore o uguale a 0')
        return
      }

      try {
        this.saving = true

        if (this.isEditMode) {
          await this.updatePlate()
        } else {
          await this.createPlate()
        }

      } catch (error) {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} plate:`, error)
        alert(`Errore ${this.isEditMode ? 'nell\'aggiornamento' : 'nella creazione'} del piatto: ${error.message}`)
      } finally {
        this.saving = false
      }
    },

    goBack() {
      this.$router.push('/plates')
    }
  }
}
</script>

<style scoped>
.plate-create-container {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Urbanist', sans-serif;
}

.page-header {
  background: #fcfbf8;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Urbanist', sans-serif;
}

.back-btn:hover {
  background: #f0f0f0;
  border-color: #d1d5db;
}

.header-text h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #140003;
  margin: 0 0 0.25rem 0;
}

.header-text p {
  color: #6b7280;
  margin: 0;
}

.loading-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.section-card {
  background: #fcfbf8;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #140003;
  margin: 0 0 0.25rem 0;
}

.section-header p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #140003;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  transition: all 0.2s;
  box-sizing: border-box;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f92561;
  box-shadow: 0 0 0 3px rgba(249, 37, 97, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  color: #140003;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 0.75rem;
  position: relative;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #f92561;
  border-color: #f92561;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.selected-products-summary {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.selected-products-summary h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #140003;
}

.no-selection {
  color: #6b7280;
  font-style: italic;
}

.products-count {
  color: #f92561;
  font-weight: 500;
}

.products-list {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.search-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box,
.filter-box {
  flex: 1;
}

.search-input,
.category-filter {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  background: #f8f9fa;
  box-sizing: border-box;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #f92561;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-list {
  max-height: 500px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8f9fa;
}

.product-item:hover {
  border-color: #f92561;
  background: #fef7f7;
}

.product-item.selected {
  border-color: #f92561;
  background: #fef7f7;
  box-shadow: 0 0 0 2px rgba(249, 37, 97, 0.1);
}

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #140003;
}

.product-info p {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.product-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.category,
.unit {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.selection-indicator .checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.selection-indicator .checkbox.checked {
  background: #f92561;
  border-color: #f92561;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  background: #f0f0f0;
  color: #4a5568;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.submit-btn {
  background: #f92561;
  color: #fcfbf8;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #e91e5a;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>