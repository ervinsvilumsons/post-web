<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
      <form @submit.prevent="submitRegister" class="space-y-4">
        <div>
          <label for="name" class="block mb-1 font-medium">Name</label>
          <input
            id="name"
            type="text"
            v-model="form.name"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errorName" class="mt-4 text-red-600 text-center">{{ errorName }}</p>
        </div>
        <div>
          <label for="email" class="block mb-1 font-medium">Email</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errorEmail" class="mt-4 text-red-600 text-center">{{ errorEmail }}</p>
        </div>
        <div>
          <label for="password" class="block mb-1 font-medium">Password</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            class="w-full px-3 py-2 border rounded"
          />
          <p v-if="errorPassword" class="mt-4 text-red-600 text-center">{{ errorPassword }}</p>
        </div>
        <div>
          <label for="password_confirmation" class="block mb-1 font-medium">Confirm Password</label>
          <input
            id="password_confirmation"
            type="password"
            v-model="form.password_confirmation"
            required
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          :disabled="loading"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm">
        Already have an account?
        <RouterLink to="/login" class="text-indigo-600 hover:underline">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import apiClient from '../plugins/axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const loading = ref(false);
const errorName = ref('');
const errorEmail = ref('');
const errorPassword = ref('');

async function submitRegister() {
  loading.value = true;
  errorName.value = '';
  errorEmail.value = '';
  errorPassword.value = '';

  try {
    await apiClient.get('/sanctum/csrf-cookie');

    const response = await apiClient.post('/api/register', { ...form });

    authStore.login(response.data)
    router.push('/');
  } catch (error) {
    errorName.value = error.response?.data?.errors?.name?.[0];
    errorEmail.value = error.response?.data?.errors?.email?.[0];
    errorPassword.value = error.response?.data?.errors?.password?.[0];
  } finally {
    loading.value = false;
  }
}
</script>