<template>
  <div>
    <div class="max-w-3xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">{{ isCreate ? $t('create_post') : $t('edit_post') }}</h1>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold">{{ $t('title') }}</label>
          <input
            v-model="title"
            type="text"
            class="w-full border rounded px-3 py-2"
            :placeholder="$t('title_here')"
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold">{{ $t('content') }}</label>
          <textarea
            v-model="content"
            rows="6"
            class="w-full border rounded px-3 py-2"
            :placeholder="$t('content_here')"
            required
          ></textarea>
        </div>
        <div>
          <label class="block mb-1 font-semibold">{{ $t('categories') }}</label>
          <div class="flex flex-wrap gap-2">
          <label
            v-for="category in categories"
            :key="category.id"
            class="inline-flex items-center space-x-2"
          >
            <input
              type="checkbox"
              :value="category.id"
              v-model="selectedCategories"
              class="form-checkbox"
            />
            <span>{{ category.title }}</span>
          </label>
          </div>
        </div>
        <div v-if="error" class="text-red-600">{{ error }}</div>
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isCreate ? (loading ? $t('creating') : $t('create')) : (loading ? $t('submitting') : $t('submit')) }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategories } from '@/services/categoryService'
import { getPost } from '@/services/postService'
import { createPost, editPost } from '@/services/userService'

const route = useRoute()
const postId = route.params.id
const router = useRouter()
const isCreate = computed(() => route.name === 'CreatePost')
const title = ref('')
const content = ref('')
const selectedCategories = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchCategories() {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error(error)
  }
}

async function fetchPost() {
  loading.value = true
  try {
    const post = getPost(postId)
    title.value = post.title
    content.value = post.content
    selectedCategories.value = post.categories.map(title => {
      const match = categories.value.find(c => c.title === title)
      return match?.id
    }).filter(Boolean)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function submit() {
  loading.value = true
  let params = {
    title: title.value,
    content: content.value,
    categories: selectedCategories.value,
  }

  try {
    if (isCreate.value) {
      const response = await createPost(params)
      router.push({ name: 'EditPost', params: { id: response.id }})
    } else {
      await editPost(params)
    }
  } catch (e) {
    error.value = e.response?.data?.message
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCategories()

  if (!isCreate.value) {
    await fetchPost()
  }
})

</script>