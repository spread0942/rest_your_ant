<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Caricamento prodotti...</p>
    </div>
  </div>
  <BaseTableView
    v-else
    :pageTitle="plateName"
    pageSubtitle="Visualizza e gestisci i prodotti di questo piatto"
    :data="products"
    :columns="columns"
    @add="addProduct"
    @edit="editProduct"
    @delete="deleteProduct"
    @rowClick="editProduct"
  />
</template>

<script>
import BaseTableView from '@/components/BaseTableView.vue'
import apiConfig from '@/config/api.js'

export default {
  name: 'PlateProducts',
  components: {
    BaseTableView
  },
  data() {
    return {
      plateName: '',
      loading: false,
      columns: [
        { label: 'Nome', key: 'name', cellClass: 'name-cell', class: 'col-name' },
        { label: 'Descrizione', key: 'description', class: 'col-description' },
        { label: 'Categoria', key: 'category', class: 'col-category' },
        { label: 'Unità', key: 'unit', class: 'col-unit' },
        { label: '', key: 'actions', cellClass: 'actions-cell', class: 'col-actions' }
      ],
      products: []
    }
  },
  mounted() {
    this.loadProducts()
  },
  watch: {
    '$route'() {
      this.loadProducts()
    }
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        const plateId = this.$route.params.id
        
        if (!plateId) {
          console.warn('No plateId provided in route parameters')
          return
        }

        console.log('Fetching plate with ID:', plateId)

        const response = await fetch(`${apiConfig.apiEndpoint}/plates/${plateId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const plate = data.data
          
          console.log('Plate data received:', plate)
          
          this.plateName = plate.name || 'Piatto'
          this.products = plate.products || []
          
          console.log('Processed products:', this.products)
        } else {
          throw new Error('Failed to fetch plate details')
        }
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
        alert('Errore nel caricamento dei prodotti. Riprova.')
      } finally {
        this.loading = false
      }
    },
    
    addProduct() {
      // Navigate to create new product
      this.$router.push('/products/create')
    },
    
    editProduct(product) {
      // Navigate to edit product
      this.$router.push(`/products/${product.id}/edit`)
    },
    
    deleteProduct(product) {
      if (confirm(`Sei sicuro di voler rimuovere "${product.name}" da questo piatto?`)) {
        // This would require an API call to remove the product from the plate
        // For now, just remove from local state
        this.products = this.products.filter(p => p.id !== product.id)
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700&display=swap');

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-family: 'Urbanist', sans-serif;
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

:deep(.col-category) {
  flex: 1;
  min-width: 120px;
  text-align: center;
}

:deep(.col-unit) {
  flex: 1;
  min-width: 100px;
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