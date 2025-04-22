<template>
  <div>
    <!-- Toolbar: View options and sort -->
    <div class="mb-6 bg-white p-4 rounded-xl shadow-sm">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <!-- Left: View mode and results count -->
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 border-r border-gray-200 pr-4">
            <Button 
              icon="pi pi-th-large" 
              :class="{'p-button-outlined': viewMode !== 'grid'}"
              @click="setViewMode('grid')" 
              aria-label="Chế độ lưới" 
              v-tooltip.top="'Chế độ lưới'"
              size="small" 
            />
            <Button 
              icon="pi pi-list" 
              :class="{'p-button-outlined': viewMode !== 'list'}"
              @click="setViewMode('list')" 
              aria-label="Chế độ danh sách" 
              v-tooltip.top="'Chế độ danh sách'"
              size="small"
            />
          </div>
          <div class="text-gray-600 text-sm">
            <span v-if="totalRecords > 0">Hiển thị {{ products.length }} trong tổng số {{ totalRecords }} sản phẩm</span>
            <span v-else>0 sản phẩm</span>
          </div>
        </div>

          <!-- Right: Search and sort -->
        <div class="flex flex-wrap gap-3 items-center ml-auto">
          <div class="relative">
            <div class="p-input-icon-left p-input-icon-right w-full">
              <i class="pi pi-search text-primary-500" />
              <InputText
                v-model="filters.search"
                placeholder="Tìm kiếm sản phẩm..."
                class="w-full py-2 px-4 pl-10 rounded-full border-2 border-gray-200 focus:border-primary-400 hover:border-primary-300 transition-all shadow-sm"
                @keydown.enter="fetchProducts"
              />
              <i v-if="filters.search" @click="clearSearch" class="pi pi-times text-gray-400 cursor-pointer hover:text-primary-500 transition-colors" />
            </div>
          </div>
          
          <Dropdown
            v-model="filters.sortBy"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Sắp xếp theo"
            class="min-w-[200px]"
          />
        </div>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading">
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Skeleton v-for="i in 9" :key="i" height="350px" class="rounded-xl" />
      </div>
      <div v-else class="space-y-4">
        <Skeleton v-for="i in 6" :key="i" height="150px" class="rounded-xl" />
      </div>
    </div>

    <!-- Products grid view -->
    <div v-else-if="viewMode === 'grid' && products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="transform hover:-translate-y-1 transition-all duration-300"
      >
        <ProductCard :product="product" class="h-full shadow-sm hover:shadow-md transition-shadow" />
      </div>
    </div>

    <!-- Products list view -->
    <div v-else-if="viewMode === 'list' && products.length > 0" class="space-y-4">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <div class="flex flex-col sm:flex-row">
          <!-- Product image -->
          <div class="sm:w-52 h-52 sm:h-full relative overflow-hidden">
            <img
              :src="product.image || '/images/product-placeholder.jpg'"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <div
              v-if="product.quantity === 0"
              class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
            >
              Hết hàng
            </div>
            <Badge v-if="isNewProduct(product)" value="Mới" class="absolute top-2 left-2" severity="success" />
            <Badge v-if="isDiscounted(product)" value="Giảm giá" class="absolute top-10 left-2" severity="warning" />
          </div>

          <!-- Product info -->
          <div class="p-4 flex-grow flex flex-col justify-between">
            <div>
              <router-link :to="{ name: 'product-detail', params: { id: product.id } }" class="block mb-2">
                <h3 class="text-xl font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
                  {{ product.name }}
                </h3>
              </router-link>
              
              <div class="flex items-center mb-2">
                <Rating :modelValue="getRating(product)" readonly :cancel="false" class="mr-2" />
                <span class="text-sm text-gray-500">({{ getReviewCount(product) }} đánh giá)</span>
              </div>

              <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
            </div>

            <div class="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span class="text-2xl font-bold text-primary-600 block">
                  {{ formatPrice(product.price) }}
                </span>
                <span v-if="product.oldPrice" class="text-sm text-gray-500 line-through">
                  {{ formatPrice(product.oldPrice) }}
                </span>
              </div>
              
              <div class="flex gap-2">
                <Button
                  v-if="product.quantity > 0"
                  icon="pi pi-shopping-cart"
                  label="Thêm vào giỏ"
                  @click="addToCart(product)"
                  :loading="loadingStates[product.id]"
                />
                <Button
                  v-else
                  icon="pi pi-bell"
                  label="Thông báo khi có hàng"
                  severity="secondary"
                  outlined
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && products.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm">
      <div class="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="pi pi-shopping-bag text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
      <p class="text-gray-600 mb-6">Không có sản phẩm nào phù hợp với điều kiện tìm kiếm của bạn</p>
      <Button label="Xóa bộ lọc" icon="pi pi-filter-slash" @click="resetFilters" />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex flex-wrap justify-between items-center">
      <p class="text-sm text-gray-600">
        Trang {{ currentPage }} / {{ totalPages }}
      </p>
      
      <Paginator
        v-model:first="filters.first"
        :rows="filters.rows"
        :totalRecords="totalRecords"
        :rowsPerPageOptions="[12, 24, 48]"
        @page="onPageChange"
        :template="{
          '640px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
          '960px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
          '1300px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport',
        }"
        class="border rounded-lg overflow-hidden shadow-sm"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'primevue/usetoast';
import ProductCard from './ProductCard.vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Rating from 'primevue/rating';

const productStore = useProductStore();
const cartStore = useCartStore();
const toast = useToast();
const route = useRoute();
const router = useRouter();

const sortOptions = [
  { label: 'Mới nhất', value: '-createdAt' },
  { label: 'Giá: Thấp đến cao', value: 'price' },
  { label: 'Giá: Cao đến thấp', value: '-price' },
  { label: 'Đánh giá cao nhất', value: '-rating' },
  { label: 'Tên A-Z', value: 'name' },
  { label: 'Tên Z-A', value: '-name' }
];

// View mode: grid or list
const viewMode = ref(localStorage.getItem('product-view-mode') || 'grid');

// Filters and pagination
const filters = reactive({
  search: route.query.search || '',
  sortBy: '-createdAt',
  first: 0,
  rows: 12,
  categories: [],
  brands: [],
  priceRange: [0, 0], // Min and max price
  minRating: 0
});

// Data
const loading = ref(false);
const products = ref([]);
const totalRecords = ref(0);
const totalPages = ref(0);
const loadingStates = ref({});
const currentPage = computed(() => Math.floor(filters.first / filters.rows) + 1);

// Set the product view mode
const setViewMode = (mode) => {
  viewMode.value = mode;
  localStorage.setItem('product-view-mode', mode);
}

// Fetch products with filters
const fetchProducts = async () => {
  try {
    loading.value = true;
    const page = Math.floor(filters.first / filters.rows) + 1;
    
    // Update URL query params if search is present
    if (filters.search) {
      router.replace({
        query: { ...route.query, search: filters.search }
      })
    }
    
    const response = await productStore.fetchProducts({
      page,
      limit: filters.rows,
      search: filters.search,
      sort: filters.sortBy,
      // Add additional filter parameters here as needed
      // category: filters.categories.join(','),
      // brand: filters.brands.join(','),
      // minPrice: filters.priceRange[0],
      // maxPrice: filters.priceRange[1]
    });

    products.value = response.data.map(product => ({
      ...product,
      // Simulate some fake data for demo purposes
      rating: Math.floor(Math.random() * 5) + 1,
      reviewCount: Math.floor(Math.random() * 100),
      oldPrice: Math.random() > 0.7 ? product.price * 1.2 : null,
      isNew: Math.random() > 0.7
    }));
    
    totalRecords.value = response.total;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải danh sách sản phẩm.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Handle page change
const onPageChange = (event) => {
  filters.first = event.first;
  filters.rows = event.rows;
  fetchProducts();
};

// Clear search
const clearSearch = () => {
  filters.search = '';
  fetchProducts();
};

// Reset filters
const resetFilters = () => {
  filters.search = '';
  filters.sortBy = '-createdAt';
  filters.first = 0;
  
  // Clear other filters if they were set
  // filters.categories = [];
  // filters.brands = [];
  // filters.priceRange = [0, 0];
  // filters.minRating = 0;
  
  // Update URL and refetch
  router.replace({ query: {} });
  fetchProducts();
};

// Add to cart handler with loading state
const addToCart = async (product) => {
  try {
    loadingStates.value = {
      ...loadingStates.value,
      [product.id]: true
    };
    
    await cartStore.addToCart(product);
    
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã thêm sản phẩm vào giỏ hàng',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Không thể thêm vào giỏ hàng',
      life: 3000
    });
  } finally {
    loadingStates.value = {
      ...loadingStates.value,
      [product.id]: false
    };
  }
};

// Format price to Vietnamese currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Check if a product is new
const isNewProduct = (product) => {
  return product.isNew;
};

// Check if product has a discount
const isDiscounted = (product) => {
  return !!product.oldPrice;
};

// Get product rating
const getRating = (product) => {
  return product.rating || 0;
};

// Get review count
const getReviewCount = (product) => {
  return product.reviewCount || 0;
};

// Apply external filters from parent component
const applyExternalFilters = (externalFilters) => {
  // Implement logic to apply external filters
  // This would be used by parent component
  console.log('Applied external filters:', externalFilters);
  fetchProducts();
};

// Watch for filter changes
watch(() => [filters.sortBy], () => {
  filters.first = 0; // Reset pagination when sorting changes
  fetchProducts();
});

// Initialize and fetch products
onMounted(() => {
  // Get search from URL if present
  if (route.query.search) {
    filters.search = route.query.search;
  }
  
  fetchProducts();
});

// Expose methods for parent component
defineExpose({
  applyExternalFilters,
  resetFilters,
  fetchProducts
});
</script>

<style scoped>
/* Custom styling for paginator */
:deep(.p-paginator) {
  background-color: white;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background-color: theme('colors.primary.500');
  color: white;
}

/* Fade animation for products */
.grid > div, .space-y-4 > div {
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered animation for products */
.grid > div:nth-child(1), .space-y-4 > div:nth-child(1) { animation-delay: 0.05s; }
.grid > div:nth-child(2), .space-y-4 > div:nth-child(2) { animation-delay: 0.1s; }
.grid > div:nth-child(3), .space-y-4 > div:nth-child(3) { animation-delay: 0.15s; }
.grid > div:nth-child(4), .space-y-4 > div:nth-child(4) { animation-delay: 0.2s; }
.grid > div:nth-child(5), .space-y-4 > div:nth-child(5) { animation-delay: 0.25s; }
.grid > div:nth-child(6), .space-y-4 > div:nth-child(6) { animation-delay: 0.3s; }
.grid > div:nth-child(7), .space-y-4 > div:nth-child(7) { animation-delay: 0.35s; }
.grid > div:nth-child(8), .space-y-4 > div:nth-child(8) { animation-delay: 0.4s; }
.grid > div:nth-child(9), .space-y-4 > div:nth-child(9) { animation-delay: 0.45s; }
</style>
