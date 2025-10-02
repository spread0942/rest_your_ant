<template>
  <BaseListView
    page-title="Bevande"
    page-subtitle="Gestisci tutte le bevande del ristorante"
    :items="drinks"
    count-label=""
    view-label="Visualizza dettagli"
    edit-label="Modifica bevanda"
    delete-label="Elimina bevanda"
    create-button-text="Aggiungi Bevanda"
    @create="navigateToCreate"
    @navigate="navigateToDrink"
    @view="viewDrink"
    @edit="editDrink"
    @delete="deleteDrink"
  />
</template>

<script>
import BaseListView from '../components/BaseListView.vue'
import apiConfig from '@/config/api.js'

export default {
  name: 'DrinksList',
  components: {
    BaseListView
  },
  data() {
    return {
      drinks: [],
      loading: false,
    }
  },
  mounted() {
    this.loadDrinks()
  },
  activated() {
    // Reload when component is activated (useful when coming back from create page)
    this.loadDrinks()
  },
  methods: {
    async loadDrinks() {
      try {
        this.loading = true
        
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        const response = await fetch(`${apiConfig.apiEndpoint}/drinks?limit=100&restaurantId=${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Map the drink data for display
          this.drinks = (data.data.drinks || []).map(drink => ({
            ...drink,
            count: 0, // Drinks don't have sub-items like menus have plates
            // Add formatted information
            formattedPrice: `€ ${parseFloat(drink.price || 0).toFixed(2)}`,
            displayInfo: drink.category || 'N/A'
          }))
        } else {
          throw new Error('Failed to fetch drinks')
        }
      } catch (error) {
        console.error('Error to load drinks:', error)
        this.drinks = []
        alert('Errore nel caricamento delle bevande. Riprova.')
      } finally {
        this.loading = false
      }
    },

    navigateToCreate() {
      this.$router.push('/drinks/create')
    },
    
    navigateToDrink(drink) {
      this.$router.push(`/drinks/${drink.id}/edit`)
    },
    
    viewDrink(drink) {
      this.$router.push(`/drinks/${drink.id}/edit`)
    },
    
    editDrink(drink) {
      this.$router.push(`/drinks/${drink.id}/edit`)
    },
    
    async deleteDrink(drink) {
      if (confirm(`Sei sicuro di voler eliminare "${drink.name}"?`)) {
        try {
          const response = await fetch(`${apiConfig.apiEndpoint}/drinks/${drink.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            if (!data.success) {
              throw new Error(data.message || 'Failed to delete drink')
            }
            this.drinks = this.drinks.filter(d => d.id !== drink.id)
          } else {
            throw new Error('Failed to delete drink')
          }
        } catch (error) {
          console.error('Errore nell\'eliminazione della bevanda:', error)
          alert('Errore nell\'eliminazione della bevanda. Riprova.')
        }
      }
    }
  }
}
</script>

<style scoped>
/* No additional styles needed since we use BaseListView */
</style>