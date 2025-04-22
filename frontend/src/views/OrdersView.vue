<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header with Breadcrumb -->
    <div class="mb-6">
      <Breadcrumb :model="breadcrumbItems" class="mb-4 p-0 border-none bg-transparent" />
      <div class="flex flex-wrap items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Đơn hàng của tôi
          </h1>
          <p class="mt-2 text-gray-600">
            Xem và theo dõi tất cả đơn hàng của bạn
          </p>
        </div>
        <div class="hidden sm:block">
          <Tag v-if="totalRecords" :value="`${totalRecords} đơn hàng`" severity="info" rounded class="text-sm" />
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <Card class="mb-6">
      <template #content>
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="p-input-icon-left w-full md:w-auto md:flex-grow">
            <i class="pi pi-search" />
            <InputText v-model="filters.search" placeholder="Tìm kiếm đơn hàng..." class="w-full pl-10"
              aria-label="Tìm kiếm đơn hàng" />
          </div>

          <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value"
            placeholder="Tất cả trạng thái" class="min-w-[180px] text-sm" :pt="{
              root: {
                class: 'rounded-lg border border-gray-300 py-2 px-3 text-sm shadow-sm focus:ring-primary-400'
              },
              input: {
                class: 'border-none focus:ring-0 focus:outline-none bg-transparent p-0 text-sm'
              }
            }" />

          <Button icon="pi pi-filter-slash" label="Xóa bộ lọc" outlined size="small" @click="clearFilters"
            class="w-full md:w-auto" v-if="filters.search || filters.status" />
        </div>
      </template>
    </Card>

    <!-- Orders List -->
    <OrderList :orders="orders" :loading="loading" :total-pages="totalPages" :total-records="totalRecords"
      @page-change="onPageChange" />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useOrderStore } from '@/stores/order';
import { useRouter } from 'vue-router';
import OrderList from '@/components/order/OrderList.vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Breadcrumb from 'primevue/breadcrumb';

const router = useRouter();
const orderStore = useOrderStore();

const loading = ref(false);
const orders = ref([]);
const totalPages = ref(0);
const totalRecords = ref(0);

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đang giao', value: 'shipping' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Đã hủy', value: 'cancelled' }
];

const breadcrumbItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Đơn hàng', to: '/orders' }
];

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

const clearFilters = () => {
  filters.search = '';
  filters.status = '';
};

const filters = reactive({
  search: '',
  status: '',
  page: 1,
  limit: 10
});

const fetchOrders = async () => {
  try {
    loading.value = true;
    const response = await orderStore.fetchOrders({
      ...filters,
      search: filters.search || undefined,
      status: filters.status || undefined
    });

    orders.value = response.data;
    totalPages.value = response.totalPages;
    totalRecords.value = response.total;
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

const onPageChange = ({ page, limit }) => {
  filters.page = page;
  filters.limit = limit;
  fetchOrders();
};

watch(
  [() => filters.search, () => filters.status],
  () => {
    filters.page = 1;
    fetchOrders();
  },
  { debounce: 300 }
);

onMounted(fetchOrders);
</script>
