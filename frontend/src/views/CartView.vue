<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

    <div v-if="loading" class="space-y-4">
      <Skeleton v-for="i in 3" :key="i" height="100px" />
    </div>

    <div v-else-if="!cartStore.items.length" class="text-center py-12">
      <i class="pi pi-shopping-cart text-4xl text-gray-400 mb-4"></i>
      <p class="text-gray-500 mb-4">Giỏ hàng trống</p>
      <router-link to="/products">
        <Button
          label="Tiếp tục mua sắm"
          icon="pi pi-shopping-cart"
          severity="secondary"
          class="p-button-outlined"
        />
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="divide-y">
            <CartItem
              v-for="item in cartStore.items"
              :key="item.productId"
              :item="item"
            />
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="lg:col-span-1">
        <CartSummary
          :items="cartStore.items"
          :subtotal="cartStore.totalAmount"
          @checkout="handleCheckout"
        />
      </div>
    </div>

    <!-- Checkout Dialog -->
    <Dialog
      v-model:visible="showCheckoutDialog"
      modal
      header="Xác nhận đặt hàng"
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <p>Bạn có muốn đặt hàng với tổng số tiền {{ formatPrice(cartStore.totalAmount) }}?</p>
        <p class="text-sm text-gray-500">
          Sau khi xác nhận, đơn hàng sẽ được xử lý và không thể hủy.
        </p>
      </div>
      <template #footer>
        <Button
          label="Hủy"
          icon="pi pi-times"
          @click="showCheckoutDialog = false"
          text
        />
        <Button
          label="Xác nhận"
          icon="pi pi-check"
          @click="confirmCheckout"
          :loading="checkoutLoading"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/order';
import CartItem from '@/components/cart/CartItem.vue';
import CartSummary from '@/components/cart/CartSummary.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Skeleton from 'primevue/skeleton';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const toast = useToast();

const loading = ref(false);
const showCheckoutDialog = ref(false);
const checkoutLoading = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const handleCheckout = () => {
  showCheckoutDialog.value = true;
};

const confirmCheckout = async () => {
  try {
    checkoutLoading.value = true;
    const order = await orderStore.createOrder();
    
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đặt hàng thành công',
      life: 3000
    });

    showCheckoutDialog.value = false;
    router.push({
      name: 'order-detail',
      params: { id: order.id }
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Không thể đặt hàng',
      life: 3000
    });
  } finally {
    checkoutLoading.value = false;
  }
};
</script>
