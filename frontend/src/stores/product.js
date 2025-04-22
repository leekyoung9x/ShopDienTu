import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/config/axios'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalProducts = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(1)

  // Getters
  const sortedProducts = computed(() => {
    return [...products.value].sort((a, b) => b.createdAt - a.createdAt)
  })

  // Actions
  const fetchProducts = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await axios.get('/api/products', { params })
      
      products.value = response.data.data
      totalProducts.value = response.data.total
      currentPage.value = response.data.currentPage
      totalPages.value = response.data.totalPages
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching products'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await axios.get(`/api/products/${id}`)
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await axios.post('/api/products', productData)
      products.value.unshift(response.data.data)
      
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await axios.put(`/api/products/${id}`, productData)
      
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data.data
      }
      
      return response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      await axios.delete(`/api/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
      
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearProducts = () => {
    products.value = []
    totalProducts.value = 0
    currentPage.value = 1
    totalPages.value = 1
    error.value = null
  }

  return {
    // State
    products,
    loading,
    error,
    totalProducts,
    currentPage,
    totalPages,

    // Getters
    sortedProducts,

    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    clearProducts
  }
})
