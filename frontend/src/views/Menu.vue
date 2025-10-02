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
      menus: [
        {
          id: 1,
          name: 'Antipasti',
          description: 'Stuzzichini e antipasti per iniziare il pasto',
          isActive: true,
          category: 'antipasti'
        },
        {
          id: 2,
          name: 'Primi Piatti',
          description: 'Pasta, risotti e zuppe della tradizione',
          isActive: true,
          category: 'primi'
        },
        {
          id: 3,
          name: 'Secondi Piatti',
          description: 'Carne, pesce e piatti vegetariani',
          isActive: true,
          category: 'secondi'
        }
      ]
    }
  },
  mounted() {
    this.loadMenus()
  },
  activated() {
    // Reload when component is activated (useful when coming back from create page)
    this.loadMenus()
  },
  methods: {
    async loadMenus() {
      try {
        this.loading = true
        
        const response = await fetch(`${apiConfig.apiEndpoint}/menus`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
        if (response.ok) {
          const data = await response.json();
          this.menus = data.data.menus || [];
        } else {
          throw new Error('Failed to fetch menus');
        }
      } catch (error) {
        console.error('Error to load menus:', error)
        this.menus = []
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
    
    navigateToMenu(category) {
      this.$router.push(`/piatti/${category.category || category.name}`)
    },
    
    viewMenu(category) {
      this.$router.push(`/piatti/${category.category || category.name}`)
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


