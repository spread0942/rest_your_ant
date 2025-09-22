<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent @restaurant-changed="handleRestaurantChange" />
    </div>
    
    <div class="main-content">
      <!-- Header Section -->
      <div class="header">
        <div class="header-text">
          <h1>{{ isNewDish ? 'Nuovo Piatto' : (dishName || 'Modifica Piatto') }}</h1>
          <p>{{ isNewDish ? 'Crea un nuovo piatto per il menu' : 'Modifica le caratteristiche del piatto' }}</p>
        </div>
        <div class="header-buttons">
          <button class="cancel-button" @click="cancelEdit">Annulla</button>
          <button class="save-button" @click="saveDish">
            {{ isNewDish ? 'Crea Piatto' : 'Salva Modifiche' }}
          </button>
        </div>
      </div>

      <div class="content-grid">
        <!-- Left Column - Form -->
        <div class="form-column">
          <!-- Informazioni Base -->
          <div class="form-section">
            <h2>Informazioni base</h2>
            <div class="form-content">
              <div class="form-row">
                <div class="form-field wide">
                  <label>Nome Piatto</label>
                  <input 
                    type="text" 
                    v-model="form.name" 
                    class="form-input"
                    placeholder="Nome del piatto"
                  />
                </div>
                <div class="form-field narrow">
                  <label>Prezzo €</label>
                  <input 
                    type="number" 
                    v-model="form.price" 
                    class="form-input"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div class="form-field">
                <label>Descrizione del piatto</label>
                <textarea 
                  v-model="form.description" 
                  class="form-textarea"
                  placeholder="Descrizione del piatto..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Ingredienti -->
          <div class="form-section">
            <h2>Ingredienti</h2>
            <div class="form-content">
              <div class="ingredients-list">
                <div 
                  v-for="(ingredient, index) in form.ingredients" 
                  :key="index"
                  class="ingredient-tag"
                >
                  <span>{{ ingredient }}</span>
                  <button @click="removeIngredient(index)" class="remove-btn">×</button>
                </div>
              </div>
              <div class="add-input">
                <input 
                  type="text" 
                  v-model="newIngredient"
                  class="add-field"
                  placeholder="Aggiungi un ingrediente..."
                  @keyup.enter="addIngredient"
                />
                <button @click="addIngredient" class="add-btn">+</button>
              </div>
            </div>
          </div>

          <!-- Allergeni -->
          <div class="form-section">
            <h2>Allergeni</h2>
            <div class="form-content">
              <div class="allergens-list">
                <div 
                  v-for="(allergen, index) in form.allergens" 
                  :key="index"
                  class="allergen-tag"
                >
                  <span>{{ allergen }}</span>
                  <button @click="removeAllergen(index)" class="remove-btn">×</button>
                </div>
              </div>
              <div class="add-input">
                <input 
                  type="text" 
                  v-model="newAllergen"
                  class="add-field"
                  placeholder="Aggiungi un allergene..."
                  @keyup.enter="addAllergen"
                />
                <button @click="addAllergen" class="add-btn">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Status & Images -->
        <div class="sidebar-column">
          <!-- Stato -->
          <div class="form-section">
            <h2>Stato</h2>
            <div class="status-section">
              <div class="status-info">
                <h3>Disponibile</h3>
                <p>Il piatto è visibile online e può essere ordinato</p>
              </div>
              <div class="toggle-switch">
                <input 
                  type="checkbox" 
                  id="available" 
                  v-model="form.available"
                  class="toggle-input"
                />
                <label for="available" class="toggle-label"></label>
              </div>
            </div>
            <div class="status-divider"></div>
            <div class="status-text">Disponibile</div>
            
            <h3 class="menu-title">Menù</h3>
            <div class="menu-tags">
              <div 
                v-for="(menu, index) in form.menus" 
                :key="index"
                class="menu-tag"
              >
                <span>{{ menu }}</span>
                <button @click="removeMenu(index)" class="remove-btn">×</button>
              </div>
            </div>
            <div class="add-input">
              <input 
                type="text" 
                v-model="newMenu"
                class="add-field"
                placeholder="Aggiungi ad un menù..."
                @keyup.enter="addMenu"
              />
              <button @click="addMenu" class="add-btn">+</button>
            </div>
          </div>

          <!-- Immagine Principale -->
          <div class="form-section">
            <h2>Immagine principale</h2>
            <div class="image-upload">
              <div class="image-preview" @click="triggerImageUpload">
                <div v-if="!form.mainImage" class="no-image">
                  <svg width="67" height="67" viewBox="0 0 67 67" fill="none">
                    <path d="M33.5 8.375C19.32 8.375 8.375 19.32 8.375 33.5C8.375 47.68 19.32 58.625 33.5 58.625C47.68 58.625 58.625 47.68 58.625 33.5C58.625 19.32 47.68 8.375 33.5 8.375ZM37.625 37.625H29.375V29.375H37.625V37.625Z" fill="#979EA5"/>
                  </svg>
                  <span>Nessuna immagine</span>
                </div>
                <img v-else :src="form.mainImage" alt="Immagine principale" />
              </div>
              <input 
                type="file" 
                ref="mainImageInput"
                @change="handleMainImageUpload"
                accept="image/*"
                style="display: none"
              />
              <button @click="triggerImageUpload" class="upload-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Carica Immagine
              </button>
            </div>
          </div>

          <!-- Galleria -->
          <div class="form-section">
            <h2>Galleria</h2>
            <div class="image-upload">
              <div class="image-preview gallery-preview" @click="triggerGalleryUpload">
                <div v-if="form.gallery.length === 0" class="no-image">
                  <svg width="67" height="67" viewBox="0 0 67 67" fill="none">
                    <path d="M33.5 8.375C19.32 8.375 8.375 19.32 8.375 33.5C8.375 47.68 19.32 58.625 33.5 58.625C47.68 58.625 58.625 47.68 58.625 33.5C58.625 19.32 47.68 8.375 33.5 8.375ZM37.625 37.625H29.375V29.375H37.625V37.625Z" fill="#979EA5"/>
                  </svg>
                  <span>Nessuna immagine</span>
                </div>
                <div v-else class="gallery-grid">
                  <img 
                    v-for="(image, index) in form.gallery" 
                    :key="index"
                    :src="image" 
                    alt="Galleria" 
                    @click.stop="removeGalleryImage(index)"
                  />
                </div>
              </div>
              <input 
                type="file" 
                ref="galleryInput"
                @change="handleGalleryUpload"
                accept="image/*"
                multiple
                style="display: none"
              />
              <button @click="triggerGalleryUpload" class="upload-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Carica Immagini
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/SidebarComponent.vue'

export default {
  name: 'ModificaPiatto',
  components: {
    SidebarComponent
  },
  data() {
    return {
      dishId: null,
      isNewDish: false,
      dishName: '',
      form: {
        name: '',
        price: 0,
        description: '',
        ingredients: [],
        allergens: [],
        menus: [],
        available: true,
        mainImage: null,
        gallery: []
      },
      newIngredient: '',
      newAllergen: '',
      newMenu: ''
    }
  },
  mounted() {
    this.dishId = this.$route.params.id
    this.isNewDish = this.$route.path === '/piatto/nuovo'
    this.loadDishData()
  },
  methods: {
    handleRestaurantChange() {
      // Handle restaurant change if needed
      console.log('Restaurant changed')
    },
    
    loadDishData() {
      // In a real app, load data from API
      // For now, use sample data based on route params
      if (this.dishId) {
        // TODO: Load actual dish data from API
        console.log('Loading dish data for ID:', this.dishId)
      }
    },

    addIngredient() {
      if (this.newIngredient.trim()) {
        this.form.ingredients.push(this.newIngredient.trim())
        this.newIngredient = ''
      }
    },

    removeIngredient(index) {
      this.form.ingredients.splice(index, 1)
    },

    addAllergen() {
      if (this.newAllergen.trim()) {
        this.form.allergens.push(this.newAllergen.trim())
        this.newAllergen = ''
      }
    },

    removeAllergen(index) {
      this.form.allergens.splice(index, 1)
    },

    addMenu() {
      if (this.newMenu.trim()) {
        this.form.menus.push(this.newMenu.trim())
        this.newMenu = ''
      }
    },

    removeMenu(index) {
      this.form.menus.splice(index, 1)
    },

    triggerImageUpload() {
      this.$refs.mainImageInput.click()
    },

    handleMainImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.mainImage = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    triggerGalleryUpload() {
      this.$refs.galleryInput.click()
    },

    handleGalleryUpload(event) {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.gallery.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    },

    removeGalleryImage(index) {
      this.form.gallery.splice(index, 1)
    },

    saveDish() {
      // TODO: Implement save logic
      console.log('Saving dish:', this.form)
      
      // Show success message and redirect
      alert('Piatto salvato con successo!')
      this.$router.push('/piatti/antipasti')
    },

    cancelEdit() {
      // Confirm before leaving
      if (confirm('Sei sicuro di voler annullare le modifiche?')) {
        this.$router.push('/piatti/antipasti')
      }
    }
  }
}
</script>

<style scoped>
/* Font Loading */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap');

.main-layout {
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

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 32px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-text h1 {
  font-size: 48px;
  font-weight: 400;
  line-height: 1;
  color: #140003;
  margin: 0;
  margin-bottom: 8px;
}

.header-text p {
  font-size: 16px;
  color: #140003;
  margin: 0;
}

.header-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.cancel-button {
  background: #f3f4f6;
  color: #140003;
  border: none;
  padding: 5px 26px;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  cursor: pointer;
  height: 30px;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
  z-index: 1001;
}

.save-button {
  background: #d41e51;
  color: #f3f4f6;
  border: none;
  padding: 5px 26px;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  cursor: pointer;
  height: 30px;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #f2abbf;
  z-index: 1001;
}

.cancel-button:hover,
.save-button:hover {
  transform: translateY(-1px);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 825px 381px;
  gap: 24px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form Sections */
.form-section {
  background: #f3f4f6;
  border-radius: 8px;
  box-shadow: inset -8px -8px 16px 0px #ffffff, inset 8px 8px 16px 0px #dfe2e7;
  padding: 26px 32px;
}

.form-section h2 {
  font-size: 24px;
  font-weight: 400;
  color: #000000;
  margin: 0 0 32px 0;
}

.form-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Form Fields */
.form-row {
  display: flex;
  gap: 24px;
  align-items: flex-end;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.wide {
  flex: 1;
  max-width: 512px;
}

.form-field.narrow {
  width: 172px;
}

.form-field label {
  font-size: 16px;
  color: #000000;
  font-family: 'Urbanist', sans-serif;
}

.form-input,
.form-textarea {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: #140003;
  box-shadow: inset -8px -8px 16px 0px #ffffff, inset 8px 8px 16px 0px #dfe2e7;
}

.form-input {
  height: 45px;
}

.form-textarea {
  min-height: 110px;
  resize: vertical;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  box-shadow: inset -8px -8px 16px 0px #ffffff, inset 8px 8px 16px 0px #dfe2e7, 0 0 0 2px #d41e51;
}

/* Tags */
.ingredients-list,
.allergens-list,
.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.ingredient-tag {
  background: rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #000000;
}

.allergen-tag {
  background: #f6a86e;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #f3f4f6;
}

.menu-tag {
  background: #6fdcbf;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #f3f4f6;
}

.remove-btn {
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  font-size: 16px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* Add Input */
.add-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-field {
  flex: 1;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 11.5px 17px;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: #140003;
  box-shadow: inset -8px -8px 16px 0px #ffffff, inset 8px 8px 16px 0px #dfe2e7;
  height: 40px;
}

.add-field::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

.add-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Urbanist', sans-serif;
  color: #000000;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #c5c5c5;
}

.add-btn:hover {
  transform: translateY(-1px);
}

/* Status Section */
.status-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.status-info h3 {
  margin-bottom: 4px;
}

.status-info p {
  font-size: 16px;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

.status-divider {
  width: 100%;
  height: 1px;
  background: #cfcfcf;
  margin: 16px 0;
}

.status-text {
  text-align: center;
  font-size: 16px;
  color: #000000;
  margin-bottom: 24px;
}

.menu-title {
  text-align: center;
  margin-bottom: 16px !important;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
}

.toggle-input {
  display: none;
}

.toggle-label {
  display: block;
  width: 47px;
  height: 29px;
  background: #cfcfcf;
  border-radius: 15px;
  cursor: pointer;
  position: relative;
  transition: background 0.3s;
}

.toggle-label::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 23px;
  height: 23px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-label {
  background: #6fdcbf;
}

.toggle-input:checked + .toggle-label::after {
  transform: translateX(18px);
}

/* Image Upload */
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.image-preview {
  width: 100%;
  height: 229px;
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: inset -8px -8px 16px 0px #ffffff, inset 8px 8px 16px 0px #dfe2e7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.gallery-preview {
  height: 327px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #979ea5;
}

.no-image span {
  font-size: 14px;
  font-weight: 700;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 8px;
}

.gallery-grid img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  padding: 5px 26px;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  color: #000000;
  box-shadow: -6px -6px 12px 0px #ffffff, 6px 6px 12px 0px #c5c5c5;
}

.upload-btn:hover {
  transform: translateY(-1px);
}

.upload-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 1600px) {
  .content-grid {
    grid-template-columns: 1fr 381px;
  }
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .sidebar-column {
    order: -1;
  }
}
</style>
