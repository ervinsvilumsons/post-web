<template>
  <nav class="bg-indigo-600 text-white p-4 flex justify-between items-center">
    <router-link to="/" class="text-lg font-bold">Posts App</router-link>
    <div v-if="isAuthenticated" class="flex items-center space-x-4">
      <router-link to="/user" class="hover:underline">
        {{ user?.name }}
      </router-link>
      <button
        @click="logout"
        class="bg-indigo-800 hover:bg-indigo-700 px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

function logout() {
  authStore.logout()
}
</script>