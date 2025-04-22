<template>
  <div class="container mx-auto px-4">
    <!-- Breadcrumb -->
    <div class="py-4">
      <Breadcrumb :model="breadcrumbItems" class="border-none p-0" />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="bg-white rounded-xl shadow-sm p-6 mb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image skeleton -->
        <div class="space-y-4">
          <Skeleton height="400px" borderRadius="0.75rem" />
          <div class="hidden md:flex justify-start gap-2">
            <Skeleton v-for="i in 4" :key="i" width="80px" height="80px" borderRadius="0.5rem" />
          </div>
        </div>
        <!-- Info skeleton -->
        <div class="space-y-6">
          <Skeleton width="70%" height="36px" />
          <div class="flex items-center">
            <Skeleton width="120px" height="24px" />
            <div class="ml-2">
              <Skeleton width="120px" height="16px" />
            </div>
          </div>
          <Skeleton width="40%" height="48px" />
          <Skeleton width="30%" height="24px" />
          <div class="flex gap-4 items-center">
            <Skeleton width="100px" height="40px" />
            <Skeleton width="180px" height="48px" />
          </div>
          <Skeleton height="1px" />
          <Skeleton height="200px" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-8 mb-12 text-center">
      <div class="mx-auto w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <i class="pi pi-exclamation-circle text-4xl text-red-500"></i>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Không thể tải sản phẩm</h3>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          label="Thử lại"
          icon="pi pi-refresh"
          @click="fetchProduct"
        />
        <Button
          label="Quay lại danh sách sản phẩm"
          icon="pi pi-arrow-left"
          outlined
          @click="$router.push('/products')"
        />
      </div>
    </div>

    <!-- Product detail -->
    <template v-else-if="product">
      <ProductDetail
        :product="product"
        @add-to-cart="handleAddToCart"
      />

      <!-- Recently Viewed Products -->
      <div v-if="recentlyViewed.length > 0" class="mt-16 mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            <span class="border-b-4 border-primary-500 pb-2">Sản phẩm đã xem gần đây</span>
          </h2>
          <Button 
            icon="pi pi-eye-slash" 
            label="Xóa lịch sử" 
            severity="secondary" 
            text 
            @click="clearRecentlyViewed"
          />
        </div>
        
        <Carousel :value="recentlyViewed" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions">
          <template #item="slotProps">
            <div class="p-2">
              <ProductCard :product="slotProps.data" class="shadow-sm hover:shadow-md transition-shadow" />
            </div>
          </template>
        </Carousel>
      </div>

      <!-- Related Products -->
      <div class="mt-12 mb-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          <span class="border-b-4 border-primary-500 pb-2">Sản phẩm liên quan</span>
        </h2>
        <Carousel :value="relatedProducts" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions">
          <template #item="slotProps">
            <div class="p-2">
              <ProductCard :product="slotProps.data" class="shadow-sm hover:shadow-md transition-shadow" />
            </div>
          </template>
        </Carousel>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'primevue/usetoast';
import ProductDetail from '@/components/product/ProductDetail.vue';
import ProductCard from '@/components/product/ProductCard.vue';
import Breadcrumb from 'primevue/breadcrumb';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const toast = useToast();

const product = ref(null);
const loading = ref(true);
const error = ref(null);
const relatedProducts = ref([]);
const recentlyViewed = ref([]);

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/products' },
  { label: product.value?.name || 'Chi tiết sản phẩm' }
]);

// Responsive options for carousel
const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1
  }
];

// Xử lý thêm vào giỏ hàng
const handleAddToCart = async (data) => {
  try {
    await cartStore.addToCart(data.product, data.quantity);
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
  }
};

// Fetch product details
const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch product information
    product.value = await productStore.fetchProductById(route.params.id);
    
    // Add to recently viewed
    addToRecentlyViewed(product.value);
    
    // Update page title
    document.title = `${product.value.name} - TechZone`;
    
    // Fetch related products (same category or similar price range)
    const response = await productStore.fetchProducts({
      limit: 6,
      exclude: product.value.id
    });
    
    relatedProducts.value = response.data;
    
    // Load recently viewed products
    loadRecentlyViewed();
  } catch (err) {
    error.value = err.message || 'Không thể tải thông tin sản phẩm';
    console.error('Error fetching product:', err);
  } finally {
    loading.value = false;
  }
};

// Handle recently viewed products
const addToRecentlyViewed = (product) => {
  try {
    // Get existing recent products from localStorage
    let recent = JSON.parse(localStorage.getItem('recently-viewed') || '[]');
    
    // Remove current product if already in the list
    recent = recent.filter(item => item.id !== product.id);
    
    // Add current product to the beginning
    recent.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: product.quantity
    });
    
    // Keep only the last 6 items
    recent = recent.slice(0, 6);
    
    // Save back to localStorage
    localStorage.setItem('recently-viewed', JSON.stringify(recent));
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

// Load recently viewed products
const loadRecentlyViewed = () => {
  try {
    // Get recent products from localStorage
    const recent = JSON.parse(localStorage.getItem('recently-viewed') || '[]');
    
    // Filter out current product
    recentlyViewed.value = recent.filter(item => item.id !== route.params.id);
  } catch (error) {
    console.error('Error loading recently viewed:', error);
  }
};

// Clear recently viewed products
const clearRecentlyViewed = () => {
  localStorage.removeItem('recently-viewed');
  recentlyViewed.value = [];
  toast.add({
    severity: 'success',
    summary: 'Thành công',
    detail: 'Đã xóa lịch sử sản phẩm đã xem',
    life: 3000
  });
};

// Watch for route changes to reload data when navigating between product pages
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }
);

// Initial data loading
onMounted(fetchProduct);
</script>

<style scoped>
/* Custom styling for breadcrumb */
:deep(.p-breadcrumb) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-breadcrumb .p-menuitem-text) {
  color: theme('colors.gray.600');
}

:deep(.p-breadcrumb-chevron) {
  color: theme('colors.gray.400');
}

:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator button) {
  background-color: theme('colors.gray.300');
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transition: all 0.2s;
}

:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button) {
  background-color: theme('colors.primary.500');
  width: 12px;
  height: 12px;
}
</style>
