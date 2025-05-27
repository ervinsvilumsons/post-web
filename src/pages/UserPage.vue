<template>
  <NavbarComponent/>
    <div class="max-w-5xl mx-auto py-10 px-4">

      <FilterComponent @filter="handleFilter"/>

      <div class="p-4">
        <router-link to="/posts/create" class="bg-green-600 text-white px-4 py-2 rounded">Create New Post</router-link>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <PostComponent @deleted="removePost" v-for="post in posts" :key="post.id" :post="post" class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"/>

        <div v-if="!loading && posts.length === 0" class="p-4">
          <h3 class="text-xl font-bold mb-2 text-gray-800">No posts</h3>
        </div>
        <div ref="loadTrigger" class="sentinel"></div>

      </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '../plugins/axios'
import FilterComponent from '@/components/FilterComponent.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import PostComponent from '@/components/PostComponent.vue'

const posts = ref([])
const page = ref(1)
const lastPage = ref(null)
const filterParams = ref({})
const loading = ref(false)
const noMore = ref(false)
const loadTrigger = ref(null)
const error = ref(false)

let observer

const fetchPosts = async () => {
  if (loading.value || noMore.value) return
  loading.value = true

  try {
    const response = await apiClient.get('/api/user/posts', {
      params: {
        page: page.value,
        categories: filterParams?.value?.categories,
        search: filterParams?.value?.search
      }
    })
    if (response.status !== 200) throw new Error('Network response was not ok')
    lastPage.value = response.data.meta.last_page

    if (page.value === 1) {
      posts.value = response.data.data
    }
    else {
      posts.value.push(...response.data.data)
    }

    if (page.value !== 1 && lastPage.value == page.value) {
      observer.unobserve(loadTrigger.value)
    }

    page.value++
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

function removePost (postId) {
  posts.value = posts.value.filter(post => post.id !== postId)
}

function handleFilter(filters) {
  filterParams.value = filters
  page.value = 1
  fetchPosts()
  observer.observe(loadTrigger.value)
}

onMounted(async () => {
  await fetchPosts()

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      fetchPosts()
    }
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  })

  if (loadTrigger.value) observer.observe(loadTrigger.value)
})
</script>