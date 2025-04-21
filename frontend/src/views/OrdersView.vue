<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Đơn hàng của tôi
      </h1>
      <p class="mt-2 text-gray-600">
        Xem và theo dõi tất cả đơn hàng của bạn
      </p>
    </div>

    <div class="mb-6">
      <!-- Filters -->
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-grow max-w-xs">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search" />
            <InputText
              v-model="filters.search"
              placeholder="Tìm kiếm đơn hàng..."
              class="w-full"
            />
          </span>
        </div>

        <Dropdown
          v-model="filters.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Trạng thái"
          class="w-48"
        />
      </div>
    </div>

    <!-- Orders List -->
    <OrderList
      :orders="orders"
      :loading="loading"
      :total-pages="totalPages"
      :total-records="totalRecords"
      @page-change="onPageChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useOrderStore } from '@/stores/order';
import OrderList from '@/components/order/OrderList.vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

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
