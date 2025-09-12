<template>
  <div class="base-list-container">
    <!-- Sidebar -->
    <SidebarComponent />
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="page-header">
          <div class="title-section">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <p class="page-subtitle">{{ pageSubtitle }}</p>
          </div>
          <button 
            v-if="showCreateButton"
            class="create-button"
            @click="$emit('create')"
          >
            <span class="mobile-menu-icon">☰</span>
            <span class="create-text">{{ createButtonText }}</span>
          </button>
        </div>
        
        <!-- Items Grid -->
        <div class="items-grid">
          <BaseCard
            v-for="item in items"
            :key="item.id"
            :title="item.name || item.title"
            :description="item.description"
            :count="item.count"
            :count-label="countLabel"
            :view-label="viewLabel"
            :edit-label="editLabel"
            :delete-label="deleteLabel"
            :item="item"
            @navigate="$emit('navigate', $event)"
            @view="$emit('view', $event)"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from './SidebarComponent.vue'
import BaseCard from './BaseCard.vue'

export default {
  name: 'BaseListView',
  components: {
    SidebarComponent,
    BaseCard
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
    items: {
      type: Array,
      default: () => []
    },
    countLabel: {
      type: String,
      default: 'elementi'
    },
    viewLabel: {
      type: String,
      default: 'Visualizza'
    },
    editLabel: {
      type: String,
      default: 'Modifica'
    },
    deleteLabel: {
      type: String,
      default: 'Elimina'
    },
    showCreateButton: {
      type: Boolean,
      default: true
    },
    createButtonText: {
      type: String,
      default: 'Crea nuovo'
    }
  },
  emits: ['create', 'navigate', 'view', 'edit', 'delete']
}
</script>

<style scoped>
.base-list-container {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

.main-content {
  flex: 1;
  margin-left: 224px;
  padding: 40px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
}

.header-section {
  width: 100%;
  max-width: 1230px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  width: 100%;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
}

.title-section {
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

.create-button {
  background: #f92561;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px 24px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  height: 30px;
}

.create-button:hover {
  background: #e91e5a;
}

.mobile-menu-icon {
  font-size: 14px;
  color: #f3f4f6;
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-icon {
    display: inline;
  }
  
  .create-text {
    display: none;
  }
}

.create-text {
  white-space: nowrap;
}

/* Items Grid */
.items-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 45px;
  width: 100%;
}

@media (max-width: 1024px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
