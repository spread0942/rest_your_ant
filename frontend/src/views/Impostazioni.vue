<template>
  <div class="settings-container">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent @restaurant-changed="handleRestaurantChanged" />
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Impostazioni</h1>
      </div>

      <div class="content-wrapper">
        <!-- Navigation Menu -->
        <div class="nav-menu">
          <div 
            class="nav-item" 
            :class="{ active: activeSection === 'profilo' }"
            @click="activeSection = 'profilo'"
          >
            Profilo
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeSection === 'ristorante' }"
            @click="activeSection = 'ristorante'"
          >
            Ristorante
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeSection === 'stampanti' }"
            @click="activeSection = 'stampanti'"
          >
            Stampanti Connesse
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeSection === 'api' }"
            @click="activeSection = 'api'"
          >
            API Key
          </div>
        </div>

        <!-- Profilo Section -->
        <div v-if="activeSection === 'profilo'" class="section">
          <h2 class="section-title">Profilo</h2>
          <div class="section-content">
            <!-- Profile Image -->
            <div class="profile-section">
              <div class="profile-image">
                <div class="image-placeholder">
                  <span class="user-icon">👤</span>
                </div>
                <button class="upload-btn">Carica</button>
              </div>
              
              <!-- Profile Form -->
              <div class="form-section">
                <div class="input-group">
                  <label>Nome</label>
                  <input 
                    type="text" 
                    v-model="profile.nome" 
                    class="input-field"
                    placeholder="Inserisci il nome"
                  />
                </div>
                
                <div class="input-group">
                  <label>Cognome</label>
                  <input 
                    type="text" 
                    v-model="profile.cognome" 
                    class="input-field"
                    placeholder="Inserisci il cognome"
                  />
                </div>
                
                <div class="input-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    v-model="profile.email" 
                    class="input-field"
                    placeholder="Inserisci l'email"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ristorante Section -->
        <div v-if="activeSection === 'ristorante'" class="section">
          <h2 class="section-title">Ristorante</h2>
          <div class="section-content">
            <!-- Restaurant Image -->
            <div class="profile-section">
              <div class="profile-image">
                <div class="image-placeholder restaurant-image">
                  <span class="restaurant-icon">🏪</span>
                </div>
                <button class="upload-btn">Carica</button>
              </div>
              
              <!-- Restaurant Form -->
              <div class="form-section">
                <div class="input-group">
                  <label>Nome Ristorante</label>
                  <input 
                    type="text" 
                    v-model="restaurant.nome" 
                    class="input-field"
                    placeholder="Inserisci il nome del ristorante"
                  />
                </div>
                
                <div class="input-group">
                  <label>Indirizzo</label>
                  <input 
                    type="text" 
                    v-model="restaurant.indirizzo" 
                    class="input-field"
                    placeholder="Inserisci l'indirizzo"
                  />
                </div>
                
                <div class="input-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    v-model="restaurant.email" 
                    class="input-field"
                    placeholder="Inserisci l'email del ristorante"
                  />
                </div>
                
                <div class="input-group">
                  <label>Telefono</label>
                  <input 
                    type="tel" 
                    v-model="restaurant.telefono" 
                    class="input-field"
                    placeholder="Inserisci il numero di telefono"
                  />
                </div>
                
                <div class="input-group">
                  <label>ID Ristorante</label>
                  <input 
                    type="text" 
                    v-model="restaurant.id" 
                    class="input-field"
                    placeholder="ID univoco del ristorante"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stampanti Section -->
        <div v-if="activeSection === 'stampanti'" class="section">
          <h2 class="section-title">Stampanti Connesse</h2>
          <div class="section-content">
            <div class="printer-list">
              <div class="printer-item" v-for="printer in printers" :key="printer.id">
                <div class="printer-info">
                  <span class="printer-icon">🖨️</span>
                  <div class="printer-details">
                    <h3>{{ printer.name }}</h3>
                    <p>{{ printer.type }} - {{ printer.status }}</p>
                  </div>
                </div>
                <div class="printer-actions">
                  <button class="action-btn test-btn" @click="testPrinter(printer.id)">Test</button>
                  <button class="action-btn remove-btn" @click="removePrinter(printer.id)">Rimuovi</button>
                </div>
              </div>
            </div>
            <button class="add-printer-btn" @click="showAddPrinter = true">Aggiungi Stampante</button>
          </div>
        </div>

        <!-- API Section -->
        <div v-if="activeSection === 'api'" class="section">
          <h2 class="section-title">API Key</h2>
          <div class="section-content">
            <div class="api-section">
              <div class="input-group">
                <label>Chiave API</label>
                <div class="api-key-field">
                  <input 
                    type="text" 
                    :value="maskedApiKey" 
                    class="input-field"
                    readonly
                  />
                  <button class="action-btn copy-btn" @click="copyApiKey">📋</button>
                </div>
              </div>
              <button class="regenerate-btn" @click="regenerateApiKey">Rigenera Chiave API</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../components/SidebarComponent.vue'

export default {
  name: 'ImpostazioniView',
  components: {
    SidebarComponent
  },
  data() {
    return {
      activeSection: 'profilo',
      profile: {
        nome: '',
        cognome: '',
        email: ''
      },
      restaurant: {
        nome: '',
        indirizzo: '',
        email: '',
        telefono: '',
        id: 'RST-2024-001'
      },
      printers: [
        {
          id: 1,
          name: 'Stampante Cucina',
          type: 'Epson TM-T20III',
          status: 'Connessa'
        },
        {
          id: 2,
          name: 'Stampante Bar',
          type: 'Star TSP143III',
          status: 'Offline'
        }
      ],
      apiKey: 'pk_live_51HyveNF7cVcRMWl2KgIh8w3p5QI1qYz7n8b9m4k6l3j2h5g8f9d0s1a',
      showAddPrinter: false
    }
  },
  computed: {
    maskedApiKey() {
      if (!this.apiKey) return ''
      return this.apiKey.substring(0, 12) + '••••••••••••••••••••••••'
    }
  },
  methods: {
    handleRestaurantChanged(restaurant) {
      // Handle restaurant change if needed
      console.log('Restaurant changed in Impostazioni:', restaurant)
    },
    testPrinter(printerId) {
      console.log('Testing printer:', printerId)
      // Simulate printer test
      this.$toast?.success('Test di stampa inviato con successo')
    },
    removePrinter(printerId) {
      if (confirm('Sei sicuro di voler rimuovere questa stampante?')) {
        this.printers = this.printers.filter(p => p.id !== printerId)
        this.$toast?.success('Stampante rimossa con successo')
      }
    },
    copyApiKey() {
      navigator.clipboard.writeText(this.apiKey).then(() => {
        this.$toast?.success('Chiave API copiata negli appunti')
      })
    },
    regenerateApiKey() {
      if (confirm('Sei sicuro di voler rigenerare la chiave API? La chiave attuale non funzionerà più.')) {
        // Simulate API key regeneration
        this.apiKey = 'pk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        this.$toast?.success('Nuova chiave API generata con successo')
      }
    }
  }
}
</script>

<style scoped>
.settings-container {
  width: 100%;
  height: 100vh;
  background: #f3f4f6;
  display: flex;
  font-family: 'Urbanist', sans-serif;
  padding: 40px 20px;
  gap: 26px;
}

.sidebar-wrapper {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 32px;
}

.header {
  margin-bottom: 40px;
}

.title {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.content-wrapper {
  display: flex;
  gap: 48px;
}

@media (max-width: 768px) {
  .settings-container {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
  
  .sidebar-wrapper {
    width: 100%;
  }
  
  .main-content {
    padding: 0;
    width: 100%;
  }
  
  .content-wrapper {
    flex-direction: column;
    gap: 24px;
  }
}

/* Navigation Menu */
.nav-menu {
  width: 147px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .nav-menu {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    gap: 12px;
  }
}

.nav-item {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #140003;
  cursor: pointer;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-item:hover {
  color: #f92561;
}

.nav-item.active {
  color: #f92561;
  border-bottom-color: #f92561;
}

/* Section */
.section {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 30px;
  font-weight: 400;
  color: #140003;
  margin: 0 0 32px 0;
  line-height: normal;
}

.section-content {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  padding: 32px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
}

/* Profile Section */
.profile-section {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .profile-section {
    flex-direction: column;
    gap: 24px;
  }
}

.profile-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.image-placeholder {
  width: 162px;
  height: 162px;
  border-radius: 100px;
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -8px -8px 16px 0px #ffffff inset, 8px 8px 16px 0px #dfe2e7 inset;
}

.restaurant-image {
  border-radius: 50%;
}

.user-icon,
.restaurant-icon {
  font-size: 48px;
  opacity: 0.6;
}

.upload-btn {
  background: #f0f0f0;
  color: #140003;
  border: none;
  border-radius: 8px;
  padding: 5px 26px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #c5c5c5;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: #e9ecef;
}

/* Form Section */
.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #140003;
}

.input-field {
  height: 45px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  color: #140003;
  box-shadow: -8px -8px 16px 0px #ffffff inset, 8px 8px 16px 0px #dfe2e7 inset;
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  box-shadow: -8px -8px 16px 0px #ffffff inset, 8px 8px 16px 0px #dfe2e7 inset, 0 0 0 2px #f92561;
}

.input-field:readonly {
  background: #e9ecef;
  cursor: not-allowed;
}

/* Printer Section */
.printer-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.printer-item {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #dfe2e7;
}

.printer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.printer-icon {
  font-size: 24px;
}

.printer-details h3 {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #140003;
  margin: 0 0 4px 0;
}

.printer-details p {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.printer-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.test-btn {
  background: #28a745;
  color: white;
}

.test-btn:hover {
  background: #218838;
}

.remove-btn {
  background: #dc3545;
  color: white;
}

.remove-btn:hover {
  background: #c82333;
}

.add-printer-btn {
  background: #f92561;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-printer-btn:hover {
  background: #e91e5a;
}

/* API Section */
.api-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.api-key-field {
  display: flex;
  gap: 8px;
}

.api-key-field .input-field {
  flex: 1;
}

.copy-btn {
  background: #f0f0f0;
  color: #140003;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #c5c5c5;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #e9ecef;
}

.regenerate-btn {
  background: #ffc107;
  color: #140003;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.regenerate-btn:hover {
  background: #e0a800;
}
</style>
