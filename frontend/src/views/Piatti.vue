<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Caricamento piatti...</p>
    </div>
  </div>
  <BaseTableView
    v-else
    :pageTitle="categoryName"
    pageSubtitle="Visualizza e gestisci i piatti di questo menu"
    :data="dishes"
    :columns="columns"
    @add="addDish"
    @edit="editDish"
    @delete="deleteDish"
    @rowClick="editDish"
  />
</template>

<script>
import BaseTableView from '@/components/BaseTableView.vue'
import apiConfig from '@/config/api.js'

export default {
  name: 'PiattiView',
  components: {
    BaseTableView
  },
  data() {
    return {
      categoryName: '',
      loading: false,
      columns: [
        { label: 'Nome', key: 'name', cellClass: 'name-cell', class: 'col-name' },
        { label: 'Descrizione', key: 'description', class: 'col-description' },
        { label: 'Prezzo', key: 'formattedPrice', class: 'col-price' },
        { label: 'Disponibile', key: 'availability', class: 'col-availability' },
        { label: '', key: 'actions', cellClass: 'actions-cell', class: 'col-actions' }
      ],
      dishes: []
    }
  },
  mounted() {
    this.categoryName = this.$route.params.category || 'Menu'
    this.loadDishes()
  },
  watch: {
    '$route'() {
      this.categoryName = this.$route.params.category || 'Menu'
      this.loadDishes()
    }
  },
  methods: {
    async loadDishes() {
      try {
        this.loading = true
        const menuId = this.$route.query.menuId
        
        if (!menuId) {
          console.warn('No menuId provided in query parameters')
          return
        }

        const response = await fetch(`${apiConfig.apiEndpoint}/menus/${menuId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const menu = data.data
          
          console.log('Full API response:', data)
          console.log('Menu object:', menu)
          console.log('Plates array:', menu.plates)
          
          this.categoryName = menu.name || this.categoryName
          
          this.dishes = (menu.plates || []).map(plate => {
            console.log(`Processing plate: ${plate.name}`)
            console.log(`Raw price value:`, plate.price)
            console.log(`Price type:`, typeof plate.price)
            
            const priceValue = plate.price || 0
            const price = parseFloat(priceValue.toString())
            const validPrice = isNaN(price) ? 0 : price
            
            console.log(`Parsed price: ${price}, Valid price: ${validPrice}`)
            
            return {
              ...plate,
              formattedPrice: `€ ${validPrice.toFixed(2)}`,
              availability: plate.isAvailable ? 'Disponibile' : 'Non disponibile'
            }
          })
          
          console.log('Final dishes array:', this.dishes)
        } else {
          throw new Error('Failed to fetch menu details')
        }
      } catch (error) {
        console.error('Error loading dishes:', error)
        this.dishes = []
        alert('Errore nel caricamento dei piatti. Riprova.')
      } finally {
        this.loading = false
      }
    },
    
    addDish() {
      this.$router.push('/piatto/nuovo')
    },
    
    editDish(dish) {
      this.$router.push(`/piatto/${dish.id}/modifica`)
    },
    
    deleteDish(dish) {
      if (confirm(`Sei sicuro di voler eliminare "${dish.name}"?`)) {
        this.dishes = this.dishes.filter(d => d.id !== dish.id)
      }
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #f92561;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

:deep(.col-name) {
  flex: 2;
  min-width: 200px;
}

:deep(.col-description) {
  flex: 3;
  min-width: 250px;
}

:deep(.col-price) {
  flex: 1;
  min-width: 100px;
  text-align: right;
}

:deep(.col-availability) {
  flex: 1;
  min-width: 120px;
  text-align: center;
}

:deep(.col-actions) {
  flex: 0.5;
  min-width: 80px;
  text-align: center;
}

:deep(.name-cell) {
  font-weight: 600;
  color: #140003;
}

:deep(.actions-cell) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
