<template>
  <div class="menu-management-container">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent @restaurant-changed="handleRestaurantChanged" />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-left">
          <h1 class="page-title">Gestione Menu Completa</h1>
          <p class="page-subtitle">Assegna bevande e prodotti ai tuoi menu</p>
        </div>
      </div>

      <!-- Menu Selection -->
      <div class="menu-selector">
        <label for="menuSelect">Seleziona Menu:</label>
        <select 
          id="menuSelect" 
          v-model="selectedMenuId"
          @change="loadMenuItems"
          class="menu-select"
        >
          <option value="">-- Seleziona un menu --</option>
          <option 
            v-for="menu in menus" 
            :key="menu.id" 
            :value="menu.id"
          >
            {{ menu.name }} ({{ menu.category }})
          </option>
        </select>
      </div>

      <!-- Menu Content -->
      <div v-if="selectedMenuId" class="menu-content">
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button 
            class="tab-button"
            :class="{ active: activeTab === 'drinks' }"
            @click="activeTab = 'drinks'"
          >
            <i class="fi fi-rr-glass"></i>
            Bevande del Menu
            <span class="tab-count">({{ menuDrinks.length }})</span>
          </button>
          <button 
            class="tab-button"
            :class="{ active: activeTab === 'available-drinks' }"
            @click="activeTab = 'available-drinks'"
          >
            <i class="fi fi-rr-plus"></i>
            Aggiungi Bevande
            <span class="tab-count">({{ availableDrinks.length }})</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Menu Drinks Tab -->
          <div v-if="activeTab === 'drinks'" class="menu-drinks-tab">
            <div class="tab-header">
              <h2 class="tab-title">Bevande nel Menu</h2>
              <span class="tab-description">Bevande attualmente assegnate al menu selezionato</span>
            </div>

            <div v-if="menuDrinks.length === 0" class="empty-state">
              <i class="fi fi-rr-glass"></i>
              <p>Nessuna bevanda assegnata a questo menu</p>
              <button @click="activeTab = 'available-drinks'" class="add-items-btn">
                Aggiungi Bevande
              </button>
            </div>

            <div v-else class="items-grid">
              <div 
                v-for="drink in menuDrinks" 
                :key="drink.id"
                class="item-card menu-item"
              >
                <div class="item-header">
                  <h3 class="item-name">{{ drink.name }}</h3>
                  <button 
                    class="remove-button"
                    @click="removeDrinkFromMenu(drink.id)"
                    title="Rimuovi dal menu"
                  >
                    <i class="fi fi-rr-cross"></i>
                  </button>
                </div>
                
                <p class="item-description">{{ drink.description || 'Nessuna descrizione' }}</p>
                
                <div class="item-details">
                  <div class="detail-row">
                    <span class="detail-label">Prezzo:</span>
                    <span class="detail-value price">€{{ drink.price }}</span>
                  </div>
                  <div class="detail-row" v-if="drink.category">
                    <span class="detail-label">Categoria:</span>
                    <span class="detail-value">{{ drink.category }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Alcolico:</span>
                    <span class="detail-value" :class="{ alcoholic: drink.isAlcoholic }">
                      {{ drink.isAlcoholic ? 'Sì' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Available Drinks Tab -->
          <div v-if="activeTab === 'available-drinks'" class="available-drinks-tab">
            <div class="tab-header">
              <h2 class="tab-title">Bevande Disponibili</h2>
              <span class="tab-description">Clicca su una bevanda per aggiungerla al menu</span>
            </div>

            <div v-if="availableDrinks.length === 0" class="empty-state">
              <i class="fi fi-rr-glass"></i>
              <p>Tutte le bevande sono già assegnate a questo menu</p>
            </div>

            <div v-else class="items-grid">
              <div 
                v-for="drink in availableDrinks" 
                :key="drink.id"
                class="item-card available-item"
                @click="addDrinkToMenu(drink.id)"
              >
                <div class="item-header">
                  <h3 class="item-name">{{ drink.name }}</h3>
                  <button class="add-button" title="Aggiungi al menu">
                    <i class="fi fi-rr-plus"></i>
                  </button>
                </div>
                
                <p class="item-description">{{ drink.description || 'Nessuna descrizione' }}</p>
                
                <div class="item-details">
                  <div class="detail-row">
                    <span class="detail-label">Prezzo:</span>
                    <span class="detail-value price">€{{ drink.price }}</span>
                  </div>
                  <div class="detail-row" v-if="drink.category">
                    <span class="detail-label">Categoria:</span>
                    <span class="detail-value">{{ drink.category }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Alcolico:</span>
                    <span class="detail-value" :class="{ alcoholic: drink.isAlcoholic }">
                      {{ drink.isAlcoholic ? 'Sì' : 'No' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Menu Selected -->
      <div v-else class="no-menu-selected">
        <i class="fi fi-rr-book-alt"></i>
        <h3>Seleziona un Menu</h3>
        <p>Scegli un menu dalla lista sopra per gestire le bevande assegnate</p>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/SidebarComponent.vue'
import api from '@/config/api'

export default {
  name: 'MenuManagementView',
  components: {
    SidebarComponent
  },
  data() {
    return {
      activeTab: 'drinks',
      selectedMenuId: '',
      menus: [],
      allDrinks: [],
      menuDrinks: [],
      loading: false
    }
  },
  computed: {
    availableDrinks() {
      const menuDrinkIds = this.menuDrinks.map(d => d.id)
      return this.allDrinks.filter(drink => !menuDrinkIds.includes(drink.id))
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    handleRestaurantChanged(restaurant) {
      console.log('Restaurant changed in MenuManagement:', restaurant)
      this.loadData()
    },
    
    async loadData() {
      this.loading = true
      try {
        await Promise.all([
          this.loadMenus(),
          this.loadAllDrinks()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadMenus() {
      try {
        const response = await api.get('/menus')
        this.menus = response.data.menus || []
      } catch (error) {
        console.error('Error loading menus:', error)
        // Use mock data if API fails
        this.menus = [
          {
            id: 1,
            name: 'Antipasti',
            category: 'starters',
            description: 'Menu degli antipasti'
          },
          {
            id: 2,
            name: 'Primi Piatti', 
            category: 'first-courses',
            description: 'Menu dei primi piatti'
          },
          {
            id: 3,
            name: 'Bevande',
            category: 'drinks',
            description: 'Menu delle bevande'
          }
        ]
      }
    },
    
    async loadAllDrinks() {
      try {
        const response = await api.get('/drinks')
        this.allDrinks = response.data.data.drinks || []
      } catch (error) {
        console.error('Error loading drinks:', error)
        // Use mock data if API fails
        this.allDrinks = [
          {
            id: 1,
            name: 'Coca Cola',
            description: 'Classic Coca Cola',
            price: 2.99,
            category: 'soft_drink',
            isAlcoholic: false,
            isAvailable: true
          },
          {
            id: 2,
            name: 'Vino della Casa',
            description: 'Vino rosso della casa',
            price: 8.99,
            category: 'wine',
            isAlcoholic: true,
            isAvailable: true
          },
          {
            id: 3,
            name: 'Birra Artigianale',
            description: 'Birra locale artigianale',
            price: 5.50,
            category: 'beer',
            isAlcoholic: true,
            isAvailable: true
          },
          {
            id: 4,
            name: 'Acqua Naturale',
            description: 'Acqua naturale 0.5L',
            price: 1.50,
            category: 'water',
            isAlcoholic: false,
            isAvailable: true
          }
        ]
      }
    },
    
    async loadMenuItems() {
      if (!this.selectedMenuId) {
        this.menuDrinks = []
        return
      }
      
      try {
        const response = await api.get(`/menus/${this.selectedMenuId}`)
        this.menuDrinks = response.data.drinks || []
      } catch (error) {
        console.error('Error loading menu items:', error)
        // Use mock data if API fails - simulate drinks for selected menu
        if (this.selectedMenuId === '3') { // Drinks menu
          this.menuDrinks = [
            this.allDrinks[0], // Coca Cola
            this.allDrinks[3]  // Acqua Naturale
          ]
        } else {
          this.menuDrinks = []
        }
      }
    },
    
    async addDrinkToMenu(drinkId) {
      try {
        await api.post(`/menus/${this.selectedMenuId}/drinks`, { drinkId })
        
        // Move drink from available to menu drinks
        const drink = this.allDrinks.find(d => d.id === drinkId)
        if (drink) {
          this.menuDrinks.push(drink)
        }
        
        this.activeTab = 'drinks'
      } catch (error) {
        console.error('Error adding drink to menu:', error)
        alert('Errore nell\'aggiungere la bevanda al menu')
      }
    },
    
    async removeDrinkFromMenu(drinkId) {
      if (!confirm('Sei sicuro di voler rimuovere questa bevanda dal menu?')) {
        return
      }
      
      try {
        await api.delete(`/menus/${this.selectedMenuId}/drinks/${drinkId}`)
        
        // Remove drink from menu drinks
        this.menuDrinks = this.menuDrinks.filter(d => d.id !== drinkId)
      } catch (error) {
        console.error('Error removing drink from menu:', error)
        alert('Errore nel rimuovere la bevanda dal menu')
      }
    }
  }
}
</script>

<style scoped>
.menu-management-container {
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
  align-items: center;
  justify-content: space-between;
}

.header-left {
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

/* Menu Selector */
.menu-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-selector label {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #140003;
}

.menu-select {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  background: #ffffff;
  color: #140003;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 400px;
}

.menu-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Menu Content */
.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  border-radius: 12px;
  padding: 4px;
  box-shadow: inset -4px -4px 8px 0px #ffffff, inset 4px 4px 8px 0px #dfe2e7;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.tab-button:hover {
  color: #140003;
}

.tab-button.active {
  background: #f3f4f6;
  color: #140003;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #dfe2e7;
}

.tab-count {
  font-size: 14px;
  color: #666;
  margin-left: auto;
}

/* Tab Content */
.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
}

.tab-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #140003;
  margin: 0;
}

.tab-description {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: #666;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #f0f0f0;
  border: 1px dashed #ccc;
  border-radius: 12px;
}

.empty-state i {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state p {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
}

.add-items-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-items-btn:hover {
  background: #0056b3;
}

/* No Menu Selected */
.no-menu-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-menu-selected i {
  font-size: 64px;
  color: #ccc;
  margin-bottom: 20px;
}

.no-menu-selected h3 {
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #140003;
  margin: 0 0 8px 0;
}

.no-menu-selected p {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* Items Grid */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.item-card {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 12px;
  padding: 20px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  transition: all 0.2s ease;
}

.item-card:hover {
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #acacac;
  transform: translateY(-2px);
}

.item-card.available-item {
  cursor: pointer;
  border-color: #28a745;
}

.item-card.available-item:hover {
  background: linear-gradient(135deg, #f0f0f0, #f0fff4);
}

.item-card.menu-item {
  border-color: #007bff;
  background: linear-gradient(135deg, #f0f0f0, #f0f8ff);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.item-name {
  font-family: 'Urbanist', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #140003;
  margin: 0;
}

.add-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #28a745;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.add-button:hover {
  background: #218838;
  transform: scale(1.1);
}

.remove-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.remove-button:hover {
  background: #c82333;
  transform: scale(1.1);
}

.item-description {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.detail-value {
  font-size: 14px;
  color: #140003;
  font-weight: 500;
}

.detail-value.price {
  color: #28a745;
  font-weight: 600;
}

.detail-value.alcoholic {
  color: #dc3545;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-management-container {
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

  .tab-navigation {
    flex-direction: column;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .menu-select {
    max-width: 100%;
  }
}

/* Font Loading */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600&display=swap');
</style>