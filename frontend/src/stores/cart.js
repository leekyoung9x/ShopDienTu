import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref(JSON.parse(localStorage.getItem('cart')) || [])

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  // Actions
  const addToCart = (product, quantity = 1) => {
    const existingItem = items.value.find(item => item.productId === product.id)

    if (existingItem) {
      // Check if there's enough stock
      if (existingItem.quantity + quantity > product.quantity) {
        throw new Error('Không đủ số lượng trong kho')
      }
      existingItem.quantity += quantity
    } else {
      // Check if there's enough stock
      if (quantity > product.quantity) {
        throw new Error('Không đủ số lượng trong kho')
      }
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      })
    }

    // Save to localStorage
    saveToLocalStorage()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      item.quantity = quantity
      saveToLocalStorage()
    }
  }

  const removeFromCart = (productId) => {
    items.value = items.value.filter(item => item.productId !== productId)
    saveToLocalStorage()
  }

  const clearCart = () => {
    items.value = []
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  return {
    // State
    items,

    // Getters
    totalItems,
    totalAmount,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
})
