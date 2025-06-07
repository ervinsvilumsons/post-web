<template>
    <div class="max-w-5xl mx-auto py-10 px-4">
      <FilterComponent @filter="handleFilter"/>
      <div v-if="!isIndexPage" class="p-4">
        <router-link :to="{ name: 'CreatePost' }" class="bg-green-600 text-white px-4 py-2 rounded">{{ $t('create_post') }}</router-link>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PostComponent class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          v-for="post in posts" 
          :key="post.id" 
          :post="post"
          @deleted="removePost"/>
      </div>
      <div v-if="loading && page === 1" class="p-4">
        <h3 class="text-xl font-bold mb-2 text-gray-800">{{ $t('loading') }}</h3>
      </div>
      <div v-if="!loading && posts.length === 0" class="p-4">
        <h3 class="text-xl font-bold mb-2 text-gray-800">{{ $t('no_posts') }}</h3>
      </div>
      <div ref="loadTrigger" class="sentinel"></div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPosts } from '@/services/postService'
import { getPosts as getUserPosts } from '@/services/userService'
import FilterComponent from '@/components/molecules/FilterComponent.vue'
import PostComponent from '@/components/molecules/PostComponent.vue'

const route = useRoute()
const isIndexPage = computed(() => route.name === 'Index')
const posts = ref([])
const page = ref(1)
const lastPage = ref(null)
const filterParams = ref({})
const loading = ref(false)
const noMore = ref(false)
const loadTrigger = ref(null)
const error = ref(false)

let observer

async function fetchPosts() {
  if (loading.value || noMore.value) return

  loading.value = true
  let params = {
    params: {
      page: page.value,
      categories: filterParams?.value?.categories,
      search: filterParams?.value?.search,
    }
  }

  try {
    const response = isIndexPage.value ? await getPosts(params) : await getUserPosts(params)
    loading.value = false
    lastPage.value = response.meta.last_page

    if (page.value === 1) {
      posts.value = response.data
    }
    else {
      posts.value.push(...response.data)
    }

    if (page.value !== 1 && lastPage.value <= page.value) {
      observer.unobserve(loadTrigger.value)
    }

    page.value++
  } catch (e) {
    console.error(e)
    error.value = true
  }
}

function removePost (postId) {
  posts.value = posts.value.filter(post => post.id !== postId)
}

function handleFilter(filters) {
  filterParams.value = filters
  posts.value = []
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

watch(isIndexPage, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    posts.value = []
    page.value = 1
    fetchPosts()
  }
})
</script>
