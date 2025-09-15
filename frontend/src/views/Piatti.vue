<template>
  <BaseTableView
    :pageTitle="categoryName"
    pageSubtitle="Aggiungi e rimuovi piatti"
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

export default {
  name: 'PiattiView',
  components: {
    BaseTableView
  },
  data() {
    return {
      categoryName: 'Antipasti',
      columns: [
        { label: 'Nome', key: 'name', cellClass: 'name-cell' },
        { label: 'Prezzo', key: 'price' },
        { label: '', key: 'actions', cellClass: 'actions-cell' }
      ],
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
      // Naviga alla pagina per aggiungere un nuovo piatto
      this.$router.push('/piatto/nuovo')
    },
    editDish(dish) {
      console.log('Modifica piatto:', dish)
      // Naviga alla pagina di modifica del piatto
      this.$router.push(`/piatto/${dish.id}/modifica`)
    },
    deleteDish(dish) {
      console.log('Elimina piatto:', dish)
      // TODO: Implementare logica per eliminare il piatto
      if (confirm(`Sei sicuro di voler eliminare "${dish.name}"?`)) {
        this.dishes = this.dishes.filter(d => d.id !== dish.id)
      }
    }
  }
}
</script>

<style scoped>
/* Font Loading */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700&display=swap');
</style>
