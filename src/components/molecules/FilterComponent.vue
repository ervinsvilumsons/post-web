<template>
  <div class="flex flex-wrap items-center gap-4 p-4" @filter="handleFilter">
    <select
      id="categoryFilter" 
      class="p-2 border rounded"
      v-model="selectedCategory"
    >
      <option value="">{{ $t('all_categories') }}</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.title }}
      </option>
      </select>
      <input
        id="searchFilter"
        class="p-2 border rounded flex-1"
        v-model="searchTerm"
        type="text"
        :placeholder="$t('search_posts')"
      />
      <button 
        id="search"
        class="bg-blue-600 text-white px-4 py-2 rounded" 
        @click="triggerFilter"
      >
        {{ $t('search') }}
      </button>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, watch } from 'vue'
import { getCategories } from '@/services/categoryService'

const emit = defineEmits(['filter'])
const categories = ref([])
const selectedCategory = ref('')
const searchTerm = ref('')

async function fetchCategories() {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  fetchCategories()
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