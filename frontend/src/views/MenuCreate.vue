<template>
  <div class="menu-create-container">
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
          <h1>Crea Nuovo Menu</h1>
          <p>Configura il menu e seleziona i piatti da includere</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-grid">
        <!-- Menu Form -->
        <div class="form-section">
          <div class="section-card">
            <div class="section-header">
              <h2>Informazioni Menu</h2>
              <p>Inserisci i dettagli del menu</p>
            </div>
            
            <form @submit.prevent="createMenu" class="menu-form">
              <div class="form-group">
                <label for="menuName">Nome Menu *</label>
                <input 
                  type="text" 
                  id="menuName"
                  v-model="menuData.name"
                  placeholder="Es. Antipasti, Primi Piatti, Dessert"
                  required
                />
              </div>

              <div class="form-group">
                <label for="menuDescription">Descrizione</label>
                <textarea 
                  id="menuDescription"
                  v-model="menuData.description"
                  placeholder="Descrivi brevemente questa categoria di menu..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="menuCategory">Categoria (slug)</label>
                <input 
                  type="text" 
                  id="menuCategory"
                  v-model="menuData.category"
                  placeholder="Es. antipasti, primi-piatti, dessert"
                />
                <small class="form-help">Verrà generato automaticamente dal nome se lasciato vuoto</small>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="menuData.isActive"
                  />
                  <span class="checkmark"></span>
                  Menu attivo
                </label>
              </div>

              <div class="selected-plates-summary">
                <h3>Piatti Selezionati</h3>
                <div v-if="selectedPlates.length === 0" class="no-selection">
                  Nessun piatto selezionato
                </div>
                <div v-else class="plates-count">
                  {{ selectedPlates.length }} piatto/i selezionato/i
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Plates Selection -->
        <div class="plates-section">
          <div class="section-card">
            <div class="section-header">
              <h2>Seleziona Piatti</h2>
              <p>Scegli i piatti da includere in questo menu</p>
            </div>

            <!-- Search and Filter -->
            <div class="search-filters">
              <div class="search-box">
                <input 
                  type="text" 
                  v-model="searchTerm"
                  placeholder="Cerca piatti..."
                  class="search-input"
                />
              </div>
              <div class="filter-box">
                <select v-model="categoryFilter" class="category-filter">
                  <option value="">Tutte le categorie</option>
                  <option v-for="category in plateCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loadingPlates" class="loading-state">
              <div class="spinner"></div>
              <p>Caricamento piatti...</p>
            </div>

            <!-- Plates List -->
            <div v-else-if="filteredPlates.length > 0" class="plates-list">
              <div 
                v-for="plate in filteredPlates" 
                :key="plate.id"
                class="plate-item"
                :class="{ 'selected': selectedPlates.includes(plate.id) }"
                @click="togglePlateSelection(plate.id)"
              >
                <div class="plate-info">
                  <h4>{{ plate.name }}</h4>
                  <p v-if="plate.description">{{ plate.description }}</p>
                  <div class="plate-meta">
                    <span class="price">€ {{ plate.price }}</span>
                    <span class="category">{{ plate.category }}</span>
                    <span 
                      class="availability" 
                      :class="{ 'available': plate.isAvailable, 'unavailable': !plate.isAvailable }"
                    >
                      {{ plate.isAvailable ? 'Disponibile' : 'Non disponibile' }}
                    </span>
                  </div>
                </div>
                <div class="selection-indicator">
                  <div class="checkbox" :class="{ 'checked': selectedPlates.includes(plate.id) }">
                    <svg v-if="selectedPlates.includes(plate.id)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loadingPlates" class="empty-state">
              <p>Nessun piatto trovato.</p>
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
          @click="createMenu" 
          :disabled="!menuData.name || creating" 
          class="submit-btn"
        >
          <span v-if="creating">Creazione...</span>
          <span v-else>Crea Menu</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/config/api.js'

export default {
  name: 'MenuCreate',
  data() {
    return {
      menuData: {
        name: '',
        description: '',
        category: '',
        isActive: true,
      },
      plates: [],
      selectedPlates: [],
      loadingPlates: false,
      creating: false,
      searchTerm: '',
      categoryFilter: '',
    }
  },
  computed: {
    filteredPlates() {
      let filtered = this.plates

      // Filter by search term
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(plate => 
          plate.name.toLowerCase().includes(term) ||
          (plate.description && plate.description.toLowerCase().includes(term))
        )
      }

      // Filter by category
      if (this.categoryFilter) {
        filtered = filtered.filter(plate => plate.category === this.categoryFilter)
      }

      return filtered
    },
    plateCategories() {
      const categories = [...new Set(this.plates.map(plate => plate.category))]
      return categories.filter(Boolean).sort()
    }
  },
  mounted() {
    this.loadPlates()
  },
  methods: {
    async loadPlates() {
      try {
        this.loadingPlates = true
        
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        const response = await fetch(`${apiConfig.apiEndpoint}/plates?limit=100&restaurantId=${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.plates = data.data.plates || []
        } else {
          throw new Error('Failed to fetch plates')
        }
      } catch (error) {
        console.error('Error loading plates:', error)
        this.plates = []
        alert('Errore nel caricamento dei piatti. Riprova.')
      } finally {
        this.loadingPlates = false
      }
    },

    togglePlateSelection(plateId) {
      const index = this.selectedPlates.indexOf(plateId)
      if (index > -1) {
        this.selectedPlates.splice(index, 1)
      } else {
        this.selectedPlates.push(plateId)
      }
    },

    generateSlug(name) {
      return name
        .toLowerCase()
        .trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    },

    async createMenu() {
      if (!this.menuData.name.trim()) {
        alert('Il nome del menu è obbligatorio')
        return
      }

      try {
        this.creating = true

        // Generate slug if not provided
        if (!this.menuData.category) {
          this.menuData.category = this.generateSlug(this.menuData.name)
        } else {
          this.menuData.category = this.generateSlug(this.menuData.category)
        }

        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')

        const menuPayload = {
          ...this.menuData,
          restaurantId: selectedRestaurant.id,
          plateIds: this.selectedPlates
        }

        const response = await fetch(`${apiConfig.apiEndpoint}/menus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(menuPayload)
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Navigate back to menu list
            this.$router.push('/menu')
          } else {
            throw new Error(result.message || 'Failed to create menu')
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to create menu')
        }

      } catch (error) {
        console.error('Error creating menu:', error)
        alert(`Errore nella creazione del menu: ${error.message}`)
      } finally {
        this.creating = false
      }
    },

    goBack() {
      this.$router.push('/menu')
    }
  }
}
</script>

<style scoped>
.menu-create-container {
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

.form-help {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: block;
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

.selected-plates-summary {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.selected-plates-summary h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #140003;
}

.no-selection {
  color: #6b7280;
  font-style: italic;
}

.plates-count {
  color: #f92561;
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

.plates-list {
  max-height: 500px;
  overflow-y: auto;
}

.plate-item {
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

.plate-item:hover {
  border-color: #f92561;
  background: #fef7f7;
}

.plate-item.selected {
  border-color: #f92561;
  background: #fef7f7;
  box-shadow: 0 0 0 2px rgba(249, 37, 97, 0.1);
}

.plate-info {
  flex: 1;
}

.plate-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #140003;
}

.plate-info p {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.plate-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.price {
  font-weight: 600;
  color: #140003;
}

.category {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.availability {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.availability.available {
  background: #d1fae5;
  color: #047857;
}

.availability.unavailable {
  background: #fee2e2;
  color: #dc2626;
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