<template>
  <div class="menu-container">
    <!-- Mobile Menu Overlay -->
    <div 
      v-if="showMobileMenu" 
      class="mobile-overlay" 
      @click="closeMobileMenu"
    ></div>

    <!-- Mobile Menu Toggle -->
    <button 
      v-if="isMobile" 
      class="mobile-menu-toggle" 
      @click="toggleMobileMenu"
    >
      <i class="fi fi-sr-menu-burger"></i>
    </button>

    <!-- Sidebar -->
    <div class="sidebar-container">
      <SidebarComponent 
        :selectedRestaurant="selectedRestaurant"
        :isMobile="showMobileMenu && isMobile"
        @close="closeMobileMenu"
        @logout="handleLogout"
      />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1>Menù</h1>
          <p class="subtitle">Gestisci i menu da un un'unica schermata</p>
        </div>
        <button class="add-menu-btn">+ Aggiungi Menù</button>
      </div>

      <!-- Categories Section -->
      <div class="categories-grid">
        <!-- Antipasti Card -->
        <div class="category-card" @click="navigateToCategory(categories[0])">
          <div class="card-content">
            <div class="card-header">
              <div class="title-section">
                <h3 class="category-title">Antipasti</h3>
                <div class="dish-count">
                  <span>4 piatti</span>
                </div>
              </div>
              <p class="category-description">Stuzzichini e antipasti per iniziare il pasto</p>
            </div>
            <div class="card-actions">
              <button class="view-btn">Visualizza i piatti</button>
              <button class="action-btn">
                <i class="fi fi-sr-pencil"></i>
              </button>
              <button class="action-btn">
                <i class="fi fi-sr-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Primi Piatti Card -->
        <div class="category-card" @click="navigateToCategory(categories[1])">
          <div class="card-content">
            <div class="card-header">
              <div class="title-section">
                <h3 class="category-title">Primi Piatti</h3>
                <div class="dish-count">
                  <span>19 piatti</span>
                </div>
              </div>
              <p class="category-description">Pasta, risotti e zuppe della tradizione</p>
            </div>
            <div class="card-actions">
              <button class="view-btn">Visualizza i piatti</button>
              <button class="action-btn">
                <i class="fi fi-sr-pencil"></i>
              </button>
              <button class="action-btn">
                <i class="fi fi-sr-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Secondi Piatti Card -->
        <div class="category-card" @click="navigateToCategory(categories[2])">
          <div class="card-content">
            <div class="card-header">
              <div class="title-section">
                <h3 class="category-title">Secondi Piatti</h3>
                <div class="dish-count">
                  <span>4 piatti</span>
                </div>
              </div>
              <p class="category-description">Carne, pesce e piatti vegetariani</p>
            </div>
            <div class="card-actions">
              <button class="view-btn">Visualizza i piatti</button>
              <button class="action-btn">
                <i class="fi fi-sr-pencil"></i>
              </button>
              <button class="action-btn">
                <i class="fi fi-sr-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/SidebarComponent.vue'

export default {
  name: 'MenuView',
  components: {
    SidebarComponent
  },
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
      ],
      showMobileMenu: false,
      isMobile: false,
      selectedRestaurant: {
        name: 'Fabbrica in Pedavena'
      }
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    
    closeMobileMenu() {
      this.showMobileMenu = false
    },
    
    handleLogout() {
      localStorage.removeItem('auth')
      this.$router.push('/login')
    },
    
    viewDishes(categoryId) {
      console.log('View dishes for category:', categoryId)
      // TODO: Navigate to dishes view
    },
    
    navigateToCategory(category) {
      console.log('Navigate to category:', category)
      // TODO: Navigate to category page
    }
  }
}
</script>

<style scoped>
/* Main Container */
.menu-container {
  width: 100%;
  height: 100vh;
  background: #f3f4f6;
  display: flex;
  font-family: 'Urbanist', sans-serif;
  position: relative;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

@media (max-width: 768px) {
  .mobile-overlay {
    display: block;
  }
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
}

.mobile-menu-toggle i {
  font-size: 20px;
  color: #140003;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }
}

/* Sidebar Container */
.sidebar-container {
  flex-shrink: 0;
  padding: 40px 0 40px 20px;
}

@media (max-width: 768px) {
  .sidebar-container {
    display: none;
  }
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 80px 20px 20px 20px;
  }
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
}

.header-left h1 {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  color: #140003;
  margin: 0 0 8px 0;
  line-height: normal;
}

.subtitle {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.add-menu-btn {
  background: #d41e51;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px 26px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #f2abbf;
  transition: all 0.2s ease;
}

.add-menu-btn:hover {
  background: #c11a47;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-left h1 {
    font-size: 32px;
  }
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 45px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

@media (max-width: 1200px) {
  .categories-grid {
    flex-wrap: wrap;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .categories-grid {
    flex-direction: column;
    gap: 16px;
  }
}

/* Category Cards */
.category-card {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  height: 200px;
  padding: 17px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .category-card {
    width: 100%;
    height: auto;
    min-height: 180px;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;

}

.card-header {
  flex: 1;
  margin-bottom: 24px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.category-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.dish-count {
  background: #f0f0f0;
  border-radius: 16px;
  padding: 2px 15px;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
}

.dish-count span {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #140003;
}

.category-description {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #212529;
  line-height: normal;
  margin: 0;
}

/* Card Actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.view-btn {
  background: #f92561;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  flex: 1;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #e91e5a;
}

.action-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 9px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e9ecef;
}

.action-btn i {
  font-size: 16px;
  color: #140003;
}
</style>
