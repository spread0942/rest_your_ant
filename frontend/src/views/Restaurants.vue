<template>
  <div class="restaurants-container">
    <!-- Header with Neumorphism -->
    <header class="header-section">
      <div class="header-content">
        <div class="welcome-section">
          <h1 class="welcome-title">Bentornato {{ user.firstname || 'Mario' }}!</h1>
          <p class="welcome-subtitle">Gestisci i tuoi ristoranti e creane di nuovi</p>
        </div>
        <div class="header-buttons">
          <button class="neomorph-btn settings-btn" @click="openSettings">
           <i class="fi fi-sr-settings"></i>
          </button>
          <button class="neomorph-btn exit-btn" @click="logout">
            <i class="fi fi-sr-exit"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Create Restaurant Section -->
    <section class="create-section">
      <div class="create-card">
        <div class="create-content">
          <!-- Chef Icon -->
          <div class="chef-icon">
            <i class="fi fi-sr-hat-chef"></i>
          </div>
          
          <h2 class="create-title">Crea un nuovo ristorante</h2>
          <p class="create-description">Inizia a gestire un nuovo ristorante aggiungendolo al tuo account</p>
          
          <button @click="showCreateForm = true" class="add-restaurant-btn">
            Aggiungi nuovo locale
          </button>
        </div>
      </div>
    </section>

    <!-- Restaurants Section -->
    <section class="restaurants-section">
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
          <!-- Restaurant Logo -->
          <div class="restaurant-logo">
            <div class="logo-circle">
              <div class="logo-placeholder">
                <span>{{ getRestaurantInitial(restaurant.name) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Restaurant Info -->
          <div class="restaurant-info">
            <h3 class="restaurant-name">{{ restaurant.name }}</h3>
            <p class="restaurant-address">{{ restaurant.address || 'Indirizzo non specificato' }}</p>
          </div>

          <!-- Restaurant Stats -->
          <div class="restaurant-stats">
            <div class="stat-item">
<i class="fi fi-rr-book-alt"></i>
              <span>{{ restaurant.menuCount || 0 }} Menù</span>
            </div>
            <div class="stat-item">
              <i class="fi fi-rr-chair"></i>
              <span>{{ restaurant.tableCount || 0 }} tavoli</span>
            </div>
          </div>
        </div>
      </div>
    </section>

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
            <label for="restaurantEmail">Email</label>
            <input 
              type="email" 
              id="restaurantEmail"
              v-model="newRestaurant.email"
              placeholder="Es. info@ristorante.it"
            />
          </div>

          <div class="form-group">
            <label for="restaurantWebsite">Website</label>
            <input 
              type="url" 
              id="restaurantWebsite"
              v-model="newRestaurant.website"
              placeholder="Es. https://www.ristorante.it"
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
import apiConfig from '@/config/api.js'

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
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        tenantId: null,
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
        
        const response = await fetch(`${apiConfig.apiEndpoint}/restaurants`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
        if (response.ok) {
          const data = await response.json();
          this.restaurants = data.data.restaurants;
        } else {
          throw new Error('Failed to fetch restaurants');
        }
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

        this.newRestaurant.tenantId = this.user.tenantId || null;

        const response = await fetch(`${apiConfig.apiEndpoint}/restaurants`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(this.newRestaurant)
          });
          
        if (response.ok) {
          const data = await response.json();
          this.restaurants.push(data.data);
        } else {
          throw new Error('Invalid credentials');
        }
        this.showCreateForm = false

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

    async deleteRestaurant(restaurant) {
      if (confirm(`Sei sicuro di voler eliminare "${restaurant.name}"?`)) {
        try {
          const response = await fetch(`${apiConfig.apiEndpoint}/restaurants/${restaurant.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (!data.success) {
              throw new Error(data.message || 'Failed to delete restaurant');
            }
            this.restaurants = this.restaurants.filter(r => r.id !== restaurant.id);
          } else {
            throw new Error('Failed to delete restaurant');
          }
        } catch (error) {
          console.error('Errore nell\'eliminazione del ristorante:', error);
          alert('Errore nell\'eliminazione del ristorante. Riprova.');
        }
      }
    },

    getUserInitial() {
      return this.user.firstname ? this.user.firstname.charAt(0).toUpperCase() : 'U'
    },

    getRestaurantInitial(name) {
      return name ? name.charAt(0).toUpperCase() : 'R'
    },

    openSettings() {
      // TODO: Implementare apertura impostazioni
      console.log('Apertura impostazioni')
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
/* Neumorphism Restaurant Page */
.restaurants-container {
  min-height: 100vh;
  background: #f0f0f0;
  font-family: 'Urbanist', sans-serif;
  padding: 25px 49px;
}

/* Header Section with Neumorphism */
.header-section {
  margin-bottom: 36px;
}

.header-content {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: -12px -12px 24px 0px #ffffff, 12px 12px 24px 0px #fdeff3;
  height: 98px;
  box-sizing: border-box;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.welcome-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 30px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.welcome-subtitle {
  font-family: 'Urbanist', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  line-height: normal;
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
}

.neomorph-btn {
  width: 30px;
  height: 30px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #c5c5c5;
  transition: all 0.2s ease;
}

.neomorph-btn i {
  font-size: 16px;
  color: #666;
}

.neomorph-btn:hover {
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #c5c5c5;
}

.neomorph-btn:active {
  box-shadow: inset -2px -2px 4px 0px #ffffff, inset 2px 2px 4px 0px #c5c5c5;
}

/* Create Section */
.create-section {
  margin-bottom: 52px;
}

.create-card {
  background: #f0f0f0;
  border-radius: 8px;
  height: 338px;
  position: relative;
  box-shadow: -12px -12px 24px 0px #ffffff, 12px 12px 24px 0px #fdeff3;
  border: 1px dashed #d41e51;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 516px;
}

.chef-icon {
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chef-icon i {
  font-size: 55px;
  color: #d41e51;
}

.create-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  line-height: normal;
  text-align: center;
}

.create-description {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  line-height: normal;
  text-align: center;
}

.add-restaurant-btn {
  background: #d41e51;
  color: #fcfbf8;
  border: none;
  border-radius: 8px;
  padding: 10px 26px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #f2abbf;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-restaurant-btn:hover {
  background: #c11d4a;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #f2abbf;
}

.add-restaurant-btn:active {
  box-shadow: inset -2px -2px 4px 0px #ffffff, inset 2px 2px 4px 0px #f2abbf;
}

/* Restaurants Section */
.restaurants-section {
  margin-top: 52px;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  justify-content: center;
}

.restaurant-card {
  background: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #cfcfcf;
  width: 100%;
  height: 300px;
  padding: 24px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
   position: relative ;
  box-shadow: 10px 10px 20px #bebebe,
              -10px -10px 20px #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.restaurant-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 10px 10px 20px #bebebe,
              inset -10px -10px 20px #ffffff;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.restaurant-card:hover {
transform: translateY(2px); /* leggero movimento verso il basso */
  box-shadow: 6px 6px 12px #bebebe,
              -6px -6px 12px #ffffff;
}
.restaurant-card:hover::after {
  opacity: 1; /* attiva ombre interne */
}

.restaurant-logo {
  position: relative;
  width: 92px;
  height: 92px;
}

.logo-circle {
  width: 92px;
  height: 92px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #c5c5c5;
}

.logo-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #38b2ac 0%, #319795 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.restaurant-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.restaurant-name {
  font-family: 'Urbanist', sans-serif;
  font-size: 30px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.restaurant-address {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #979ea5;
  margin: 0;
  line-height: normal;
}

.restaurant-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
}

.stat-item i {
  flex-shrink: 0;
  font-size: 17px;
  color: #F92561;
}

/* Loading and Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-family: 'Urbanist', sans-serif;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #d41e51;
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

/* Modal Styles */
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
  background: #fcfbf8;
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
  color: #140003;
  margin: 0;
  font-family: 'Urbanist', sans-serif;
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
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
}

.create-form {
  padding: 0 1.5rem 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #140003;
  margin-bottom: 0.5rem;
  font-family: 'Urbanist', sans-serif;
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
  box-shadow: inset -2px -2px 4px 0px #ffffff, inset 2px 2px 4px 0px #e0e0e0;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #d41e51;
  box-shadow: inset -2px -2px 4px 0px #ffffff, inset 2px 2px 4px 0px #e0e0e0, 0 0 0 3px rgba(212, 30, 81, 0.1);
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
  background: #f0f0f0;
  color: #4a5568;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  cursor: pointer;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #c5c5c5;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #c5c5c5;
}

.submit-btn {
  background: #d41e51;
  color: #fcfbf8;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  font-weight: 600;
  cursor: pointer;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #f2abbf;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #c11d4a;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #f2abbf;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .restaurants-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .restaurants-container {
    padding: 15px 25px;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    height: auto;
    padding: 24px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .welcome-subtitle {
    font-size: 16px;
  }

  .create-title {
    font-size: 32px;
  }

  .restaurants-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .restaurant-card {
    width: 100%;
    height: auto;
  }
}

@media (max-width: 480px) {
  .create-title {
    font-size: 24px;
  }
  
  .restaurant-stats {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
