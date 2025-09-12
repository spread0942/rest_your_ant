<template>
  <div class="sidebar" :class="{ 'mobile-sidebar': isMobile }">
    <!-- Restaurant Selector -->
    <div class="restaurant-selector">
      <div class="restaurant-content">
        <div class="restaurant-avatar">
          <img src="/restaurant-logo.png" alt="Restaurant" class="restaurant-image" @error="setDefaultImage">
        </div>
        <div class="restaurant-info">
          <p class="restaurant-name">{{ selectedRestaurant?.name || 'Fabbrica in Pedavena' }}</p>
        </div>
        <button class="restaurant-dropdown" @click="toggleRestaurantSelector">
          <i class="fi fi-sr-angle-down"></i>
        </button>
      </div>
    </div>

    <!-- Navigation Sections -->
    <div class="navigation">
      <!-- Generale Section -->
      <div class="nav-section">
        <h3 class="section-title">Generale</h3>
        
        <router-link 
          to="/dashboard"
          class="nav-item"
          :class="{ active: $route.path === '/dashboard' }"
          @click="handleNavClick"
        >
          <div class="nav-item-content">
            <i class="fi fi-sr-dashboard nav-icon"></i>
            <span>Dashboard</span>
          </div>
        </router-link>

        <router-link 
          to="/menu"
          class="nav-item"
          :class="{ active: $route.path === '/menu' }"
          @click="handleNavClick"
        >
          <div class="nav-item-content">
            <i class="fi fi-rr-book-alt nav-icon"></i>
            <span>Menù</span>
          </div>
        </router-link>

        <router-link 
          to="/aree-tavoli"
          class="nav-item"
          :class="{ active: $route.path === '/aree-tavoli' }"
          @click="handleNavClick"
        >
          <div class="nav-item-content">
            <i class="fi fi-rr-reservation-table nav-icon"></i>
            <span>Aree Tavoli</span>
          </div>
        </router-link>

        <div class="nav-item" @click="navigateTo('/orders')">
          <div class="nav-item-content">
            <i class="fi fi-rr-poll-h nav-icon"></i>
            <span>Ordini</span>
          </div>
        </div>
      </div>

      <!-- Impostazioni Section -->
      <div class="nav-section settings-section">
        <h3 class="section-title">Impostazioni</h3>
        
        <div class="nav-item" @click="navigateTo('/impostazioni')">
          <div class="nav-item-content">
            <i class="fi fi-sr-settings nav-icon"></i>
            <span>Impostazioni</span>
          </div>
        </div>

        <div class="nav-item logout-item" @click="handleLogout">
          <div class="nav-item-content">
            <i class="fi fi-sr-exit nav-icon"></i>
            <span>Esci</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Close Button for Mobile -->
    <button v-if="isMobile" class="mobile-close-btn" @click="$emit('close')">
      <i class="fi fi-sr-cross"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    selectedRestaurant: {
      type: Object,
      default: null
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'logout'],
  methods: {
    handleNavClick() {
      if (this.isMobile) {
        this.$emit('close')
      }
    },
    
    navigateTo(path) {
      this.$router.push(path)
      if (this.isMobile) {
        this.$emit('close')
      }
    },
    
    handleLogout() {
      this.$emit('logout')
    },
    
    toggleRestaurantSelector() {
      // TODO: Implementare il selettore di ristoranti
      console.log('Toggle restaurant selector')
    },
    
    setDefaultImage(event) {
      // Imposta un'immagine di default se il caricamento fallisce
      event.target.style.display = 'none'
      event.target.parentElement.innerHTML = '<div class="default-restaurant-icon">🏪</div>'
    }
  }
}
</script>

<style scoped>
/* Sidebar Container */
.sidebar {
  width: 20vw;
  height: calc(100vh - 80px);
  background: #f3f4f6;
  border-radius: 8px;
  box-shadow: -8px -8px 16px 0px inset #ffffff, 8px 8px 16px 0px inset #acacac;
  padding: 0;
  display: flex;
  flex-direction: column;
  font-family: 'Urbanist', sans-serif;
  overflow-y: auto;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 280px;
  height: 100vh;
  transform: translateX(0);
}

/* Restaurant Selector */
.restaurant-selector {
  padding: 8px;
  margin: 11px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
}

.restaurant-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.restaurant-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.restaurant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-restaurant-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
  border-radius: 50%;
  font-size: 20px;
}

.restaurant-info {
  flex: 1;
}

.restaurant-name {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.restaurant-dropdown {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(90deg);
}

.restaurant-dropdown i {
  font-size: 12px;
  color: #140003;
}

/* Navigation */
.navigation {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
}

.nav-section {
  margin-bottom: 16px;
}

.settings-section {
  margin-top: auto;
  margin-bottom: 20px;
}

.section-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #140003;
  margin: 0 0 4px 0;
  padding: 4px 12px;
  line-height: normal;
}

/* Navigation Items */
.nav-item {
  display: block;
  text-decoration: none;
  color: inherit;
  margin-bottom: 4px;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
}
.nav-item.active:hover {
box-shadow: -1px -1px 2px 0 #FFF;
    transform: translateY(1px) 
}

.nav-item.active {
  background: rgba(0, 0, 0, 0.04);
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  min-height: 20px;
}

.nav-icon {
  font-size: 20px;
  color: #140003;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-item-content span {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #140003;
  line-height: 20px;
}

/* Mobile Close Button */
.mobile-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.04);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
}

.mobile-close-btn i {
  font-size: 14px;
  color: #140003;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar:not(.mobile-sidebar) {
    display: none;
  }
}
</style>
