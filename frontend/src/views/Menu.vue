<template>
  <BaseListView
    page-title="Menù"
    page-subtitle="Gestisci i menu da un'unica schermata"
    :items="menus"
    count-label="piatti"
    view-label="Visualizza i piatti"
    edit-label="Modifica categoria"
    delete-label="Elimina categoria"
    create-button-text="Aggiungi Menù"
    @create="navigateToCreate"
    @navigate="navigateToMenu"
    @view="viewMenu"
    @edit="editMenu"
    @delete="deleteMenu"
    @restaurant-changed="handleRestaurantChanged"
  />
</template>

<script>
import BaseListView from '../components/BaseListView.vue'
import apiConfig from '@/config/api.js'

export default {
  name: 'MenuView',
  components: {
    BaseListView
  },
  data() {
    return {
      menus: [],
      loading: false,
      currentRestaurantId: null,
    }
  },
  mounted() {
    this.initializeAndLoadMenus()
  },
  activated() {
    // Reload when component is activated (useful when coming back from create page)
    this.initializeAndLoadMenus()
  },
  methods: {
    initializeAndLoadMenus() {
      const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
      this.currentRestaurantId = selectedRestaurant.id
      this.loadMenus()
    },
    
    handleRestaurantChanged(restaurant) {
      // Only reload if the restaurant actually changed
      if (restaurant.id !== this.currentRestaurantId) {
        this.currentRestaurantId = restaurant.id
        this.loadMenus()
      }
    },
    async loadMenus() {
      try {
        this.loading = true
        
        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')
        const restaurantId = selectedRestaurant.id
        
        if (!restaurantId) {
          throw new Error('No restaurant selected')
        }
        
        const response = await fetch(`${apiConfig.apiEndpoint}/menus?limit=100&restaurantId=${restaurantId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          // Map the menu data to include the count of plates for display
          this.menus = (data.data.menus || []).map(menu => ({
            ...menu,
            count: menu.plates ? menu.plates.length : 0
          }))
        } else {
          throw new Error('Failed to fetch menus')
        }
      } catch (error) {
        console.error('Error to load menus:', error)
        this.menus = []
        alert('Errore nel caricamento dei menu. Riprova.')
      } finally {
        this.loading = false
      }
    },

    navigateToCreate() {
      this.$router.push('/menu/create')
    },

    generateSlug(name) {
      return name
        .toLowerCase()
        .trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    },
    
    navigateToMenu(menu) {
      this.$router.push(`/piatti/${menu.category || menu.name}?menuId=${menu.id}`)
    },
    
    viewMenu(menu) {
      this.$router.push(`/piatti/${menu.category || menu.name}?menuId=${menu.id}`)
    },
    
    editMenu(menu) {
      this.$router.push(`/menu/${menu.id}/edit`)
    },
    
    async deleteMenu(menu) {
      if (confirm(`Sei sicuro di voler eliminare "${menu.name}"?`)) {
        try {
          const response = await fetch(`${apiConfig.apiEndpoint}/menus/${menu.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (!data.success) {
              throw new Error(data.message || 'Failed to delete menu');
            }
            this.menus = this.menus.filter(m => m.id !== menu.id);
          } else {
            throw new Error('Failed to delete menu');
          }
        } catch (error) {
          console.error('Errore nell\'eliminazione del menu:', error);
          alert('Errore nell\'eliminazione del menu. Riprova.');
        }
      }
    }
  }
}
</script>

<style scoped>
/* No additional styles needed since we removed the modal */
</style>


