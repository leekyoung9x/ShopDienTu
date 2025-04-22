<template>
  <div class="card group cursor-pointer">
    <!-- Product Image -->
    <div class="relative overflow-hidden rounded-t-lg aspect-square">
      <img
        :src="product.image || '/images/product-placeholder.jpg'"
        :alt="product.name"
        class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
      />
      <div
        v-if="product.quantity === 0"
        class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
      >
        Hết hàng
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
        <h3 class="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
          {{ product.name }}
        </h3>
      </router-link>

      <div class="mt-2 flex items-center justify-between">
        <span class="text-xl font-bold text-primary-600">
          {{ formatPrice(product.price) }}
        </span>
        <span class="text-sm text-gray-500">
          Còn {{ product.quantity }} sản phẩm
        </span>
      </div>

      <div class="mt-4 space-y-2">
        <!-- Khi còn hàng -->
        <Button
          v-if="product.quantity > 0"
          icon="pi pi-shopping-cart"
          label="Thêm vào giỏ"
          class="w-full px-5 py-2.5 text-sm font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white shadow-sm transition-all"
          @click="addToCart"
          :loading="loading"
        />

        <!-- Khi hết hàng -->
        <Button
          v-else
          icon="pi pi-bell"
          label="Thông báo khi có hàng"
          class="w-full px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
          severity="secondary"
          outlined
          @click="notifyWhenAvailable"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const toast = useToast();
const cartStore = useCartStore();
const loading = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const addToCart = async () => {
  try {
    loading.value = true;
    await cartStore.addToCart(props.product);
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
    loading.value = false;
  }
};

const notifyWhenAvailable = () => {
  toast.add({
    severity: 'info',
    summary: 'Thông báo',
    detail: 'Chúng tôi sẽ thông báo khi sản phẩm có hàng',
    life: 3000
  });
};
</script>
