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
      <span style="font-size: 20px; color: #140003;">☰</span>
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
        <button class="btn-primary">+ Aggiungi Menù</button>
      </div>

      <!-- Categories Section -->
      <div class="categories-grid">
        <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
          :description="category.description"
          :dishCount="category.count"
          :category="category"
          @navigate="navigateToCategory"
          @view="viewDishes"
          @edit="editCategory"
          @delete="deleteCategory"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/SidebarComponent.vue'
import CategoryCard from '@/components/CategoryCard.vue'

export default {
  name: 'MenuView',
  components: {
    SidebarComponent,
    CategoryCard
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
    
    viewDishes(categoryName) {
      console.log('View dishes for category:', categoryName)
      this.$router.push(`/piatti/${categoryName}`)
    },
    
    navigateToCategory(category) {
      console.log('Navigate to category:', category)
      this.$router.push(`/piatti/${category.name}`)
    },
    
    editCategory(category) {
      console.log('Edit category:', category)
      // TODO: Implementare logica per modificare la categoria
    },
    
    deleteCategory(category) {
      console.log('Delete category:', category)
      // TODO: Implementare logica per eliminare la categoria
      if (confirm(`Sei sicuro di voler eliminare la categoria "${category.name}"?`)) {
        this.categories = this.categories.filter(c => c.id !== category.id)
      }
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
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
