<template>
  <div class="restaurants-container">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">I miei Ristoranti</h1>
          <p class="page-subtitle">Gestisci i tuoi ristoranti e creane di nuovi</p>
        </div>
        <div class="header-right">
          <div class="user-info">
            <span class="welcome-text">Ciao, {{ user.firstname || 'User' }}!</span>
            <div class="user-avatar">{{ getUserInitial() }}</div>
            <button @click="logout" class="logout-btn">
              <span>🚪</span> Esci
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Create New Restaurant Card -->
      <div class="create-restaurant-card">
        <div class="create-card-content">
          <div class="create-icon">🏪</div>
          <h3>Crea un nuovo ristorante</h3>
          <p>Inizia a gestire un nuovo ristorante aggiungendolo al tuo account</p>
          <button @click="showCreateForm = true" class="create-btn">
            <span>➕</span> Nuovo Ristorante
          </button>
        </div>
      </div>

      <!-- Restaurants Grid -->
      <div class="restaurants-section">
        <h2 class="section-title">I tuoi ristoranti</h2>
        
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Caricamento ristoranti...</p>
        </div>

        <div v-else-if="restaurants.length === 0" class="empty-state">
          <div class="empty-icon">🍽️</div>
          <h3>Nessun ristorante trovato</h3>
          <p>Crea il tuo primo ristorante per iniziare</p>
        </div>

        <div v-else class="restaurants-grid">
          <div 
            v-for="restaurant in restaurants" 
            :key="restaurant.id"
            class="restaurant-card"
            @click="selectRestaurant(restaurant)"
          >
            <div class="restaurant-image">
              <div class="restaurant-avatar">{{ getRestaurantInitial(restaurant.name) }}</div>
            </div>
            
            <div class="restaurant-info">
              <h3 class="restaurant-name">{{ restaurant.name }}</h3>
              <p class="restaurant-address">{{ restaurant.address || 'Indirizzo non specificato' }}</p>
              <div class="restaurant-stats">
                <span class="stat">
                  <span class="stat-icon">📋</span>
                  {{ restaurant.menuCount || 0 }} Menù
                </span>
                <span class="stat">
                  <span class="stat-icon">🪑</span>
                  {{ restaurant.tableCount || 0 }} Tavoli
                </span>
              </div>
            </div>

            <div class="restaurant-actions">
              <button @click.stop="editRestaurant(restaurant)" class="edit-btn">
                <span>✏️</span>
              </button>
              <button @click.stop="deleteRestaurant(restaurant)" class="delete-btn">
                <span>🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Restaurant Modal -->
    <div v-if="showCreateForm" class="modal-overlay" @click="showCreateForm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Crea Nuovo Ristorante</h3>
          <button @click="showCreateForm = false" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="createRestaurant" class="create-form">
          <div class="form-group">
            <label for="restaurantName">Nome Ristorante *</label>
            <input 
              type="text" 
              id="restaurantName"
              v-model="newRestaurant.name"
              placeholder="Es. Trattoria da Mario"
              required
            />
          </div>

          <div class="form-group">
            <label for="restaurantAddress">Indirizzo</label>
            <input 
              type="text" 
              id="restaurantAddress"
              v-model="newRestaurant.address"
              placeholder="Es. Via Roma 123, Milano"
            />
          </div>

          <div class="form-group">
            <label for="restaurantPhone">Telefono</label>
            <input 
              type="tel" 
              id="restaurantPhone"
              v-model="newRestaurant.phone"
              placeholder="Es. +39 02 123 4567"
            />
          </div>

          <div class="form-group">
            <label for="restaurantDescription">Descrizione</label>
            <textarea 
              id="restaurantDescription"
              v-model="newRestaurant.description"
              placeholder="Descrivi brevemente il tuo ristorante..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="showCreateForm = false" class="cancel-btn">
              Annulla
            </button>
            <button type="submit" :disabled="!newRestaurant.name || creating" class="submit-btn">
              <span v-if="creating">Creazione...</span>
              <span v-else>Crea Ristorante</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RestaurantsView',
  data() {
    return {
      user: {},
      restaurants: [],
      loading: true,
      showCreateForm: false,
      creating: false,
      newRestaurant: {
        name: '',
        address: '',
        phone: '',
        description: ''
      }
    }
  },
  mounted() {
    this.loadUserData()
    this.loadRestaurants()
  },
  methods: {
    loadUserData() {
      const userData = localStorage.getItem('user')
      if (userData) {
        this.user = JSON.parse(userData)
      }
    },

    async loadRestaurants() {
      try {
        this.loading = true
        
        // Simulazione API call - sostituire con chiamata reale
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - sostituire con chiamata API reale
        this.restaurants = [
          {
            id: 1,
            name: 'Trattoria da Mario',
            address: 'Via Roma 123, Milano',
            phone: '+39 02 123 4567',
            description: 'Cucina tradizionale italiana',
            menuCount: 3,
            tableCount: 15
          },
          {
            id: 2,
            name: 'Pizzeria Bella Napoli',
            address: 'Corso Venezia 45, Milano',
            phone: '+39 02 987 6543',
            description: 'Le migliori pizze della città',
            menuCount: 2,
            tableCount: 20
          }
        ]
      } catch (error) {
        console.error('Errore nel caricamento ristoranti:', error)
        this.restaurants = []
      } finally {
        this.loading = false
      }
    },

    async createRestaurant() {
      if (!this.newRestaurant.name.trim()) return

      try {
        this.creating = true

        // TODO: Implementare chiamata API per creare ristorante
        const restaurantData = {
          ...this.newRestaurant,
          accountId: this.user.id,
          menuCount: 0,
          tableCount: 0
        }

        // Simulazione API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Mock: aggiungi alla lista locale
        const newId = Math.max(...this.restaurants.map(r => r.id), 0) + 1
        this.restaurants.push({
          id: newId,
          ...restaurantData
        })

        // Reset form
        this.newRestaurant = {
          name: '',
          address: '',
          phone: '',
          description: ''
        }
        this.showCreateForm = false

        console.log('Ristorante creato:', restaurantData)
      } catch (error) {
        console.error('Errore nella creazione del ristorante:', error)
        alert('Errore nella creazione del ristorante. Riprova.')
      } finally {
        this.creating = false
      }
    },

    selectRestaurant(restaurant) {
      // Salva il ristorante selezionato in localStorage
      localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant))
      
      // Naviga alla dashboard del ristorante
      this.$router.push('/dashboard')
    },

    editRestaurant(restaurant) {
      // TODO: Implementare modifica ristorante
      console.log('Modifica ristorante:', restaurant)
    },

    deleteRestaurant(restaurant) {
      if (confirm(`Sei sicuro di voler eliminare "${restaurant.name}"?`)) {
        // TODO: Implementare eliminazione ristorante
        const index = this.restaurants.findIndex(r => r.id === restaurant.id)
        if (index > -1) {
          this.restaurants.splice(index, 1)
        }
        console.log('Ristorante eliminato:', restaurant)
      }
    },

    getUserInitial() {
      return this.user.firstname ? this.user.firstname.charAt(0).toUpperCase() : 'U'
    },

    getRestaurantInitial(name) {
      return name ? name.charAt(0).toUpperCase() : 'R'
    },

    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
      localStorage.removeItem('selectedRestaurant')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.restaurants-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Urbanist', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.page-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.page-subtitle {
  color: #718096;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: #4a5568;
  font-weight: 500;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #c53030;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Create Restaurant Card */
.create-restaurant-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px dashed #e2e8f0;
  transition: all 0.3s ease;
}

.create-restaurant-card:hover {
  border-color: #4299e1;
  transform: translateY(-2px);
}

.create-card-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.create-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.create-card-content h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.create-card-content p {
  color: #718096;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.create-btn {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: transform 0.2s;
}

.create-btn:hover {
  transform: translateY(-1px);
}

/* Restaurants Section */
.restaurants-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

/* Loading and Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #4a5568;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #718096;
  margin: 0;
}

/* Restaurants Grid */
.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.restaurant-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.restaurant-card:hover {
  border-color: #4299e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.restaurant-image {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.restaurant-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #38b2ac 0%, #319795 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.restaurant-info {
  text-align: center;
  margin-bottom: 1rem;
}

.restaurant-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.restaurant-address {
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.restaurant-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.stat-icon {
  font-size: 1rem;
}

.restaurant-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.restaurant-card:hover .restaurant-actions {
  opacity: 1;
}

.edit-btn, .delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.edit-btn {
  background: #edf2f7;
  color: #4a5568;
}

.edit-btn:hover {
  background: #e2e8f0;
}

.delete-btn {
  background: #fed7d7;
  color: #e53e3e;
}

.delete-btn:hover {
  background: #feb2b2;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #edf2f7;
}

/* Form */
.create-form {
  padding: 0 1.5rem 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background: #edf2f7;
  color: #4a5568;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.submit-btn {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .main-content {
    padding: 1rem;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
  }

  .restaurant-actions {
    position: static;
    opacity: 1;
    justify-content: center;
    margin-top: 1rem;
  }
}
</style>
