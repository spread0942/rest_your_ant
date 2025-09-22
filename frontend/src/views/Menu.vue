<template>
  <BaseListView
    page-title="Menù"
    page-subtitle="Gestisci i menu da un'unica schermata"
    :items="categories"
    count-label="piatti"
    view-label="Visualizza i piatti"
    edit-label="Modifica categoria"
    delete-label="Elimina categoria"
    create-button-text="Aggiungi Menù"
    @create="createCategory"
    @navigate="navigateToCategory"
    @view="viewCategory"
    @edit="editCategory"
    @delete="deleteCategory"
  />
</template>

<script>
import BaseListView from '../components/BaseListView.vue'

export default {
  name: 'MenuView',
  components: {
    BaseListView
  },
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Antipasti',
          description: 'Stuzzichini e antipasti per iniziare il pasto',
          count: 4,
          category: 'antipasti'
        },
        {
          id: 2,
          name: 'Primi Piatti',
          description: 'Pasta, risotti e zuppe della tradizione',
          count: 19,
          category: 'primi'
        },
        {
          id: 3,
          name: 'Secondi Piatti',
          description: 'Carne, pesce e piatti vegetariani',
          count: 4,
          category: 'secondi'
        }
      ]
    }
  },
  methods: {
    createCategory() {
      console.log('Creazione nuova categoria')
      // TODO: Implementare creazione categoria
    },
    
    navigateToCategory(category) {
      this.$router.push(`/piatti/${category.category || category.name}`)
    },
    
    viewCategory(category) {
      this.$router.push(`/piatti/${category.category || category.name}`)
    },
    
    editCategory(category) {
      if (confirm(`Vuoi modificare la categoria "${category.name}"?`)) {
        console.log('Modifica categoria:', category)
        // TODO: Implementare modifica categoria
      }
    },
    
    deleteCategory(category) {
      if (confirm(`Sei sicuro di voler eliminare la categoria "${category.name}"? Questa azione non può essere annullata.`)) {
        this.categories = this.categories.filter(c => c.id !== category.id)
        console.log('Categoria eliminata:', category)
      }
    }
  }
}
</script>


