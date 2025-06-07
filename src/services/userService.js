import apiClient from '@/plugins/axios'

export async function getPosts(params) {
    const response = await apiClient.get('/api/user/posts', params)
    
    return response.data
}

export async function createPost(params) {
    const response = await apiClient.post('/api/user/post', params)

    return response.data.data
}

export async function editPost(id, params) {
    const response = await apiClient.put(`/api/user/post/${id}`, params)

    return response.data.data
}

export async function deletePost(id) {
    const response = await apiClient.delete(`/api/user/post/${id}`)

    return response
}

export async function createComment(params) {
    const response = await apiClient.post('/api/user/comment', params)

    return response.data.data
}

export async function deleteComment(id) {
    const response = await apiClient.delete(`/api/user/comment/${id}`)

    return response
}