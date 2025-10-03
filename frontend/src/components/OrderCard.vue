<template>
  <div class="order-card">
    <div class="order-header">
      <div class="order-number">
        <span class="order-label">Ordine:</span>
        <span class="order-value">#{{ formatOrderNumber(order.nOrder, order.year) }}</span>
      </div>
      <div class="order-status" :class="getStatusClass(order.status)">
        {{ getStatusText(order.status) }}
      </div>
    </div>
    
    <div class="order-info">
      <div class="info-row">
        <div class="info-item">
          <i class="fi fi-rr-calendar"></i>
          <span>{{ formatDate(order.orderDate || order.createdAt) }}</span>
        </div>
        <div class="info-item">
          <i class="fi fi-rr-table"></i>
          <span>{{ order.table ? `Tavolo ${order.table.number}` : 'Asporto/Delivery' }}</span>
        </div>
      </div>
      
      <div class="info-row">
        <div class="info-item">
          <i class="fi fi-rr-plate-utensils"></i>
          <span>{{ getTotalItems(order) }} elementi</span>
        </div>
        <div class="info-item total">
          <i class="fi fi-rr-euro"></i>
          <span class="total-amount">€ {{ parseFloat(order.totalAmount || 0).toFixed(2) }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="order.notes" class="order-notes">
      <i class="fi fi-rr-comment"></i>
      <span>{{ order.notes }}</span>
    </div>
    
    <div class="order-actions">
      <button @click="$emit('view', order)" class="action-btn view-btn">
        <i class="fi fi-rr-eye"></i>
        Visualizza
      </button>
      <button @click="$emit('edit', order)" class="action-btn edit-btn">
        <i class="fi fi-rr-edit"></i>
        Modifica
      </button>
      <button @click="$emit('delete', order)" class="action-btn delete-btn">
        <i class="fi fi-rr-trash"></i>
        Elimina
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'edit', 'delete'],
  methods: {
    formatOrderNumber(orderNumber, year) {
      if (!orderNumber || !year) return 'N/A'
      
      // Pad the order number with zeros to make it 7 digits
      const paddedNumber = orderNumber.toString().padStart(7, '0')
      return `${year}-${paddedNumber}`
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: 'In attesa',
        preparing: 'In preparazione',
        ready: 'Pronto',
        delivered: 'Consegnato',
        cancelled: 'Annullato'
      }
      return statusMap[status] || status
    },
    
    getStatusClass(status) {
      return `status-${status}`
    },
    
    getTotalItems(order) {
      const platesCount = (order.orderPlates || []).length
      const drinksCount = (order.orderDrinks || []).length
      return platesCount + drinksCount
    }
  }
}
</script>

<style scoped>
.order-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.order-number {
  display: flex;
  flex-direction: column;
}

.order-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 500;
}

.order-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.order-status {
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.status-preparing {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.status-ready {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.status-delivered {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #9ca3af;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

.order-info {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.info-item i {
  width: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.info-item.total {
  font-weight: 600;
}

.total-amount {
  color: #059669;
  font-weight: 700;
}

.order-notes {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.order-notes i {
  width: 16px;
  color: #9ca3af;
  flex-shrink: 0;
  margin-top: 2px;
}

.order-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.view-btn {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
}

.view-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.edit-btn {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1e40af;
}

.edit-btn:hover {
  background: #bfdbfe;
  border-color: #60a5fa;
}

.delete-btn {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
  border-color: #f87171;
}

.action-btn i {
  width: 12px;
}

@media (max-width: 768px) {
  .order-card {
    padding: 1rem;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .info-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .order-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .order-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>