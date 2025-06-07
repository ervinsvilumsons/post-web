import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const isAuthenticated = ref(!!token.value)
  const user = ref(null)
  const router = useRouter();

  if (localStorage.getItem('user') !== null) {
    user.value = JSON.parse(localStorage.getItem('user'))
  }

  function login(data) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    isAuthenticated.value = true
    router.push({name: 'Index'})
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    isAuthenticated.value = false
    router.push({name: 'Login'})
  }

  return { token, isAuthenticated, login, logout, user }
})