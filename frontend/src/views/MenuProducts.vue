<template>
  <div class="menu-products-container">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent @restaurant-changed="handleRestaurantChanged" />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-left">
          <h1 class="page-title">Gestione Prodotti</h1>
          <p class="page-subtitle">Gestisci bevande e prodotti del tuo ristorante</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'drinks' }"
          @click="activeTab = 'drinks'"
        >
          <i class="fi fi-rr-glass"></i>
          Bevande
          <span class="tab-count">({{ drinks.length }})</span>
        </button>
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          <i class="fi fi-rr-box"></i>
          Prodotti
          <span class="tab-count">({{ products.length }})</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Drinks Tab -->
        <div v-if="activeTab === 'drinks'" class="drinks-tab">
          <div class="tab-header">
            <h2 class="tab-title">Bevande</h2>
            <button class="add-button" @click="openDrinkModal()">
              <i class="fi fi-rr-plus"></i>
              Aggiungi Bevanda
            </button>
          </div>

          <div class="items-grid">
            <div 
              v-for="drink in drinks" 
              :key="drink.id"
              class="item-card"
            >
              <div class="item-header">
                <h3 class="item-name">{{ drink.name }}</h3>
                <div class="item-actions">
                  <button 
                    class="action-button edit-button"
                    @click="openDrinkModal(drink)"
                    title="Modifica"
                  >
                    <i class="fi fi-rr-pencil"></i>
                  </button>
                  <button 
                    class="action-button delete-button"
                    @click="deleteDrink(drink)"
                    title="Elimina"
                  >
                    <i class="fi fi-rr-trash"></i>
                  </button>
                </div>
              </div>
              
              <p class="item-description">{{ drink.description || 'Nessuna descrizione' }}</p>
              
              <div class="item-details">
                <div class="detail-row">
                  <span class="detail-label">Prezzo:</span>
                  <span class="detail-value price">€{{ drink.price }}</span>
                </div>
                <div class="detail-row" v-if="drink.category">
                  <span class="detail-label">Categoria:</span>
                  <span class="detail-value">{{ drink.category }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Alcolico:</span>
                  <span class="detail-value" :class="{ alcoholic: drink.isAlcoholic }">
                    {{ drink.isAlcoholic ? 'Sì' : 'No' }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Disponibile:</span>
                  <span class="detail-value" :class="{ available: drink.isAvailable, unavailable: !drink.isAvailable }">
                    {{ drink.isAvailable ? 'Sì' : 'No' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-if="activeTab === 'products'" class="products-tab">
          <div class="tab-header">
            <h2 class="tab-title">Prodotti</h2>
            <button class="add-button" @click="openProductModal()">
              <i class="fi fi-rr-plus"></i>
              Aggiungi Prodotto
            </button>
          </div>

          <div class="items-grid">
            <div 
              v-for="product in products" 
              :key="product.id"
              class="item-card"
              :class="{ 'low-stock': product.stock <= product.minStock }"
            >
              <div class="item-header">
                <h3 class="item-name">{{ product.name }}</h3>
                <div class="item-actions">
                  <button 
                    class="action-button edit-button"
                    @click="openProductModal(product)"
                    title="Modifica"
                  >
                    <i class="fi fi-rr-pencil"></i>
                  </button>
                  <button 
                    class="action-button delete-button"
                    @click="deleteProduct(product)"
                    title="Elimina"
                  >
                    <i class="fi fi-rr-trash"></i>
                  </button>
                </div>
              </div>
              
              <p class="item-description">{{ product.description || 'Nessuna descrizione' }}</p>
              
              <div class="item-details">
                <div class="detail-row">
                  <span class="detail-label">Prezzo:</span>
                  <span class="detail-value price">€{{ product.price }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Unità:</span>
                  <span class="detail-value">{{ product.unit }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Stock:</span>
                  <span class="detail-value stock" :class="{ 'low-stock': product.stock <= product.minStock }">
                    {{ product.stock }}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Stock Min:</span>
                  <span class="detail-value">{{ product.minStock }}</span>
                </div>
              </div>

              <div v-if="product.stock <= product.minStock" class="low-stock-warning">
                <i class="fi fi-rr-exclamation-triangle"></i>
                Stock basso!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drink Modal -->
    <div v-if="showDrinkModal" class="modal-overlay" @click="closeDrinkModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingDrink ? 'Modifica Bevanda' : 'Aggiungi Bevanda' }}</h3>
          <button @click="closeDrinkModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="saveDrink" class="modal-form">
          <div class="form-group">
            <label for="drinkName">Nome *</label>
            <input 
              type="text" 
              id="drinkName"
              v-model="drinkForm.name"
              placeholder="Es. Coca Cola, Vino della Casa"
              required
            />
          </div>

          <div class="form-group">
            <label for="drinkDescription">Descrizione</label>
            <textarea 
              id="drinkDescription"
              v-model="drinkForm.description"
              placeholder="Descrivi la bevanda..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="drinkPrice">Prezzo *</label>
            <input 
              type="number" 
              id="drinkPrice"
              v-model="drinkForm.price"
              step="0.01"
              min="0"
              placeholder="Es. 2.50"
              required
            />
          </div>

          <div class="form-group">
            <label for="drinkCategory">Categoria</label>
            <input 
              type="text" 
              id="drinkCategory"
              v-model="drinkForm.category"
              placeholder="Es. soft_drink, wine, juice"
            />
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                v-model="drinkForm.isAlcoholic"
              />
              Bevanda alcolica
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                v-model="drinkForm.isAvailable"
              />
              Disponibile
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeDrinkModal" class="cancel-btn">
              Annulla
            </button>
            <button type="submit" :disabled="savingDrink" class="submit-btn">
              <span v-if="savingDrink">Salvataggio...</span>
              <span v-else>{{ editingDrink ? 'Aggiorna' : 'Crea' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="modal-overlay" @click="closeProductModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Modifica Prodotto' : 'Aggiungi Prodotto' }}</h3>
          <button @click="closeProductModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="saveProduct" class="modal-form">
          <div class="form-group">
            <label for="productName">Nome *</label>
            <input 
              type="text" 
              id="productName"
              v-model="productForm.name"
              placeholder="Es. Pomodoro, Mozzarella"
              required
            />
          </div>

          <div class="form-group">
            <label for="productDescription">Descrizione</label>
            <textarea 
              id="productDescription"
              v-model="productForm.description"
              placeholder="Descrivi il prodotto..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="productUnit">Unità *</label>
            <input 
              type="text" 
              id="productUnit"
              v-model="productForm.unit"
              placeholder="Es. kg, litri, pezzi"
              required
            />
          </div>

          <div class="form-group">
            <label for="productPrice">Prezzo *</label>
            <input 
              type="number" 
              id="productPrice"
              v-model="productForm.price"
              step="0.01"
              min="0"
              placeholder="Es. 2.50"
              required
            />
          </div>

          <div class="form-group">
            <label for="productStock">Stock *</label>
            <input 
              type="number" 
              id="productStock"
              v-model="productForm.stock"
              min="0"
              placeholder="Es. 100"
              required
            />
          </div>

          <div class="form-group">
            <label for="productMinStock">Stock Minimo *</label>
            <input 
              type="number" 
              id="productMinStock"
              v-model="productForm.minStock"
              min="0"
              placeholder="Es. 10"
              required
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="closeProductModal" class="cancel-btn">
              Annulla
            </button>
            <button type="submit" :disabled="savingProduct" class="submit-btn">
              <span v-if="savingProduct">Salvataggio...</span>
              <span v-else>{{ editingProduct ? 'Aggiorna' : 'Crea' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/SidebarComponent.vue'
import api from '@/config/api'

export default {
  name: 'MenuProductsView',
  components: {
    SidebarComponent
  },
  data() {
    return {
      activeTab: 'drinks',
      drinks: [],
      products: [],
      loading: false,
      
      // Drink modal
      showDrinkModal: false,
      editingDrink: null,
      savingDrink: false,
      drinkForm: {
        name: '',
        description: '',
        price: '',
        category: '',
        isAlcoholic: false,
        isAvailable: true
      },
      
      // Product modal
      showProductModal: false,
      editingProduct: null,
      savingProduct: false,
      productForm: {
        name: '',
        description: '',
        unit: '',
        price: '',
        stock: '',
        minStock: ''
      }
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    handleRestaurantChanged(restaurant) {
      console.log('Restaurant changed in MenuProducts:', restaurant)
      this.loadData()
    },
    
    async loadData() {
      this.loading = true
      try {
        await Promise.all([
          this.loadDrinks(),
          this.loadProducts()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadDrinks() {
      try {
        const response = await api.get('/drinks')
        this.drinks = response.data.data.drinks || []
      } catch (error) {
        console.error('Error loading drinks:', error)
        // Use mock data if API fails
        this.drinks = [
          {
            id: 1,
            name: 'Coca Cola',
            description: 'Classic Coca Cola',
            price: 2.99,
            category: 'soft_drink',
            isAlcoholic: false,
            isAvailable: true
          },
          {
            id: 2,
            name: 'Vino della Casa',
            description: 'Vino rosso della casa',
            price: 8.99,
            category: 'wine',
            isAlcoholic: true,
            isAvailable: true
          }
        ]
      }
    },
    
    async loadProducts() {
      try {
        const response = await api.get('/products')
        this.products = response.data.data.products || []
      } catch (error) {
        console.error('Error loading products:', error)
        // Use mock data if API fails
        this.products = [
          {
            id: 1,
            name: 'Pomodoro',
            description: 'Pomodori freschi',
            unit: 'kg',
            price: 3.50,
            stock: 15,
            minStock: 5
          },
          {
            id: 2,
            name: 'Mozzarella',
            description: 'Mozzarella di bufala',
            unit: 'kg',
            price: 12.00,
            stock: 3,
            minStock: 5
          }
        ]
      }
    },
    
    // Drink methods
    openDrinkModal(drink = null) {
      this.editingDrink = drink
      if (drink) {
        this.drinkForm = { ...drink }
      } else {
        this.drinkForm = {
          name: '',
          description: '',
          price: '',
          category: '',
          isAlcoholic: false,
          isAvailable: true
        }
      }
      this.showDrinkModal = true
    },
    
    closeDrinkModal() {
      this.showDrinkModal = false
      this.editingDrink = null
      this.drinkForm = {
        name: '',
        description: '',
        price: '',
        category: '',
        isAlcoholic: false,
        isAvailable: true
      }
    },
    
    async saveDrink() {
      this.savingDrink = true
      try {
        const drinkData = { ...this.drinkForm }
        drinkData.price = parseFloat(drinkData.price)
        
        if (this.editingDrink) {
          const response = await api.patch(`/drinks/${this.editingDrink.id}`, drinkData)
          const index = this.drinks.findIndex(d => d.id === this.editingDrink.id)
          if (index !== -1) {
            this.drinks[index] = response.data.data
          }
        } else {
          const response = await api.post('/drinks', drinkData)
          this.drinks.unshift(response.data.data)
        }
        
        this.closeDrinkModal()
      } catch (error) {
        console.error('Error saving drink:', error)
        alert('Errore nel salvare la bevanda')
      } finally {
        this.savingDrink = false
      }
    },
    
    async deleteDrink(drink) {
      if (!confirm(`Sei sicuro di voler eliminare "${drink.name}"?`)) {
        return
      }
      
      try {
        await api.delete(`/drinks/${drink.id}`)
        this.drinks = this.drinks.filter(d => d.id !== drink.id)
      } catch (error) {
        console.error('Error deleting drink:', error)
        alert('Errore nell\'eliminare la bevanda')
      }
    },
    
    // Product methods
    openProductModal(product = null) {
      this.editingProduct = product
      if (product) {
        this.productForm = { ...product }
      } else {
        this.productForm = {
          name: '',
          description: '',
          unit: '',
          price: '',
          stock: '',
          minStock: ''
        }
      }
      this.showProductModal = true
    },
    
    closeProductModal() {
      this.showProductModal = false
      this.editingProduct = null
      this.productForm = {
        name: '',
        description: '',
        unit: '',
        price: '',
        stock: '',
        minStock: ''
      }
    },
    
    async saveProduct() {
      this.savingProduct = true
      try {
        const productData = { ...this.productForm }
        productData.price = parseFloat(productData.price)
        productData.stock = parseInt(productData.stock)
        productData.minStock = parseInt(productData.minStock)
        
        if (this.editingProduct) {
          const response = await api.patch(`/products/${this.editingProduct.id}`, productData)
          const index = this.products.findIndex(p => p.id === this.editingProduct.id)
          if (index !== -1) {
            this.products[index] = response.data.data
          }
        } else {
          const response = await api.post('/products', productData)
          this.products.unshift(response.data.data)
        }
        
        this.closeProductModal()
      } catch (error) {
        console.error('Error saving product:', error)
        alert('Errore nel salvare il prodotto')
      } finally {
        this.savingProduct = false
      }
    },
    
    async deleteProduct(product) {
      if (!confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
        return
      }
      
      try {
        await api.delete(`/products/${product.id}`)
        this.products = this.products.filter(p => p.id !== product.id)
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Errore nell\'eliminare il prodotto')
      }
    }
  }
}
</script>

<style scoped>
.menu-products-container {
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
  justify-content: space-between;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.page-subtitle {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #140003;
  margin: 0;
  line-height: normal;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 4px;
  background: #f0f0f0;
  border-radius: 12px;
  padding: 4px;
  box-shadow: inset -4px -4px 8px 0px #ffffff, inset 4px 4px 8px 0px #dfe2e7;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  justify-content: center;
}

.tab-button:hover {
  color: #140003;
}

.tab-button.active {
  background: #f3f4f6;
  color: #140003;
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #dfe2e7;
}

.tab-count {
  font-size: 14px;
  color: #666;
  margin-left: auto;
}

/* Tab Content */
.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.tab-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #140003;
  margin: 0;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #140003;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-button:hover {
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #acacac;
  transform: translateY(-2px);
}

/* Items Grid */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.item-card {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 12px;
  padding: 20px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  transition: all 0.2s ease;
}

.item-card:hover {
  box-shadow: -4px -4px 8px 0px #ffffff, 4px 4px 8px 0px #acacac;
  transform: translateY(-2px);
}

.item-card.low-stock {
  border-color: #dc3545;
  background: linear-gradient(135deg, #f0f0f0, #fdf2f2);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.item-name {
  font-family: 'Urbanist', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #140003;
  margin: 0;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.edit-button {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-button:hover {
  background: #bbdefb;
}

.delete-button {
  background: #ffebee;
  color: #d32f2f;
}

.delete-button:hover {
  background: #ffcdd2;
}

.item-description {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.detail-value {
  font-size: 14px;
  color: #140003;
  font-weight: 500;
}

.detail-value.price {
  color: #28a745;
  font-weight: 600;
}

.detail-value.alcoholic {
  color: #dc3545;
}

.detail-value.available {
  color: #28a745;
}

.detail-value.unavailable {
  color: #dc3545;
}

.detail-value.stock.low-stock {
  color: #dc3545;
  font-weight: 600;
}

.low-stock-warning {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 6px;
  color: #dc3545;
  font-size: 14px;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  font-family: 'Urbanist', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #140003;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #140003;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.cancel-btn {
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #ffffff;
  color: #666;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #f8f9fa;
}

.submit-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-products-container {
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

  .tab-navigation {
    flex-direction: column;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }
}

/* Font Loading */
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600&display=swap');
</style>