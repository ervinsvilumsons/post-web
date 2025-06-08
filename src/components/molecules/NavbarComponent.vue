<template>
  <nav class="bg-indigo-600 text-white p-4 flex justify-between items-center">
    <router-link
      id="indexPage"
      class="text-lg font-bold"
      :to="{ name: 'Index' }"
    >
      {{ $t('app_name') }}
    </router-link>
    <div v-if="isAuthenticated" class="flex items-center space-x-4">
      <router-link
        id="userPage" 
        class="hover:underline"
        :to="{ name: 'User' }"
      >
        {{ user?.name }}
      </router-link>
      <button
        @click="logout"
        id="logout"
        class="bg-indigo-800 hover:bg-indigo-700 px-3 py-1 rounded"
      >
        {{ $t('logout') }}
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