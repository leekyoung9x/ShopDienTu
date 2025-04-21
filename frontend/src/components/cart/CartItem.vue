<template>
  <div class="flex items-center py-4 border-b">
    <!-- Product Image -->
    <div class="w-24 h-24 flex-shrink-0">
      <img
        :src="item.image || '/images/product-placeholder.jpg'"
        :alt="item.name"
        class="w-full h-full object-cover rounded-md"
      />
    </div>

    <!-- Product Info -->
    <div class="flex-grow ml-4">
      <router-link
        :to="{ name: 'product-detail', params: { id: item.productId }}"
        class="text-lg font-semibold text-gray-900 hover:text-primary-600"
      >
        {{ item.name }}
      </router-link>
      <div class="text-sm text-gray-500">
        {{ formatPrice(item.price) }}
      </div>
    </div>

    <!-- Quantity Controls -->
    <div class="flex items-center space-x-2 mx-4">
      <Button
        icon="pi pi-minus"
        severity="secondary"
        :disabled="item.quantity <= 1"
        @click="updateQuantity(item.quantity - 1)"
        class="p-button-sm"
      />
      <span class="w-8 text-center">{{ item.quantity }}</span>
      <Button
        icon="pi pi-plus"
        severity="secondary"
        @click="updateQuantity(item.quantity + 1)"
        class="p-button-sm"
      />
    </div>

    <!-- Total Price -->
    <div class="w-24 text-right">
      <div class="font-semibold text-gray-900">
        {{ formatPrice(item.price * item.quantity) }}
      </div>
    </div>

    <!-- Remove Button -->
    <Button
      icon="pi pi-trash"
      severity="danger"
      text
      @click="removeItem"
      class="ml-4"
    />
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();
const toast = useToast();

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const updateQuantity = async (newQuantity) => {
  try {
    await cartStore.updateQuantity(props.item.productId, newQuantity);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message,
      life: 3000
    });
  }
};

const removeItem = async () => {
  try {
    await cartStore.removeFromCart(props.item.productId);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã xóa sản phẩm khỏi giỏ hàng',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message,
      life: 3000
    });
  }
};
</script>
