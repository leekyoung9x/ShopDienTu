<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="i in 3" :key="i" height="150px" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!orders.length" class="text-center py-12">
      <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
      <p class="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
      <router-link to="/products">
        <Button
          label="Bắt đầu mua sắm"
          icon="pi pi-shopping-cart"
          severity="secondary"
          class="p-button-outlined"
        />
      </router-link>
    </div>

    <!-- Orders list -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-lg shadow-sm p-6"
      >
        <!-- Order header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              Đơn hàng #{{ order.id }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" />
        </div>

        <!-- Order items -->
        <div class="border rounded-lg p-4 mb-4">
          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center"
            >
              <img
                :src="item.product.image || '/images/product-placeholder.jpg'"
                :alt="item.product.name"
                class="w-16 h-16 object-cover rounded-md"
              />
              <div class="ml-4 flex-grow">
                <router-link
                  :to="{ name: 'product-detail', params: { id: item.product.id }}"
                  class="font-medium text-gray-900 hover:text-primary-600"
                >
                  {{ item.product.name }}
                </router-link>
                <div class="text-sm text-gray-500">
                  {{ formatPrice(item.price) }} x {{ item.quantity }}
                </div>
              </div>
              <div class="text-right font-medium text-gray-900">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Order footer -->
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            {{ order.items.length }} sản phẩm
          </div>
          <div class="space-x-4">
            <span class="text-lg font-semibold text-primary-600">
              Tổng cộng: {{ formatPrice(order.totalAmount) }}
            </span>
            <Button
              label="Chi tiết"
              text
              @click="$router.push({ name: 'order-detail', params: { id: order.id }})"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <Paginator
        v-model:first="first"
        :rows="rows"
        :totalRecords="totalRecords"
        @page="onPageChange"
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

const onPageChange = (event) => {
  first.value = event.first;
  rows.value = event.rows;
  emit('page-change', {
    page: Math.floor(event.first / event.rows) + 1,
    limit: event.rows
  });
};
</script>
