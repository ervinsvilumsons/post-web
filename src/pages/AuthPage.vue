<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">{{ isLogin ? $t('login') : $t('register') }}</h1>
        <form @submit.prevent="submit" class="space-y-4">
            <div v-if="!isLogin">
                <label for="name" class="block mb-1 font-medium">{{ $t('name') }}</label>
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
                <label for="email" class="block mb-1 font-medium">{{ $t('email') }}</label>
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
                <label for="password" class="block mb-1 font-medium">{{ $t('password') }}</label>
                <input
                    id="password"
                    type="password"
                    v-model="form.password"
                    required
                    class="w-full px-3 py-2 border rounded"
                />
                <p v-if="errorPassword" class="mt-4 text-red-600 text-center">{{ errorPassword }}</p>
            </div>
            <div v-if="!isLogin">
                <label for="password_confirmation" class="block mb-1 font-medium">{{ $t('password_confirmation') }}</label>
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
                {{ isLogin ? (loading ? $t('logging_in') : $t('login')) : (loading ? $t('registering') : $t('register')) }}
            </button>
        </form>
        <p v-if="isLogin && errorCredentials" class="mt-4 text-red-600 text-center">{{ errorCredentials }}</p>
        <p v-if="isLogin" 
            class="mt-4 text-center text-sm">
            {{ $t('dont_have_account') }}
            <RouterLink :to="{ name: 'Register' }" class="text-indigo-600 hover:underline">{{ $t('register') }}</RouterLink>
        </p>
        <p v-else 
            class="mt-4 text-center text-sm">
            {{ $t('have_account') }}
            <RouterLink :to="{ name: 'Login' }" class="text-indigo-600 hover:underline">{{ $t('login') }}</RouterLink>
        </p>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { login, register } from '@/services/authService'

const route = useRoute()
const isLogin = computed(() => route.name === 'Login')
const form = initForm()
const loading = ref(false)
const errorName = ref('')
const errorEmail = ref('')
const errorPassword = ref('')
const errorCredentials = ref('')

function initForm() {
    if (isLogin.value) {
        return reactive({
            email: '',
            password: '',
        })
    }

    return reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
}

async function submit() {
    loading.value = true
    errorName.value = ''
    errorEmail.value = ''
    errorPassword.value = ''

    try {
        if (isLogin.value) {
            await login({ ...form })
        } else {
            await register({ ...form })
        }
    } catch (error) {
        errorName.value = error.response?.data?.errors?.name?.[0]
        errorEmail.value = error.response?.data?.errors?.email?.[0]
        errorPassword.value = error.response?.data?.errors?.password?.[0]
        errorCredentials.value = error.response.data.message
    } finally {
        loading.value = false
    }
}
</script>