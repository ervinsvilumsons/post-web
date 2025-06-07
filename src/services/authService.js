import apiClient from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'

export async function login(data) {
    const authStore = useAuthStore()
    await apiClient.get('/sanctum/csrf-cookie')
    const response = await apiClient.post('/api/login', data)
    authStore.login(response.data)

    return response.data
}

export async function register(data) {
    const authStore = useAuthStore()
    await apiClient.get('/sanctum/csrf-cookie')
    const response = await apiClient.post('/api/register', data)
    authStore.login(response.data)

    return response.data
}