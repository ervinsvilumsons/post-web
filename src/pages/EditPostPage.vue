<template>
    <div>
        <NavbarComponent/>

        <div class="max-w-3xl mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Edit Post</h1>

            <form @submit.prevent="submitPost" class="space-y-4">
            <div>
                <label class="block mb-1 font-semibold">Title</label>
                <input
                v-model="title"
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Enter post title"
                required
                />
            </div>

            <div>
                <label class="block mb-1 font-semibold">Content</label>
                <textarea
                v-model="content"
                rows="6"
                class="w-full border rounded px-3 py-2"
                placeholder="Write your post content here"
                required
                ></textarea>
            </div>

            <div>
                <label class="block mb-1 font-semibold">Categories</label>
                <div class="flex flex-wrap gap-2">
                <label
                    v-for="cat in categories"
                    :key="cat.id"
                    class="inline-flex items-center space-x-2"
                >
                    <input
                    type="checkbox"
                    :value="cat.id"
                    v-model="selectedCategories"
                    class="form-checkbox"
                    />
                    <span>{{ cat.title }}</span>
                </label>
                </div>
            </div>

            <div v-if="error" class="text-red-600">{{ error }}</div>

            <button
                type="submit"
                :disabled="loading"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
                {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../plugins/axios'
import { useAuthStore } from '@/stores/auth'
import NavbarComponent from '@/components/NavbarComponent.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const route = useRoute()
const router = useRouter()

const postId = route.params.id

const title = ref('')
const content = ref('')
const selectedCategories = ref([])

const categories = ref([])
const loading = ref(false)
const error = ref(null)

const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/api/categories')
    categories.value = response.data.data
  } catch (e) {
    console.error('Failed to load categories', e)
  }
}

const fetchPost = async () => {
  loading.value = true
  try {
    const response = await apiClient.get(`/api/posts/${postId}`)
    const post = response.data.data
    title.value = post.title
    content.value = post.content
    selectedCategories.value = post.categories.map(title => {
      const match = categories.value.find(c => c.title === title)
      return match?.id
    }).filter(Boolean)
  } catch (e) {
    error.value = 'Failed to load post'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const submitPost = async () => {
  error.value = null
  if (!title.value.trim() || !content.value.trim() || selectedCategories.value.length === 0) {
    error.value = 'Please fill all fields and select at least one category.'
    return
  }

  loading.value = true
  try {
    await apiClient.put(`/api/user/post/${postId}`, {
      user_id: user.value.id,
      title: title.value,
      content: content.value,
      categories: selectedCategories.value,
    })
    router.push('/user')
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to update post'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchPost()
})
</script>