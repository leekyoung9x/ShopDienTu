<template>
  <div class="container mx-auto px-4">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Sản phẩm
      </h1>
      <p class="mt-2 text-gray-600">
        Khám phá các sản phẩm công nghệ mới nhất của chúng tôi
      </p>
    </div>

    <!-- Products Grid -->
    <ProductGrid />
  </div>
</template>

<script setup>
import ProductGrid from '@/components/product/ProductGrid.vue';
</script>
