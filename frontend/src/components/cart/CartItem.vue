<template>
  <div class="p-4 border border-gray-100 rounded-lg mb-4 hover:shadow-md transition-shadow">
    <div class="flex flex-col sm:flex-row">
      <!-- Product Image -->
      <div class="w-full sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
        <img
          :src="item.image || '/images/product-placeholder.jpg'"
          :alt="item.name"
          class="w-full sm:w-24 h-24 object-cover rounded-md border border-gray-200"
        />
      </div>

      <!-- Product Info -->
      <div class="flex-grow sm:ml-4 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
        <div>
          <router-link
            :to="{ name: 'product-detail', params: { id: item.productId }}"
            class="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {{ item.name }}
          </router-link>
          <div class="text-sm text-gray-500 mt-1">
            {{ formatPrice(item.price) }}
          </div>
        </div>

        <Divider class="sm:hidden my-3" />

        <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto">
          <!-- Quantity Controls -->
          <div class="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
            <Button
              icon="pi pi-minus"
              severity="secondary"
              :disabled="item.quantity <= 1"
              @click="updateQuantity(item.quantity - 1)"
              text
              size="small"
              class="p-button-rounded"
              aria-label="Giảm số lượng"
            />
            <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
            <Button
              icon="pi pi-plus"
              severity="secondary"
              @click="updateQuantity(item.quantity + 1)"
              text
              size="small"
              class="p-button-rounded"
              aria-label="Tăng số lượng"
            />
          </div>

          <!-- Total Price -->
          <div class="text-right ml-4">
            <div class="font-semibold text-primary-700">
              {{ formatPrice(item.price * item.quantity) }}
            </div>
          </div>

          <!-- Remove Button -->
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            @click="removeItem"
            class="ml-2"
            aria-label="Xóa sản phẩm"
          />
        </div>
      </div>
    </div>
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
