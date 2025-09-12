<template>
  <div class="piatti-container">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent 
        :selectedRestaurant="selectedRestaurant"
        :isMobile="false"
        @logout="handleLogout" 
      />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-left">
          <h1 class="page-title">{{ categoryName }}</h1>
          <p class="page-subtitle">Aggiungi e rimuovi piatti</p>
        </div>
        <button class="add-button" @click="addDish">
          + Aggiungi Piatto
        </button>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <!-- Table Header -->
        <div class="table-header">
          <div class="header-cell name-header">Nome</div>
          <div class="header-cell price-header">Prezzo</div>
        </div>

        <!-- Table Rows -->
        <div class="table-body">
          <div 
            v-for="dish in dishes" 
            :key="dish.id" 
            class="table-row"
          >
            <div class="dish-name">{{ dish.name }}</div>
            <div class="dish-price">{{ dish.price }}</div>
            <div class="actions">
              <!-- Edit Button -->
              <button 
                class="action-button edit-button"
                @click="editDish(dish)"
                title="Modifica piatto"
              >
                <i class="uil uil-edit"></i>
              </button>
              <!-- Delete Button -->
              <button 
                class="action-button delete-button"
                @click="deleteDish(dish)"
                title="Elimina piatto"
              >
                <i class="uil uil-trash-alt"></i>
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
  name: 'PiattiView',
  components: {
    SidebarComponent
  },
  data() {
    return {
      categoryName: 'Antipasti',
      selectedRestaurant: {
        name: 'Fabbrica in Pedavena'
      },
      dishes: [
        { id: 1, name: 'Involtini di asiago', price: '5,00€' },
        { id: 2, name: 'Involtini di asiago', price: '5,00€' },
        { id: 3, name: 'Involtini di asiago', price: '5,00€' },
        { id: 4, name: 'Involtini di asiago', price: '5,00€' },
        { id: 5, name: 'Involtini di asiago', price: '5,00€' },
        { id: 6, name: 'Involtini di asiago', price: '5,00€' },
        { id: 7, name: 'Involtini di asiago', price: '5,00€' },
        { id: 8, name: 'Involtini di asiago', price: '5,00€' },
        { id: 9, name: 'Involtini di asiago', price: '5,00€' }
      ]
    }
  },
  mounted() {
    // Get category from route params
    this.categoryName = this.$route.params.category || 'Antipasti'
  },
  methods: {
    addDish() {
      console.log('Aggiungi piatto per categoria:', this.categoryName)
      // TODO: Implementare logica per aggiungere un nuovo piatto
    },
    editDish(dish) {
      console.log('Modifica piatto:', dish)
      // TODO: Implementare logica per modificare il piatto
    },
    deleteDish(dish) {
      console.log('Elimina piatto:', dish)
      // TODO: Implementare logica per eliminare il piatto
      if (confirm(`Sei sicuro di voler eliminare "${dish.name}"?`)) {
        this.dishes = this.dishes.filter(d => d.id !== dish.id)
      }
    },
    handleLogout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('selectedRestaurant')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Main Container */
.piatti-container {
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
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 379px;
}

.page-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  line-height: normal;
  color: #140003;
  margin: 0;
}

.page-subtitle {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: #140003;
  margin: 0;
  width: fit-content;
  min-width: 100%;
}

.add-button {
  background: #d41e51;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px 26px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #f2abbf;
  transition: all 0.2s ease;
  white-space: pre;
}

.add-button:hover {
  background: #c11a47;
  transform: translateY(-1px);
}

/* Table Container */
.table-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 800px;
  width: 100%;
  max-width: 1230px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 12px 17px;
  box-shadow: -8px -8px 16px 0px inset #ffffff, 8px 8px 16px 0px inset #dfe2e7;
}

/* Table Header */
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 635px;
  font-family: 'Urbanist', sans-serif;
  line-height: 0;
  font-style: normal;
  color: #000000;
  white-space: nowrap;
}

.header-cell {
  font-family: 'Urbanist', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: normal;
  color: #000000;
  white-space: pre;
}

/* Table Body */
.table-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Table Row */
.table-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 40px;
}

.dish-name {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: #000000;
  white-space: pre;
}

.dish-price {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: #000000;
  white-space: pre;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-button {
  background: #f3f4f6;
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
  gap: 10px;
}

.action-button:hover {
  box-shadow: -2px -2px 4px 0px inset #ffffff, 2px 2px 4px 0px inset #acacac;
  transform: translateY(1px);
}

.action-button i {
  font-size: 16px;
  color: #140003;
  width: 16px;
  height: 16px;
}

.edit-button i {
  width: 16px;
  height: 16px;
}

.delete-button i {
  width: 13.75px;
  height: 15px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .piatti-container {
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
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .table-container {
    width: 100%;
    overflow-x: auto;
    height: auto;
    min-height: 400px;
  }
  
  .table-header {
    width: 100%;
    min-width: 500px;
  }
  
  .table-row {
    min-width: 500px;
  }
}

/* Font Loading */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700&display=swap');

/* Ensure UIcons work */
[class*="fi-"] {
  font-family: uicons-solid-rounded, uicons-regular-rounded !important;
}
</style>
