<template>
  <div class="sidebar" :class="{ 'mobile-sidebar': isMobile }">
    <!-- Restaurant Selector -->
    <div class="restaurant-selector">
      <div class="restaurant-content" :class="{ clickable: canShowDropdown }" @click="toggleRestaurantSelector">
        <div class="restaurant-avatar">
          <img v-if="currentRestaurant.avatar" :src="currentRestaurant.avatar" :alt="currentRestaurant.name" class="restaurant-image" @error="setDefaultImage">
          <div v-else class="default-restaurant-icon">🏪</div>
        </div>
        <div class="restaurant-info">
          <p class="restaurant-name">{{ currentRestaurant.name || 'Seleziona un ristorante' }}</p>
        </div>
        <button v-if="canShowDropdown" class="restaurant-dropdown" :class="{ 'dropdown-open': showDropdown }">
          <i class="fi fi-sr-angle-down"></i>
        </button>
      </div>
      
      <!-- Dropdown Menu -->
      <div v-if="showDropdown && canShowDropdown" class="restaurant-dropdown-menu">
        <div 
          v-for="restaurant in restaurants" 
          :key="restaurant.id"
          class="restaurant-dropdown-item"
          :class="{ 'active': restaurant.id === currentRestaurant.id }"
          @click="selectRestaurant(restaurant)"
        >
          <div class="dropdown-item-avatar">
            <img v-if="restaurant.avatar" :src="restaurant.avatar" :alt="restaurant.name" class="dropdown-item-image" @error="setDefaultImage">
            <div v-else class="default-restaurant-icon">🏪</div>
          </div>
          <div class="dropdown-item-info">
            <p class="dropdown-item-name">{{ restaurant.name }}</p>
            <p class="dropdown-item-address">{{ restaurant.address || 'Indirizzo non specificato' }}</p>
          </div>
          <div v-if="restaurant.id === currentRestaurant.id" class="dropdown-item-check">
            <i class="fi fi-sr-check"></i>
          </div>
        </div>
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
          to="/menu-products"
          class="nav-item"
          :class="{ active: $route.path === '/menu-products' }"
          @click="handleNavClick"
        >
          <div class="nav-item-content">
            <i class="fi fi-rr-glass nav-icon"></i>
            <span>Bevande & Prodotti</span>
          </div>
        </router-link>

        <router-link 
          to="/menu-management"
          class="nav-item"
          :class="{ active: $route.path === '/menu-management' }"
          @click="handleNavClick"
        >
          <div class="nav-item-content">
            <i class="fi fi-rr-settings-sliders nav-icon"></i>
            <span>Assegnazioni Menu</span>
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
    restaurants: {
      type: Array,
      default: () => []
    },
    selectedRestaurant: {
      type: Object,
      default: null
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'logout', 'restaurant-changed'],
  data() {
    return {
      showDropdown: false,
      currentRestaurant: {
        id: null,
        name: 'Seleziona un ristorante',
        address: '',
        avatar: ''
      }
    }
  },
  computed: {
    canShowDropdown() {
      return this.restaurants.length > 1
    }
  },
  mounted() {
    this.initializeRestaurant()
    
    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside)
  },
  watch: {
    restaurants: {
      handler() {
        this.initializeRestaurant()
      },
      immediate: true
    },
    selectedRestaurant: {
      handler(newRestaurant) {
        if (newRestaurant) {
          this.currentRestaurant = newRestaurant
        }
      },
      immediate: true
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    initializeRestaurant() {
      // If there's a selected restaurant prop, use it
      if (this.selectedRestaurant) {
        this.currentRestaurant = this.selectedRestaurant
        return
      }

      // Load saved restaurant from localStorage
      const savedRestaurant = localStorage.getItem('selectedRestaurant')
      if (savedRestaurant) {
        try {
          const parsed = JSON.parse(savedRestaurant)
          // Check if the saved restaurant still exists in the restaurants list
          const exists = this.restaurants.find(r => r.id === parsed.id)
          if (exists) {
            this.currentRestaurant = parsed
          } else if (this.restaurants.length > 0) {
            // If saved restaurant doesn't exist, select the first available
            this.currentRestaurant = this.restaurants[0]
            localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
          }
        } catch (e) {
          console.warn('Error parsing saved restaurant:', e)
          // Select first restaurant if parsing fails
          if (this.restaurants.length > 0) {
            this.currentRestaurant = this.restaurants[0]
            localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
          }
        }
      } else if (this.restaurants.length > 0) {
        // No saved restaurant, select the first one
        this.currentRestaurant = this.restaurants[0]
        localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
      }
    },

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
      // Only allow dropdown if there are multiple restaurants
      if (this.canShowDropdown) {
        this.showDropdown = !this.showDropdown
      }
    },
    
    selectRestaurant(restaurant) {
      this.currentRestaurant = restaurant
      this.showDropdown = false
      
      // Save to localStorage
      localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant))
      
      // Emit event to parent components
      this.$emit('restaurant-changed', restaurant)
    },
    
    handleClickOutside(event) {
      const restaurantSelector = this.$el.querySelector('.restaurant-selector')
      if (restaurantSelector && !restaurantSelector.contains(event.target)) {
        this.showDropdown = false
      }
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
  position: fixed;              /* fissa la sidebar */
  top: 20px;                    /* la abbassi di 80px per compensare l’header */
  left: 20px;                      /* attaccata al bordo sinistro */
  width: 20vw;                  /* la tua larghezza */
  height: calc(100vh - 40px);   /* calcolata correttamente sotto l’header */
  background: #f3f4f6;
  border-radius: 8px;
  box-shadow: -8px -8px 16px 0px inset #ffffff,
              8px 8px 16px 0px inset #acacac;
  padding: 0;
  display: flex;
  flex-direction: column;
  font-family: 'Urbanist', sans-serif;
  overflow-y: auto;
  z-index: 1000;                /* per stare sopra al contenuto */
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
  position: relative;
}

.restaurant-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.restaurant-content.clickable {
  cursor: pointer;
}

.restaurant-content.clickable:hover {
  background: rgba(0, 0, 0, 0.02);
}

.restaurant-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
justify-content: center;
align-items: center;
background-color: color(srgb 0.952 0.957 0.9657);
object-fit: cover;
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
  font-size: 1rem;
  font-weight: 400;
  color: #140003;
  margin: 0;
  padding-right: 10px;
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
  transition: transform 0.2s ease;
}

.restaurant-dropdown.dropdown-open {
  transform: rotate(180deg);
}

.restaurant-dropdown i {
  font-size: 12px;
  color: #140003;
}

/* Dropdown Menu */
.restaurant-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #f3f4f6;
  border-radius: 8px;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #acacac;
  z-index: 1002;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.restaurant-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 4px;
}

.restaurant-dropdown-item:hover {
  background: rgba(0, 0, 0, 0.04);
  box-shadow: -1px -1px 2px 0px #ffffff, 1px 1px 2px 0px #acacac;
}

.restaurant-dropdown-item.active {
  background: rgba(0, 0, 0, 0.06);
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
}

.dropdown-item-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.dropdown-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-item-info {
  flex: 1;
}

.dropdown-item-name {
  font-family: 'Urbanist', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #140003;
  margin: 0 0 2px 0;
  line-height: normal;
}

.dropdown-item-address {
  font-family: 'Urbanist', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #666;
  margin: 0;
  line-height: normal;
}

.dropdown-item-check {
  color: #28a745;
  font-size: 14px;
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
