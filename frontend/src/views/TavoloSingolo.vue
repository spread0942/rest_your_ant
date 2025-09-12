<template>
  <div class="tavolo-singolo-container">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent 
        :selectedRestaurant="selectedRestaurant"
        :isMobile="false"
        @logout="handleLogout"
        @restaurant-changed="handleRestaurantChanged" 
      />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="page-title">Modifica {{ tableData.name }}</h1>
      </div>

      <!-- Content Layout -->
      <div class="content-layout">
        <!-- QR Code Section -->
        <div class="qr-section">
          <h3 class="qr-title">QR Code</h3>
          <div class="qr-container">
            <div class="qr-code">
              <!-- QR Code placeholder - sostituire con un generatore QR reale -->
              <div class="qr-pattern">
                <div class="qr-grid">
                  <div class="qr-square big top-left"></div>
                  <div class="qr-square big top-right"></div>
                  <div class="qr-square big bottom-left"></div>
                  <div class="qr-dots">
                    <div v-for="n in 121" :key="n" class="qr-dot" :class="{ 'filled': getRandomPattern(n) }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="download-button" @click="downloadQRCode">
            <span>Scarica il QR Code</span>
            <span class="download-icon">📥</span>
          </button>
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <div class="form-container">
            <!-- Nome Tavolo -->
            <div class="form-group">
              <label class="form-label">Nome Tavolo</label>
              <input 
                v-model="tableData.name"
                type="text" 
                class="form-input"
                placeholder="Inserisci nome tavolo"
              />
            </div>

            <!-- Descrizione -->
            <div class="form-group">
              <label class="form-label">Descrizione</label>
              <input 
                v-model="tableData.description"
                type="text" 
                class="form-input"
                placeholder="Inserisci descrizione"
              />
            </div>

            <!-- ID Tavolo -->
            <div class="form-group">
              <label class="form-label">ID Tavolo</label>
              <input 
                v-model="tableData.id"
                type="text" 
                class="form-input"
                placeholder="Inserisci ID tavolo"
              />
            </div>

            <!-- URL tavolo -->
            <div class="form-group">
              <label class="form-label">URL tavolo</label>
              <input 
                v-model="tableData.url"
                type="text" 
                class="form-input"
                placeholder="Inserisci URL tavolo"
              />
            </div>
          </div>

          <!-- Save Button -->
          <div class="save-section">
                      <button class="save-button" @click="saveTable">
            Salva
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/SidebarComponent.vue'

export default {
  name: 'TavoloSingoloView',
  components: {
    SidebarComponent
  },
  data() {
    return {
      selectedRestaurant: {
        name: 'Fabbrica in Pedavena'
      },
      tableData: {
        id: 'T001',
        name: 'Tavolo 1',
        description: 'Tavolo per 4 persone vicino alla finestra',
        url: 'https://app.perfectmenu.com/table/T001',
        area: 'Sala Interna',
        capacity: 4,
        status: 'libero'
      }
    }
  },
  mounted() {
    // Get table ID from route params
    const tableId = this.$route.params.id
    if (tableId) {
      this.loadTableData(tableId)
    }
  },
  methods: {
    handleRestaurantChanged(restaurant) {
      this.selectedRestaurant = restaurant
      console.log('Restaurant changed in TavoloSingolo:', restaurant)
    },
    loadTableData(tableId) {
      // TODO: Implementare caricamento dati tavolo da API
      console.log('Caricamento dati tavolo:', tableId)
      
      // Simulated data based on table ID
      this.tableData = {
        id: tableId,
        name: `Tavolo ${tableId.replace('T', '')}`,
        description: 'Tavolo per 4 persone',
        url: `https://app.perfectmenu.com/table/${tableId}`,
        area: this.$route.params.area || 'Sala Interna',
        capacity: 4,
        status: 'libero'
      }
    },
    saveTable() {
      console.log('Salvataggio tavolo:', this.tableData)
      // TODO: Implementare salvataggio dati tavolo su API
      
      // Show success message and navigate back
      alert('Tavolo salvato con successo!')
      this.$router.go(-1) // Go back to previous page
    },
    downloadQRCode() {
      console.log('Download QR Code per tavolo:', this.tableData.id)
      // TODO: Implementare download del QR Code
      alert('Funzione download QR Code in sviluppo')
    },
    getRandomPattern(n) {
      // Generate a consistent random pattern for QR code simulation
      const seed = n * 7 + 13
      return (seed % 3) === 0
    },
    handleLogout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('selectedRestaurant')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Main Container */
.tavolo-singolo-container {
  width: 100%;
  height: 100vh;
  background: #f3f4f6;
  display: flex;
  font-family: 'Urbanist', sans-serif;
  padding: 40px 20px;
  gap: 26px;
}

/* Sidebar */
.sidebar-wrapper {
  flex-shrink: 0;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 32px;
}

/* Header Section */
.header-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.page-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  line-height: normal;
  color: #140003;
  margin: 0;
}

/* Content Layout */
.content-layout {
  display: flex;
  gap: 50px;
  width: 100%;
  align-items: flex-start;
}

/* QR Code Section */
.qr-section {
  display: flex;
  flex-direction: column;
  gap: 27px;
  width: 308px;
  flex-shrink: 0;
}

.qr-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: #000000;
  margin: 0;
}

.qr-container {
  width: 308px;
  height: 278px;
  background: #f3f4f6;
  border-radius: 8px;
  box-shadow: -8px -8px 16px 0px inset #ffffff, 8px 8px 16px 0px inset #dfe2e7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 27px;
}

.qr-code {
  width: 224px;
  height: 224px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* QR Code Pattern Simulation */
.qr-pattern {
  width: 200px;
  height: 200px;
  position: relative;
  background: #ffffff;
}

.qr-grid {
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(11, 1fr);
  gap: 2px;
}

.qr-square {
  background: #000000;
  border-radius: 2px;
}

.qr-square.big {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid #000000;
  background: #ffffff;
}

.qr-square.big::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #000000;
  border-radius: 1px;
}

.qr-square.top-left {
  top: 10px;
  left: 10px;
}

.qr-square.top-right {
  top: 10px;
  right: 10px;
}

.qr-square.bottom-left {
  bottom: 10px;
  left: 10px;
}

.qr-dots {
  position: absolute;
  top: 60px;
  left: 60px;
  right: 60px;
  bottom: 60px;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: repeat(11, 1fr);
  gap: 1px;
}

.qr-dot {
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 1px;
}

.qr-dot.filled {
  background: #000000;
}

.download-button {
  background: none;
  border: none;
  color: #000000;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0;
  transition: all 0.2s ease;
}

.download-button:hover {
  opacity: 0.7;
}

.download-icon {
  font-size: 18px;
  transform: rotate(270deg);
}

/* Form Section */
.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 396px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: #000000;
  margin: 0;
}

.form-input {
  width: 100%;
  height: 45px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  box-shadow: -8px -8px 16px 0px inset #ffffff, 8px 8px 16px 0px inset #dfe2e7;
  padding: 0 16px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  box-shadow: -4px -4px 8px 0px inset #ffffff, 4px 4px 8px 0px inset #dfe2e7;
}

.form-input::placeholder {
  color: #a0a0a0;
}

/* Save Section */
.save-section {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.save-button {
  background: #d41e51;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 5px 26px;
  height: 30px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #f2abbf;
  transition: all 0.2s ease;
  min-width: 107px;
  z-index: 1001;
}

.save-button:hover {
  background: #c11a47;
  transform: translateY(-1px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .tavolo-singolo-container {
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
  
  .page-title {
    font-size: 32px;
  }
  
  .content-layout {
    flex-direction: column;
    gap: 30px;
  }
  
  .qr-section {
    width: 100%;
    max-width: 308px;
    margin: 0 auto;
  }
  
  .form-section {
    max-width: 100%;
  }
}

/* Font Loading */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700&display=swap');
</style>
