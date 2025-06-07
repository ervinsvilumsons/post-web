import apiClient from '@/plugins/axios'

export async function getPosts(params) {
    const response = await apiClient.get('/api/posts', params)
    
    return response.data
}

export async function getPost(id) {
    const response = await apiClient.get(`/api/posts/${id}`)
    
    return response.data.data
}
