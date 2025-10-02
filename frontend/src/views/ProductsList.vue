<template>
  <BaseListView
    page-title="Prodotti"
    page-subtitle="Gestisci tutti i prodotti del ristorante"
    :items="products"
    count-label=""
    view-label="Visualizza dettagli"
    edit-label="Modifica prodotto"
    delete-label="Elimina prodotto"
    create-button-text="Aggiungi Prodotto"
    @create="navigateToCreate"
    @navigate="navigateToProduct"
    @view="viewProduct"
    @edit="editProduct"
    @delete="deleteProduct"
  />
</template>

<script>
import BaseListView from '../components/BaseListView.vue'
import apiConfig from '@/config/api.js'

export default {
  name: 'ProductsList',
  components: {
    BaseListView
  },
  data() {
    return {
      products: [],
      loading: false,
    }
  },
  mounted() {
    this.loadProducts()
  },
  activated() {
    // Reload when component is activated (useful when coming back from create page)
    this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        const response = await fetch(`${apiConfig.apiEndpoint}/products?limit=100&restaurantId=${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Map the product data for display
          this.products = (data.data.products || []).map(product => ({
            ...product,
            // Add formatted information
            displayInfo: product.unit ? `${product.category || 'N/A'} - ${product.unit}` : (product.category || 'N/A')
          }))
        } else {
          throw new Error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error to load products:', error)
        this.products = []
        alert('Errore nel caricamento dei prodotti. Riprova.')
      } finally {
        this.loading = false
      }
    },

    navigateToCreate() {
      this.$router.push('/products/create')
    },
    
    navigateToProduct(product) {
      this.$router.push(`/products/${product.id}/edit`)
    },
    
    viewProduct(product) {
      this.$router.push(`/products/${product.id}/edit`)
    },
    
    editProduct(product) {
      this.$router.push(`/products/${product.id}/edit`)
    },
    
    async deleteProduct(product) {
      if (confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
        try {
          const response = await fetch(`${apiConfig.apiEndpoint}/products/${product.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            if (!data.success) {
              throw new Error(data.message || 'Failed to delete product')
            }
            this.products = this.products.filter(p => p.id !== product.id)
          } else {
            throw new Error('Failed to delete product')
          }
        } catch (error) {
          console.error('Errore nell\'eliminazione del prodotto:', error)
          alert('Errore nell\'eliminazione del prodotto. Riprova.')
        }
      }
    }
  }
}
</script>

<style scoped>
/* No additional styles needed since we use BaseListView */
</style>