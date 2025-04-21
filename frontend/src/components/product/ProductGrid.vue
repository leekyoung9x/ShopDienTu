<template>
  <div>
    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-4">
      <span class="p-input-icon-left flex-grow max-w-md">
        <i class="pi pi-search" />
        <InputText
          v-model="filters.search"
          placeholder="Tìm kiếm sản phẩm..."
          class="w-full"
        />
      </span>

      <Dropdown
        v-model="filters.sortBy"
        :options="sortOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Sắp xếp theo"
      />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Skeleton v-for="i in 8" :key="i" height="350px" class="card" />
    </div>

    <!-- Products grid -->
    <div v-else>
      <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-else class="text-center py-12">
        <i class="pi pi-shopping-bag text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500">Không tìm thấy sản phẩm nào</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <Paginator
          v-model:first="filters.first"
          :rows="filters.rows"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[12, 24, 48]"
          @page="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useProductStore } from '@/stores/product';
import ProductCard from './ProductCard.vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';

const productStore = useProductStore();

const sortOptions = [
  { label: 'Mới nhất', value: '-createdAt' },
  { label: 'Giá: Thấp đến cao', value: 'price' },
  { label: 'Giá: Cao đến thấp', value: '-price' },
  { label: 'Tên A-Z', value: 'name' },
  { label: 'Tên Z-A', value: '-name' }
];

const filters = reactive({
  search: '',
  sortBy: '-createdAt',
  first: 0,
  rows: 12
});

const loading = ref(false);
const products = ref([]);
const totalRecords = ref(0);
const totalPages = ref(0);

const fetchProducts = async () => {
  try {
    loading.value = true;
    const page = Math.floor(filters.first / filters.rows) + 1;
    const response = await productStore.fetchProducts({
      page,
      limit: filters.rows,
      search: filters.search,
      sort: filters.sortBy
    });

    products.value = response.data;
    totalRecords.value = response.total;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event) => {
  filters.first = event.first;
  filters.rows = event.rows;
  fetchProducts();
};

watch(
  () => [filters.search, filters.sortBy],
  () => {
    filters.first = 0;
    fetchProducts();
  },
  { deep: true }
);

onMounted(fetchProducts);
</script>
