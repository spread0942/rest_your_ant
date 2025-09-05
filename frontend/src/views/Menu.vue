<template>
  <div class="menu-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Restaurant Info -->
      <div class="restaurant-info">
        <div class="restaurant-header">
          <div class="restaurant-icon">🏪</div>
          <div class="restaurant-name">
            <p>Fabbrica in Pedavena</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="navigation">
        <!-- Generale Section -->
        <div class="nav-section">
          <p class="section-title">Generale</p>
          
          <router-link 
            to="/dashboard"
            class="nav-item"
          >
            <div class="nav-icon">📊</div>
            <span>Dashboard</span>
          </router-link>

          <div class="nav-item active">
            <div class="nav-icon">📋</div>
            <span>Menù</span>
          </div>

          <div class="nav-item">
            <div class="nav-icon">📝</div>
            <span>Aree Tavoli</span>
          </div>

          <div class="nav-item">
            <div class="nav-icon">📋</div>
            <span>Ordini</span>
          </div>
        </div>

        <!-- Impostazioni Section -->
        <div class="nav-section settings">
          <p class="section-title">Impostazioni</p>
          
          <div class="nav-item">
            <div class="nav-icon">⚙️</div>
            <span>Impostazioni</span>
          </div>

          <div class="nav-item" @click="logout">
            <div class="nav-icon">🚪</div>
            <span>Esci</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="content-header">
        <div class="header-left">
          <h1 class="page-title">Menù</h1>
          <button class="create-menu-btn" @click="createNewMenu">
            Crea nuovo menù
          </button>
        </div>
        
        <!-- Restaurant Selector -->
        <div class="restaurant-selector">
          <div class="selector-content">
            <span>Fabbrica in Pedavena</span>
            <div class="dropdown-arrow">
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                <path d="M1 1L7 6.5L1 12" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Categories -->
      <div class="categories-container">
        <div class="categories-grid">
          <!-- Antipasti Card -->
          <div class="category-card">
            <div class="card-header">
              <div class="category-title-section">
                <h3 class="category-title">Antipasti</h3>
              </div>
              <div class="dish-count">
                <span>4 piatti</span>
              </div>
            </div>
            
            <p class="category-description">Stuzzichini e antipasti per iniziare il pasto</p>
            
            <div class="card-actions">
              <button class="primary-btn" @click="viewDishes(1)">
                Visualizza i piatti
              </button>
              <button class="icon-btn" @click="addDish(1)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </button>
              <button class="icon-btn" @click="editCategory(1)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Primi Piatti Card -->
          <div class="category-card">
            <div class="card-header">
              <div class="category-title-section">
                <h3 class="category-title">Primi Piatti</h3>
              </div>
              <div class="dish-count">
                <span>19 piatti</span>
              </div>
            </div>
            
            <p class="category-description">Pasta, risotti e zuppe della tradizione</p>
            
            <div class="card-actions">
              <button class="primary-btn" @click="viewDishes(2)">
                Visualizza i piatti
              </button>
              <button class="icon-btn" @click="addDish(2)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </button>
              <button class="icon-btn" @click="editCategory(2)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Secondi Piatti Card -->
          <div class="category-card">
            <div class="card-header">
              <div class="category-title-section">
                <h3 class="category-title">Secondi Piatti</h3>
              </div>
              <div class="dish-count">
                <span>4 piatti</span>
              </div>
            </div>
            
            <p class="category-description">Carne, pesce e piatti vegetariani</p>
            
            <div class="card-actions">
              <button class="primary-btn" @click="viewDishes(3)">
                Visualizza i piatti
              </button>
              <button class="icon-btn" @click="addDish(3)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                </svg>
              </button>
              <button class="icon-btn" @click="editCategory(3)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuView',
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Antipasti',
          count: 4,
          description: 'Stuzzichini e antipasti per iniziare il pasto'
        },
        {
          id: 2, 
          name: 'Primi Piatti',
          count: 19,
          description: 'Pasta, risotti e zuppe della tradizione'
        },
        {
          id: 3,
          name: 'Secondi Piatti', 
          count: 4,
          description: 'Carne, pesce e piatti vegetariani'
        }
      ]
    }
  },
  methods: {
    viewDishes(categoryId) {
      // Naviga alla vista dei piatti per la categoria specifica
      console.log(`Visualizza piatti per categoria ${categoryId}`)
    },
    addDish(categoryId) {
      // Aggiungi nuovo piatto alla categoria
      console.log(`Aggiungi piatto alla categoria ${categoryId}`)
    },
    editCategory(categoryId) {
      // Modifica categoria
      console.log(`Modifica categoria ${categoryId}`)
    },
    createNewMenu() {
      // Crea nuovo menu
      console.log('Crea nuovo menu')
    },
    logout() {
      // Logout functionality
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Container principale */
.menu-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  font-family: 'Urbanist', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 204px;
  background-color: #e9ecef;
  padding: 16px;
  border-radius: 8px;
  margin: 40px 0 40px 20px;
  height: fit-content;
  position: relative;
}

.restaurant-info {
  margin-bottom: 32px;
}

.restaurant-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.restaurant-icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.restaurant-name p {
  font-size: 14px;
  color: #140003;
  margin: 0;
  font-weight: normal;
}

/* Navigation */
.navigation {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section {
  margin-bottom: 16px;
}

.nav-section.settings {
  margin-top: auto;
  padding-top: 32px;
}

.section-title {
  font-size: 14px;
  color: #140003;
  margin: 0 0 8px 0;
  padding: 4px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 12px;
  text-decoration: none;
  color: #140003;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.nav-item.active {
  background-color: rgba(0, 0, 0, 0.04);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-item span {
  font-size: 14px;
  color: #140003;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 40px;
}

/* Header */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  font-size: 48px;
  color: #140003;
  margin: 0;
  font-weight: normal;
  line-height: 1;
}

.create-menu-btn {
  background-color: #140003;
  color: #f8f9fa;
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s;
}

.create-menu-btn:hover {
  background-color: #2a2a2a;
}

/* Restaurant Selector */
.restaurant-selector {
  background-color: #e9ecef;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 5px 6px 27px rgba(0, 0, 0, 0.05);
}

.selector-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 16px;
}

.selector-content span {
  font-size: 14px;
  color: #140003;
  white-space: nowrap;
}

.dropdown-arrow {
  transform: rotate(90deg);
  width: 8px;
  height: 13px;
  color: #140003;
}

/* Categories Container */
.categories-container {
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 32px;
  min-height: 778px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
}

/* Category Cards */
.category-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  border: 0.5px solid #adb5bd;
  box-shadow: 0px 5px 9px -1px rgba(20, 0, 3, 0.2);
  height: 200px;
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 24px;
}

.category-title-section {
  margin-bottom: 8px;
}

.category-title {
  font-size: 24px;
  color: #140003;
  margin: 0;
  font-weight: bold;
  line-height: 1;
}

.dish-count {
  background-color: #d9d9d9;
  padding: 2px 15px;
  border-radius: 16px;
  display: inline-block;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
}

.dish-count span {
  font-size: 14px;
  color: #140003;
  white-space: nowrap;
}

.category-description {
  font-size: 16px;
  color: #212529;
  margin: 0 0 24px 0;
  line-height: 1.2;
  flex: 1;
}

/* Card Actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-btn {
  background-color: #140003;
  color: #f8f9fa;
  padding: 8px 16px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  flex: 1;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #2a2a2a;
}

.icon-btn {
  background-color: #e9ecef;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: #d6d9dc;
}

.icon-btn svg {
  width: 16px;
  height: 16px;
  color: #140003;
}

/* Responsive */
@media (max-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .menu-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    margin: 20px;
    margin-bottom: 0;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .content-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
