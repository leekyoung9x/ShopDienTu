<template>
  <div class="container mx-auto px-4">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <Breadcrumb :model="breadcrumbItems" />
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton height="400px" />
        <div class="space-y-4">
          <Skeleton width="70%" height="36px" />
          <Skeleton width="40%" height="48px" />
          <Skeleton width="30%" height="24px" />
          <Skeleton height="48px" />
          <Skeleton height="1px" />
          <Skeleton height="200px" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <i class="pi pi-exclamation-circle text-4xl text-red-500 mb-4"></i>
      <p class="text-gray-600">{{ error }}</p>
      <Button
        label="Thử lại"
        class="mt-4"
        @click="fetchProduct"
      />
    </div>

    <!-- Product detail -->
    <ProductDetail
      v-else-if="product"
      :product="product"
    />

    <!-- Related Products -->
    <div v-if="product" class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Sản phẩm liên quan
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';
import ProductDetail from '@/components/product/ProductDetail.vue';
import ProductCard from '@/components/product/ProductCard.vue';
import Breadcrumb from 'primevue/breadcrumb';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';

const route = useRoute();
const productStore = useProductStore();

const product = ref(null);
const loading = ref(true);
const error = ref(null);

const breadcrumbItems = computed(() => [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm', to: '/products' },
  { label: product.value?.name || 'Chi tiết sản phẩm' }
]);

const relatedProducts = ref([]);

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    product.value = await productStore.fetchProductById(route.params.id);
    
    // Fetch related products (same category or similar price range)
    const response = await productStore.fetchProducts({
      limit: 4,
      exclude: product.value.id
    });
    relatedProducts.value = response.data;
  } catch (err) {
    error.value = err.message || 'Không thể tải thông tin sản phẩm';
    console.error('Error fetching product:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProduct);
</script>
