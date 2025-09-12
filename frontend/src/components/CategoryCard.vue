<template>
  <div class="category-card" @click="$emit('navigate', category)">
    <div class="card-content">
      <div class="card-header">
        <div class="title-section">
          <h3 class="category-title">{{ title }}</h3>
          <div class="dish-count">
            <span>{{ dishCount }} piatti</span>
          </div>
        </div>
        <p class="category-description">{{ description }}</p>
      </div>
      <div class="card-actions">
        <button class="view-btn" @click.stop="$emit('view', title)">
          Visualizza i piatti
        </button>
        <button class="action-btn edit" @click.stop="$emit('edit', category)">
          <span class="action-icon">✏️</span>
        </button>
        <button class="action-btn delete" @click.stop="$emit('delete', category)">
          <span class="action-icon">🗑️</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    dishCount: {
      type: Number,
      required: true
    },
    category: {
      type: Object,
      required: true
    }
  },
  emits: ['navigate', 'view', 'edit', 'delete']
}
</script>

<style scoped>
/* Category Card */
.category-card {
  background: #f0f0f0;
  border: 0.5px solid #adb5bd;
  border-radius: 8px;
  height: 200px;
  padding: 17px;
  box-shadow: -8px -8px 16px 0px #ffffff, 8px 8px 16px 0px #acacac;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .category-card {
    width: 100%;
    height: auto;
    min-height: 180px;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  flex: 1;
  margin-bottom: 24px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.category-title {
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #140003;
  margin: 0;
  line-height: normal;
}

.dish-count {
  background: #f0f0f0;
  border-radius: 16px;
  padding: 2px 15px;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
}

.dish-count span {
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #140003;
}

.category-description {
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #212529;
  line-height: normal;
  margin: 0;
}

/* Card Actions */
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.view-btn {
  background: #f92561;
  color: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Urbanist', sans-serif;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  flex: 1;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #e91e5a;
}

.action-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 9px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px -2px 4px 0px #ffffff, 2px 2px 4px 0px #acacac;
  transition: all 0.2s ease;
}

.action-btn:hover {
box-shadow: -1px -1px 2px 0 #FFF;
transform: translateY(1px);
  background: #e9ecef;
}
.action-btn.edit:hover {
  background: #F6A86E;
}
.action-btn.delete:hover {
  background: #D41E51;
}
.action-icon {
  font-size: 14px;
  color: #140003;
}
</style>
