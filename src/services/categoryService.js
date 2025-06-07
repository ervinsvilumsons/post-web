import apiClient from '@/plugins/axios'

export async function getCategories() {
    const response = await apiClient.get('/api/categories')
    
    return response.data.data
}