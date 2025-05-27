<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <form @submit.prevent="submitLogin" class="space-y-4">
        <div>
          <label for="email" class="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <div>
          <label for="password" class="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-600 text-center">{{ errorMessage }}</p>
      <p class="mt-4 text-center text-sm">
        Don't have an account?
        <RouterLink to="/register" class="text-indigo-600 hover:underline">Register</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../plugins/axios';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const errorMessage = ref('');

async function submitLogin() {
  loading.value = true;
  errorMessage.value = '';

  try {
    await apiClient.get('/sanctum/csrf-cookie');

    const response = await apiClient.post('/api/login', {
      email: form.email,
      password: form.password,
    });

    authStore.login(response.data)
    router.push('/');

  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Login failed';
    } else {
      errorMessage.value = 'Login failed: Network or server error';
    }
  } finally {
    loading.value = false;
  }
}
</script>