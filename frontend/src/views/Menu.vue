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
    />
  
  <!-- Edit Menu Category Modal -->
  
  <!-- Edit Menu Category Modal -->
  <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Modifica Categoria Menu</h3>
        <button @click="showEditModal = false" class="close-btn">&times;</button>
      </div>
      
      <form @submit.prevent="updateMenu" class="create-form">
        <div class="form-group">
          <label for="editCategoryName">Nome Menu *</label>
          <input 
            type="text" 
            id="editCategoryName"
            v-model="editingMenu.name"
            placeholder="Es. Antipasti, Primi Piatti, Dessert"
            required
          />
        </div>

        <div class="form-group">
          <label for="editCategoryDescription">Descrizione</label>
          <textarea 
            id="editCategoryDescription"
            v-model="editingMenu.description"
            placeholder="Descrivi brevemente questa categoria di menu..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="editCategorySlug">Slug (identificativo URL)</label>
          <input 
            type="text" 
            id="editCategorySlug"
            v-model="editingMenu.category"
            placeholder="Es. antipasti, primi-piatti, dessert"
          />
          <small class="form-help">Verrà generato automaticamente dal nome se lasciato vuoto</small>
        </div>

        <div class="form-group">
          <label for="editIsActive">Attivo</label>
          <input 
            type="checkbox" 
            id="editIsActive"
            v-model="editingMenu.isActive"
          />
        </div>

        <div class="form-actions">
          <button type="button" @click="showEditModal = false" class="cancel-btn">
            Annulla
          </button>
          <button type="submit" :disabled="!editingMenu.name || updating" class="submit-btn">
            <span v-if="updating">Aggiornamento...</span>
            <span v-else>Aggiorna Menu</span>
          </button>
        </div>
      </form>
    </div>
  </div>
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
      ],
      showEditModal: false,
      updating: false,
      editingMenu: {
        id: null,
        name: '',
        description: '',
        category: '',
        isActive: true,
      }
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

    resetEditForm() {
      this.editingMenu = {
        id: null,
        name: '',
        description: '',
        category: '',
        isActive: true
      }
    },

    async updateMenu() {
      if (!this.editingMenu.name.trim()) return

      try {
        this.updating = true

        // Generate slug if not provided
        if (!this.editingMenu.category) {
          this.editingMenu.category = this.generateSlug(this.editingMenu.name)
        } else {
          this.editingMenu.category = this.generateSlug(this.editingMenu.category)
        }

        const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}')

        const categoryData = {
          name: this.editingMenu.name,
          description: this.editingMenu.description,
          category: this.editingMenu.category,
          isActive: this.editingMenu.isActive,
          restaurantId: selectedRestaurant.id
        }

        const response = await fetch(`${apiConfig.apiEndpoint}/menus/${this.editingMenu.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(categoryData)
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            // Update the menu in the local array
            const menuIndex = this.menus.findIndex(m => m.id === this.editingMenu.id)
            if (menuIndex !== -1) {
              this.menus[menuIndex] = {
                id: result.data.id,
                name: result.data.name,
                description: result.data.description,
                category: result.data.category,
                isActive: result.data.isActive
              }
            }
            
            this.resetEditForm()
            this.showEditModal = false
          } else {
            throw new Error(result.message || 'Failed to update category')
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to update category')
        }

      } catch (error) {
        console.error('Errore nell\'aggiornamento della categoria:', error)
        alert(`Errore nell'aggiornamento della categoria: ${error.message}`)
      } finally {
        this.updating = false
      }
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
    
    editMenu(category) {
      // Populate the editing form with current category data
      this.editingMenu = {
        id: category.id,
        name: category.name,
        description: category.description || '',
        category: category.category || '',
        isActive: category.isActive !== undefined ? category.isActive : true
      }
      this.showEditModal = true
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
/* Edit Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #fcfbf8;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #140003;
  margin: 0;
  font-family: 'Urbanist', sans-serif;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
}

.create-form {
  padding: 0 1.5rem 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #140003;
  margin-bottom: 0.5rem;
  font-family: 'Urbanist', sans-serif;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  transition: all 0.2s;
  box-sizing: border-box;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f92561;
  box-shadow: 0 0 0 3px rgba(249, 37, 97, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-help {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background: #f0f0f0;
  color: #4a5568;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.submit-btn {
  background: #f92561;
  color: #fcfbf8;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Urbanist', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #e91e5a;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>


