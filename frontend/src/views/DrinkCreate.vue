<template>
  <div class="drink-create-container">
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
          <h1>{{ isEditMode ? 'Modifica Bevanda' : 'Crea Nuova Bevanda' }}</h1>
          <p>{{ isEditMode ? 'Aggiorna le informazioni della bevanda' : 'Inserisci i dettagli della nuova bevanda' }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="loading" class="loading-container">
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Caricamento bevanda...</p>
      </div>
    </div>
    <div v-else class="main-content">
      <div class="content-container">
        <!-- Drink Form -->
        <div class="form-section">
          <div class="section-card">
            <div class="section-header">
              <h2>Informazioni Bevanda</h2>
              <p>{{ isEditMode ? 'Modifica i dettagli della bevanda' : 'Inserisci i dettagli della bevanda' }}</p>
            </div>
            
            <form @submit.prevent="saveDrink" class="drink-form">
              <div class="form-group">
                <label for="drinkName">Nome Bevanda *</label>
                <input 
                  type="text" 
                  id="drinkName"
                  v-model="drinkData.name"
                  placeholder="Es. Coca Cola, Birra Peroni, Vino Rosso"
                  required
                />
              </div>

              <div class="form-group">
                <label for="drinkDescription">Descrizione</label>
                <textarea 
                  id="drinkDescription"
                  v-model="drinkData.description"
                  placeholder="Descrivi la bevanda, origine, caratteristiche..."
                  rows="3"
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="drinkPrice">Prezzo *</label>
                  <input 
                    type="number" 
                    id="drinkPrice"
                    v-model="drinkData.price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="drinkCategory">Categoria</label>
                  <select 
                    id="drinkCategory"
                    v-model="drinkData.category"
                  >
                    <option value="">Seleziona categoria</option>
                    <option value="Analcoliche">Analcoliche</option>
                    <option value="Alcoliche">Alcoliche</option>
                    <option value="Birre">Birre</option>
                    <option value="Vini">Vini</option>
                    <option value="Spirits">Spirits</option>
                    <option value="Liquori">Liquori</option>
                    <option value="Cocktail">Cocktail</option>
                    <option value="Caffè">Caffè</option>
                    <option value="Tè e Infusi">Tè e Infusi</option>
                    <option value="Succhi">Succhi</option>
                    <option value="Acqua">Acqua</option>
                  </select>
                </div>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="drinkData.isAlcoholic"
                  />
                  <span class="checkmark"></span>
                  Bevanda alcolica
                </label>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="drinkData.isAvailable"
                  />
                  <span class="checkmark"></span>
                  Bevanda disponibile
                </label>
              </div>
            </form>
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
          @click="saveDrink" 
          :disabled="!drinkData.name || !drinkData.price || saving" 
          class="submit-btn"
        >
          <span v-if="saving">{{ isEditMode ? 'Aggiornamento...' : 'Creazione...' }}</span>
          <span v-else>{{ isEditMode ? 'Aggiorna Bevanda' : 'Crea Bevanda' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiConfig from '@/config/api.js'

export default {
  name: 'DrinkCreate',
  data() {
    return {
      drinkData: {
        name: '',
        description: '',
        price: '',
        category: '',
        isAlcoholic: false,
        isAvailable: true,
      },
      saving: false,
      loading: false,
      isEditMode: false,
      drinkId: null,
    }
  },
  mounted() {
    this.checkEditMode()
    if (this.isEditMode) {
      this.loadDrink()
    }
  },
  methods: {
    checkEditMode() {
      this.drinkId = this.$route.params.id
      this.isEditMode = !!this.drinkId
    },

    async loadDrink() {
      if (!this.drinkId) return
      
      try {
        this.loading = true
        
        const response = await fetch(`${apiConfig.apiEndpoint}/drinks/${this.drinkId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const drink = data.data
          
          // Populate form with existing data
          this.drinkData = {
            name: drink.name || '',
            description: drink.description || '',
            price: drink.price || '',
            category: drink.category || '',
            isAlcoholic: drink.isAlcoholic !== undefined ? drink.isAlcoholic : false,
            isAvailable: drink.isAvailable !== undefined ? drink.isAvailable : true,
          }
        } else {
          throw new Error('Failed to fetch drink')
        }
      } catch (error) {
        console.error('Error loading drink:', error)
        alert('Errore nel caricamento della bevanda. Riprova.')
        this.goBack()
      } finally {
        this.loading = false
      }
    },

    async createDrink() {
      const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')

      const drinkPayload = {
        ...this.drinkData,
        price: parseFloat(this.drinkData.price),
        restaurantId: selectedRestaurant.id
      }

      console.log('Creating drink with payload:', drinkPayload)

      const response = await fetch(`${apiConfig.apiEndpoint}/drinks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(drinkPayload)
      })
      
      console.log('Create response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Create result:', result)
        if (result.success) {
          this.$router.push('/drinks')
        } else {
          throw new Error(result.message || 'Failed to create drink')
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Create error response:', errorData)
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create drink`)
      }
    },

    async updateDrink() {
      const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')

      const drinkPayload = {
        ...this.drinkData,
        price: parseFloat(this.drinkData.price),
        restaurantId: selectedRestaurant.id
      }

      console.log('Updating drink with payload:', drinkPayload)
      console.log('Drink ID:', this.drinkId)

      const response = await fetch(`${apiConfig.apiEndpoint}/drinks/${this.drinkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(drinkPayload)
      })
      
      console.log('Update response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Update result:', result)
        if (result.success) {
          this.$router.push('/drinks')
        } else {
          throw new Error(result.message || 'Failed to update drink')
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Update error response:', errorData)
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update drink`)
      }
    },

    async saveDrink() {
      if (!this.drinkData.name.trim()) {
        alert('Il nome della bevanda è obbligatorio')
        return
      }

      if (!this.drinkData.price || parseFloat(this.drinkData.price) < 0) {
        alert('Il prezzo deve essere maggiore o uguale a 0')
        return
      }

      try {
        this.saving = true

        if (this.isEditMode) {
          await this.updateDrink()
        } else {
          await this.createDrink()
        }

      } catch (error) {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} drink:`, error)
        alert(`Errore ${this.isEditMode ? 'nell\'aggiornamento' : 'nella creazione'} della bevanda: ${error.message}`)
      } finally {
        this.saving = false
      }
    },

    goBack() {
      this.$router.push('/drinks')
    }
  }
}
</script>

<style scoped>
.drink-create-container {
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
  max-width: 800px;
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
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.content-container {
  margin-bottom: 2rem;
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #140003;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
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
.form-group textarea:focus,
.form-group select:focus {
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