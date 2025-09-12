<template>
  <BaseTableView
    :page-title="areaName"
    page-subtitle="Gestisci i tavoli dell'area"
    :data="tables"
    :columns="tableColumns"
    add-button-text="Aggiungi Tavolo"
    edit-label="Modifica tavolo"
    delete-label="Elimina tavolo"
    @add="addTable"
    @edit="editTable"
    @delete="deleteTable"
    @rowClick="navigateToTable"
  />
</template>

<script>
import BaseTableView from '../components/BaseTableView.vue'

export default {
  name: 'Tavoli',
  components: {
    BaseTableView
  },
  data() {
    return {
      tables: [
        {
          id: 1,
          name: 'Tavolo 1',
          capacity: 4,
          status: 'Disponibile',
          qrCode: 'QR001'
        },
        {
          id: 2,
          name: 'Tavolo 2', 
          capacity: 6,
          status: 'Occupato',
          qrCode: 'QR002'
        },
        {
          id: 3,
          name: 'Tavolo 3',
          capacity: 2,
          status: 'Riservato',
          qrCode: 'QR003'
        },
        {
          id: 4,
          name: 'Tavolo 4',
          capacity: 8,
          status: 'Disponibile',
          qrCode: 'QR004'
        },
        {
          id: 5,
          name: 'Tavolo 5',
          capacity: 4,
          status: 'Pulizia',
          qrCode: 'QR005'
        }
      ],
      tableColumns: [
        {
          key: 'name',
          label: 'Nome Tavolo',
          class: 'name-header',
          cellClass: 'name-cell'
        },
        {
          key: 'capacity',
          label: 'Capienza',
          formatter: (value) => `${value} persone`
        },
        {
          key: 'status',
          label: 'Stato',
          formatter: (value) => this.formatStatus(value)
        },
        {
          key: 'qrCode',
          label: 'QR Code'
        },
        {
          key: 'actions',
          label: '',
          class: 'actions-header',
          cellClass: 'actions-cell'
        }
      ]
    }
  },
  computed: {
    areaName() {
      const area = this.$route.params.area
      if (!area) return 'Tavoli'
      
      // Converti il parametro URL in un nome leggibile
      const areaNames = {
        'sala-interna': 'Sala Interna',
        'terrazzo': 'Terrazzo', 
        'sala-esterna': 'Sala Esterna',
        'antipasti': 'Antipasti',
        'primi': 'Primi Piatti',
        'secondi': 'Secondi Piatti'
      }
      
      return areaNames[area] || area.charAt(0).toUpperCase() + area.slice(1)
    }
  },
  methods: {
    formatStatus(status) {
      const statusMap = {
        'Disponibile': '🟢 Disponibile',
        'Occupato': '🔴 Occupato', 
        'Riservato': '🟡 Riservato',
        'Pulizia': '🟠 In Pulizia'
      }
      return statusMap[status] || status
    },
    
    addTable() {
      console.log('Aggiungi nuovo tavolo')
      // TODO: Implementare aggiunta tavolo
      const newTable = {
        id: this.tables.length + 1,
        name: `Tavolo ${this.tables.length + 1}`,
        capacity: 4,
        status: 'Disponibile',
        qrCode: `QR00${this.tables.length + 1}`
      }
      this.tables.push(newTable)
    },
    
    editTable(table) {
      console.log('Modifica tavolo:', table)
      // Naviga alla pagina di modifica del singolo tavolo
      this.navigateToTable(table)
    },
    
    navigateToTable(table) {
      console.log('Navigando al tavolo:', table)
      // Naviga alla pagina del singolo tavolo
      this.$router.push({
        name: 'TavoloSingolo',
        params: { id: `T${table.id.toString().padStart(3, '0')}` }
      })
    },
    
    deleteTable(table) {
      if (confirm(`Sei sicuro di voler eliminare "${table.name}"? Questa azione non può essere annullata.`)) {
        this.tables = this.tables.filter(t => t.id !== table.id)
        console.log('Tavolo eliminato:', table)
      }
    }
  }
}
</script>
