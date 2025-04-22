import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/config/axios'
import { useCartStore } from './cart'

export const useOrderStore = defineStore('order', () => {
  // State
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalOrders = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)

  // Getters
  const sortedOrders = computed(() => {
    return [...orders.value].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  })

  // Actions
  const fetchOrders = async (params = {}) => {
    try {
      loading.value = true
      error.value = null

      const response = await axios.get('/api/orders', { params })
      
      orders.value = response.data.data
      totalOrders.value = response.data.total
      currentPage.value = response.data.currentPage
      totalPages.value = response.data.totalPages

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching orders'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchOrderById = async (id) => {
    try {
      loading.value = true
      error.value = null

      const response = await axios.get(`/api/orders/${id}`)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching order'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createOrder = async () => {
    try {
      loading.value = true
      error.value = null

      const cartStore = useCartStore()
      
      // Check if cart is empty
      if (cartStore.items.length === 0) {
        throw new Error('Giỏ hàng trống')
      }

      const orderData = {
        items: cartStore.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }

      const response = await axios.post('/api/orders/checkout', orderData)
      
      // Clear cart after successful order
      cartStore.clearCart()
      
      // Add new order to list
      orders.value.unshift(response.data.data)

      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating order'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearOrders = () => {
    orders.value = []
    totalOrders.value = 0
    currentPage.value = 1
    totalPages.value = 1
    error.value = null
  }

  return {
    // State
    orders,
    loading,
    error,
    totalOrders,
    currentPage,
    totalPages,

    // Getters
    sortedOrders,

    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    clearOrders
  }
})
