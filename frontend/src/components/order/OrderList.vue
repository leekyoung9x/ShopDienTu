<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="i in 3" :key="i" height="150px" class="rounded-lg" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!orders.length" class="text-center bg-white py-12 px-4 rounded-lg shadow-sm border border-gray-100">
      <i class="pi pi-inbox text-5xl text-gray-400 mb-4"></i>
      <p class="text-gray-500 mb-4 text-lg">Bạn chưa có đơn hàng nào</p>
      <router-link to="/products">
        <Button
          label="Bắt đầu mua sắm"
          icon="pi pi-shopping-cart"
          severity="secondary"
          outlined
        >
          <template #icon>
            <i class="pi pi-shopping-cart mr-2" />
          </template>
        </Button>
      </router-link>
    </div>

    <!-- Orders list -->
    <div v-else class="space-y-6">
      <Panel v-for="order in orders" :key="order.id" :toggleable="true" class="order-panel">
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
            <div class="flex items-center">
              <i :class="getStatusIcon(order.status)" class="status-icon mr-3"></i>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Đơn hàng #{{ order.id }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center mt-2 sm:mt-0">
              <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" class="mr-2" />
              <div class="font-semibold text-primary-700 hidden sm:block">
                {{ formatPrice(order.totalAmount) }}
              </div>
            </div>
          </div>
        </template>
        
        <template #content>
          <!-- Mobile View: Total -->
          <div class="font-semibold text-primary-700 block sm:hidden mb-4">
            Tổng cộng: {{ formatPrice(order.totalAmount) }}
          </div>
          
          <!-- Order items -->
          <DataTable 
            :value="order.items" 
            class="mb-4" 
            responsiveLayout="stack" 
            breakpoint="960px"
            stripedRows
          >
            <Column field="product.name" header="Sản phẩm">
              <template #body="slotProps">
                <div class="flex items-center">
                  <img
                    :src="slotProps.data.product.image || '/images/product-placeholder.jpg'"
                    :alt="slotProps.data.product.name"
                    class="w-12 h-12 object-cover rounded-md mr-3 border border-gray-200"
                  />
                  <router-link
                    :to="{ name: 'product-detail', params: { id: slotProps.data.product.id }}"
                    class="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {{ slotProps.data.product.name }}
                  </router-link>
                </div>
              </template>
            </Column>
            <Column field="price" header="Đơn giá">
              <template #body="slotProps">
                {{ formatPrice(slotProps.data.price) }}
              </template>
            </Column>
            <Column field="quantity" header="Số lượng" />
            <Column header="Thành tiền">
              <template #body="slotProps">
                <span class="font-medium">
                  {{ formatPrice(slotProps.data.price * slotProps.data.quantity) }}
                </span>
              </template>
            </Column>
          </DataTable>

          <!-- Order footer -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600 mb-3 sm:mb-0">
              <i class="pi pi-box mr-2"></i>
              {{ order.items.length }} sản phẩm
            </div>
            <Button
              label="Xem chi tiết đơn hàng"
              icon="pi pi-external-link"
              size="small"
              outlined
              @click="$router.push({ name: 'order-detail', params: { id: order.id }})"
            >
              <template #icon>
                <i class="pi pi-external-link mr-2" />
              </template>
            </Button>
          </div>
        </template>
      </Panel>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <Paginator
        v-model:first="first"
        :rows="rows"
        :totalRecords="totalRecords"
        @page="onPageChange"
        class="p-paginator-sm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Skeleton from 'primevue/skeleton';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const props = defineProps({
  orders: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalRecords: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-change']);

const first = ref(0);
const rows = ref(10);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  };
  return labels[status] || status;
};

const getStatusSeverity = (status) => {
  const severities = {
    pending: 'warning',
    confirmed: 'info',
    shipping: 'info',
    delivered: 'success',
    cancelled: 'danger'
  };
  return severities[status] || 'info';
};

const getStatusIcon = (status) => {
  const icons = {
    pending: 'pi pi-clock text-yellow-500',
    confirmed: 'pi pi-check-circle text-blue-500',
    shipping: 'pi pi-truck text-blue-500',
    delivered: 'pi pi-check-square text-green-500',
    cancelled: 'pi pi-times-circle text-red-500'
  };
  return icons[status] || 'pi pi-circle-fill text-gray-500';
};

const onPageChange = (event) => {
  first.value = event.first;
  rows.value = event.rows;
  emit('page-change', {
    page: Math.floor(event.first / event.rows) + 1,
    limit: event.rows
  });
};
</script>

<style scoped>
.order-panel :deep(.p-panel-header) {
  border-radius: 8px;
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

.order-panel :deep(.p-panel-content) {
  border-color: #e5e7eb;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.order-panel :deep(.p-panel-header-icon) {
  width: 2rem;
  height: 2rem;
  color: #4b5563;
  border-radius: 0.375rem;
}

.order-panel :deep(.p-panel-header-icon:hover) {
  background-color: #e5e7eb;
  color: #1f2937;
}

.status-icon {
  font-size: 1.25rem;
}

/* Responsive DataTable Styling */
:deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td) {
  padding: 0.5rem 0.75rem;
}

:deep(.p-datatable-wrapper) {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

:deep(.p-paginator) {
  border-radius: 0.5rem;
}
</style>
