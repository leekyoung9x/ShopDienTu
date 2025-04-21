<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <Breadcrumb :model="breadcrumbItems" />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-6">
      <Skeleton height="200px" />
      <Skeleton height="400px" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <i class="pi pi-exclamation-circle text-4xl text-red-500 mb-4"></i>
      <p class="text-gray-600">{{ error }}</p>
      <Button
        label="Thử lại"
        class="mt-4"
        @click="fetchOrder"
      />
    </div>

    <!-- Order details -->
    <template v-else-if="order">
      <!-- Order header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Đơn hàng #{{ order.id }}
            </h1>
            <p class="text-gray-500">
              Đặt ngày {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" size="large" />
        </div>

        <!-- Order progress -->
        <Steps
          :model="orderSteps"
          :readonly="true"
          :active="getCurrentStepIndex()"
        />
      </div>

      <!-- Order items -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        <div class="divide-y">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-4 flex items-center"
          >
            <img
              :src="item.product.image || '/images/product-placeholder.jpg'"
              :alt="item.product.name"
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div class="ml-4 flex-grow">
              <router-link
                :to="{ name: 'product-detail', params: { id: item.product.id }}"
                class="text-lg font-medium text-gray-900 hover:text-primary-600"
              >
                {{ item.product.name }}
              </router-link>
              <div class="text-sm text-gray-500 mt-1">
                {{ formatPrice(item.price) }} x {{ item.quantity }}
              </div>
            </div>
            <div class="text-right">
              <div class="font-medium text-gray-900">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Tổng quan</h2>
        <div class="space-y-3">
          <div class="flex justify-between text-gray-600">
            <span>Tạm tính</span>
            <span>{{ formatPrice(order.totalAmount - 30000) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{{ formatPrice(30000) }}</span>
          </div>
          <Divider />
          <div class="flex justify-between text-xl font-semibold">
            <span>Tổng cộng</span>
            <span class="text-primary-600">{{ formatPrice(order.totalAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex justify-end space-x-4">
        <Button
          v-if="order.status === 'pending'"
          label="Hủy đơn hàng"
          severity="danger"
          outlined
          :loading="cancelling"
          @click="cancelOrder"
        />
        <Button
          label="In đơn hàng"
          icon="pi pi-print"
          severity="secondary"
          outlined
          @click="printOrder"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Steps from 'primevue/steps';
import Skeleton from 'primevue/skeleton';
import Divider from 'primevue/divider';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const toast = useToast();

const loading = ref(true);
const error = ref(null);
const order = ref(null);
const cancelling = ref(false);

const orderSteps = [
  { label: 'Đặt hàng', icon: 'pi pi-shopping-cart' },
  { label: 'Xác nhận', icon: 'pi pi-check' },
  { label: 'Vận chuyển', icon: 'pi pi-truck' },
  { label: 'Hoàn thành', icon: 'pi pi-flag' }
];

const breadcrumbItems = computed(() => [
  { label: 'Đơn hàng', to: '/orders' },
  { label: `Đơn hàng #${route.params.id}` }
]);

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

const getCurrentStepIndex = () => {
  const statusIndex = {
    pending: 0,
    confirmed: 1,
    shipping: 2,
    delivered: 3,
    cancelled: -1
  };
  return statusIndex[order.value?.status] || 0;
};

const fetchOrder = async () => {
  try {
    loading.value = true;
    error.value = null;
    order.value = await orderStore.fetchOrderById(route.params.id);
  } catch (err) {
    error.value = err.message || 'Không thể tải thông tin đơn hàng';
    console.error('Error fetching order:', err);
  } finally {
    loading.value = false;
  }
};

const cancelOrder = async () => {
  try {
    cancelling.value = true;
    await orderStore.cancelOrder(order.value.id);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã hủy đơn hàng',
      life: 3000
    });
    await fetchOrder();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Không thể hủy đơn hàng',
      life: 3000
    });
  } finally {
    cancelling.value = false;
  }
};

const printOrder = () => {
  window.print();
};

onMounted(fetchOrder);
</script>
