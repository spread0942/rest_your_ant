<template>
  <BaseListView
    page-title="Zone Tavoli"
    page-subtitle="Gestisci le aree tavoli da un'unica schermata"
    :items="areas"
    count-label="tavoli"
    view-label="Visualizza tavoli"
    edit-label="Modifica area"
    delete-label="Elimina area"
    create-button-text="Aggiungi Area"
    @create="createArea"
    @navigate="navigateToArea"
    @view="viewArea"
    @edit="editArea"
    @delete="deleteArea"
  />
</template>

<script>
import BaseListView from '../components/BaseListView.vue'

export default {
  name: 'AreeTavoli',
  components: {
    BaseListView
  },
  data() {
    return {
      areas: [
        {
          id: 1,
          name: 'Sala Interna',
          count: 4,
          area: 'sala-interna'
        },
        {
          id: 2,
          name: 'Terrazzo',
          count: 19,
          area: 'terrazzo'
        },
        {
          id: 3,
          name: 'Sala Esterna',
          count: 4,
          area: 'sala-esterna'
        }
      ]
    }
  },
  methods: {
    createArea() {
      console.log('Creazione nuova area tavoli')
      // TODO: Implementare creazione area
    },
    
    navigateToArea(area) {
      this.$router.push(`/tavoli/${area.area || area.name}`)
    },
    
    viewArea(area) {
      this.$router.push(`/tavoli/${area.area || area.name}`)
    },
    
    editArea(area) {
      if (confirm(`Vuoi modificare l'area "${area.name}"?`)) {
        console.log('Modifica area:', area)
        // TODO: Implementare modifica area
      }
    },
    
    deleteArea(area) {
      if (confirm(`Sei sicuro di voler eliminare l'area "${area.name}"? Questa azione non può essere annullata.`)) {
        this.areas = this.areas.filter(a => a.id !== area.id)
        console.log('Area eliminata:', area)
      }
    }
  }
}
</script>
