<template>
  <BaseListView
    page-title="Piatti"
    page-subtitle="Gestisci tutti i piatti del ristorante"
    :items="plates"
    count-label="prodotti"
    view-label="Visualizza prodotti"
    edit-label="Modifica piatto"
    delete-label="Elimina piatto"
    create-button-text="Aggiungi Piatto"
    @create="navigateToCreate"
    @navigate="navigateToPlate"
    @view="viewPlate"
    @edit="editPlate"
    @delete="deletePlate"
    @restaurant-changed="handleRestaurantChanged"
  />
</template>

<script>
import BaseListView from '../components/BaseListView.vue'
import apiConfig from '@/config/api.js'

export default {
  name: 'PlatesList',
  components: {
    BaseListView
  },
  data() {
    return {
      plates: [],
      loading: false,
      currentRestaurantId: null,
    }
  },
  mounted() {
    this.initializeAndLoadPlates()
  },
  activated() {
    // Reload when component is activated (useful when coming back from create page)
    this.initializeAndLoadPlates()
  },
  methods: {
    initializeAndLoadPlates() {
      const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
      this.currentRestaurantId = selectedRestaurant.id
      this.loadPlates()
    },
    
    handleRestaurantChanged(restaurant) {
      // Only reload if the restaurant actually changed
      if (restaurant.id !== this.currentRestaurantId) {
        this.currentRestaurantId = restaurant.id
        this.loadPlates()
      }
    },
    async loadPlates() {
      try {
        this.loading = true
        
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        const response = await fetch(`${apiConfig.apiEndpoint}/plates?limit=100&restaurantId=${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Map the plate data to include the count of products for display
          this.plates = (data.data.plates || []).map(plate => ({
            ...plate,
            count: plate.products ? plate.products.length : 0,
            // Format price for display
            formattedPrice: `€ ${parseFloat(plate.price || 0).toFixed(2)}`
          }))
        } else {
          throw new Error('Failed to fetch plates')
        }
      } catch (error) {
        console.error('Error to load plates:', error)
        this.plates = []
        alert('Errore nel caricamento dei piatti. Riprova.')
      } finally {
        this.loading = false
      }
    },

    navigateToCreate() {
      this.$router.push('/plates/create')
    },
    
    navigateToPlate(plate) {
      this.$router.push(`/plates/${plate.id}/products`)
    },
    
    viewPlate(plate) {
      this.$router.push(`/plates/${plate.id}/products`)
    },
    
    editPlate(plate) {
      this.$router.push(`/plates/${plate.id}/edit`)
    },
    
    async deletePlate(plate) {
      if (confirm(`Sei sicuro di voler eliminare "${plate.name}"?`)) {
        try {
          const response = await fetch(`${apiConfig.apiEndpoint}/plates/${plate.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            if (!data.success) {
              throw new Error(data.message || 'Failed to delete plate')
            }
            this.plates = this.plates.filter(p => p.id !== plate.id)
          } else {
            throw new Error('Failed to delete plate')
          }
        } catch (error) {
          console.error('Errore nell\'eliminazione del piatto:', error)
          alert('Errore nell\'eliminazione del piatto. Riprova.')
        }
      }
    }
  }
}
</script>

<style scoped>
/* No additional styles needed since we use BaseListView */
</style>