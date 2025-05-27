import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const isAuthenticated = ref(!!token.value)
  const user = ref(null)

  if (localStorage.getItem('user') !== null) {
    user.value = JSON.parse(localStorage.getItem('user'))
  }

  function login(data) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    isAuthenticated.value = true
  }

  function logout() {
    token.value = ''
    isAuthenticated.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { token, isAuthenticated, login, logout, user }
})