<template>
    <div class="flex flex-wrap items-center gap-4 p-4" @filter="handleFilter">
        <select v-if="categories.length !== 0" v-model="selectedCategory" class="p-2 border rounded">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.title }}
          </option>
        </select>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search posts..."
          class="p-2 border rounded flex-1"
        />
        <button @click="triggerFilter" class="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, watch } from 'vue'
import apiClient from '../plugins/axios'

const emit = defineEmits(['filter'])

const categories = ref([])
const selectedCategory = ref('')
const searchTerm = ref('')

const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/api/categories')
    if (response.status !== 200) throw new Error('Network response was not ok')
    categories.value = response.data.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await fetchCategories()
})

watch([selectedCategory], () => {
  emit('filter', {
    categories: selectedCategory.value,
    search: searchTerm.value,
  })
})

const triggerFilter = () => {
  emit('filter', {
    categories: selectedCategory.value,
    search: searchTerm.value,
  })
}
</script>