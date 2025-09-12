<template>
  <div class="base-table-container">
    <!-- Sidebar -->
    <div class="sidebar-wrapper">
      <SidebarComponent />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-subtitle">{{ pageSubtitle }}</p>
        </div>
        <button 
          v-if="showAddButton"
          class="add-button" 
          @click="$emit('add')"
        >
          + {{ addButtonText }}
        </button>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <!-- Table Header -->
        <div class="table-header">
          <div 
            v-for="column in columns" 
            :key="column.key"
            class="header-cell"
            :class="column.class"
          >
            {{ column.label }}
          </div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div 
            v-for="item in data" 
            :key="item.id" 
            class="table-row"
            @click="$emit('rowClick', item)"
          >
            <!-- Dynamic columns -->
            <div 
              v-for="column in columns" 
              :key="column.key"
              class="table-cell"
              :class="column.cellClass"
            >
              <!-- Actions column -->
              <div v-if="column.key === 'actions'" class="actions">
                <button 
                  class="action-button edit-button"
                  @click.stop="$emit('edit', item)"
                  :title="editLabel"
                >
                  ✏️
                </button>
                <button 
                  class="action-button delete-button"
                  @click.stop="$emit('delete', item)"
                  :title="deleteLabel"
                >
                  🗑️
                </button>
              </div>
              <!-- Regular content -->
              <span v-else>{{ getColumnValue(item, column) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from './SidebarComponent.vue'

export default {
  name: 'BaseTableView',
  components: {
    SidebarComponent
  },
  props: {
    pageTitle: {
      type: String,
      required: true
    },
    pageSubtitle: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    addButtonText: {
      type: String,
      default: 'Aggiungi'
    },
    editLabel: {
      type: String,
      default: 'Modifica'
    },
    deleteLabel: {
      type: String,
      default: 'Elimina'
    }
  },
  emits: ['add', 'edit', 'delete', 'rowClick'],
  methods: {
    getColumnValue(item, column) {
      if (column.formatter) {
        return column.formatter(item[column.key])
      }
      return item[column.key]
    }
  }
}
</script>

<style scoped>
/* Main Container */
.base-table-container {
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
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .base-table-container {
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
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

.header-left {
  flex: 1;
}

.page-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 48px;
  font-weight: 400;
  color: #140003;
  margin: 0 0 8px 0;
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

.add-button {
  background: #f92561;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  height: 30px;
  position: relative;
  z-index: 1001;
}

.add-button:hover {
  background: #e91e5a;
}

/* Table Styles */
.table-container {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  overflow: hidden;
}

.table-header {
  display: flex;
  padding: 12px 17px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.header-cell {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #140003;
  flex: 1;
}

.header-cell.name-header {
  flex: 2;
}

.header-cell.actions-header {
  flex: 0.5;
  text-align: center;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: flex;
  padding: 8px 17px;
  border-bottom: 1px solid #eee;
  align-items: center;
  min-height: 35px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.table-row:hover {
  background: rgba(0, 0, 0, 0.02);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #140003;
  flex: 1;
  display: flex;
  align-items: center;
}

.table-cell.name-cell {
  flex: 2;
}

.table-cell.actions-cell {
  flex: 0.5;
  justify-content: center;
}

/* Actions */
.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-button {
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 6px 8px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
  transition: all 0.2s ease;
  font-size: 14px;
}

.action-button:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.edit-button {
  color: #28a745;
}

.delete-button {
  color: #dc3545;
}
</style>
