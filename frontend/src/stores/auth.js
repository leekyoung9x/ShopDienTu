import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken'))
  const refreshToken = ref(localStorage.getItem('refreshToken'))

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  const setTokens = ({ accessToken: newAccessToken, refreshToken: newRefreshToken }) => {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
  }

  const clearTokens = () => {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    delete axios.defaults.headers.common['Authorization']
  }

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      const { user: userData, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
      
      user.value = userData
      setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken })
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { user: newUser, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
      
      user.value = newUser
      setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken })
      
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const logout = async () => {
    try {
      if (refreshToken.value) {
        await axios.post('/api/auth/logout', { refreshToken: refreshToken.value })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      clearTokens()
    }
  }

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh-token', {
        refreshToken: refreshToken.value
      })
      
      setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      })
      
      return response.data.accessToken
    } catch (error) {
      user.value = null
      clearTokens()
      throw error
    }
  }

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      user.value = response.data.user
      return response.data.user
    } catch (error) {
      user.value = null
      throw error
    }
  }

  // Initialize axios interceptor for token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const newAccessToken = await refreshAccessToken()
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axios(originalRequest)
        } catch (error) {
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )

  // Initialize user if access token exists
  if (accessToken.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`
    fetchUser().catch(() => {
      user.value = null
      clearTokens()
    })
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      user.value = response.data.user;
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  return {
    // State
    user,
    accessToken,
    refreshToken,

    // Getters
    isAuthenticated,
    isAdmin,

    // Actions
    login,
    register,
    logout,
    refreshAccessToken,
    fetchUser,
    updateProfile,
    changePassword
  }
})
