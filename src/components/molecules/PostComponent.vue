<template>
  <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h3 class="text-xl font-bold mb-2 text-gray-800">{{ props.post.title }}</h3>
    <p class="text-gray-600 text-sm mb-2 flex justify-between items-center">
      <span>{{ new Date(props.post.created_at).toLocaleDateString('lv') }}</span>
      <span class="text-xs text-gray-500">{{ props.post.comments_count }} {{ $t('comments') }}</span>
    </p>
    <p class="text-gray-600 text-sm mb-2">by {{ props.post.author }}</p>
    <p class="text-gray-600 text-sm mb-4">{{ props.post.content }}</p>
    <div class="flex flex-wrap gap-2 text-xs mb-3">
      <span
        v-for="category in props.post.categories"
        :key="category"
        class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
      >
        {{ category }}
      </span>
    </div>
    <router-link 
      id="readPost"
      class="text-blue-600 hover:underline" 
      :to="{ name: 'Post', params: { id: props.post.id } }"
    >
      {{ $t('read_more') }}
    </router-link>
    <div v-if="props.post.user_id === user.id">
      <router-link 
        id="editPost"
        class="ml-4 text-blue-600 hover:text-blue-800 text-xs" 
        :to="{ name: 'EditPost', params: { id: props.post.id } }"
      >
        {{ $t('edit') }}
      </router-link>
      <button 
        id="deletePost" 
        class="ml-4 text-red-600 hover:text-red-800 text-xs cursor-pointer" 
        @click="removePost(post.id)"
        :title="$t('delete')"
      >
        {{ $t('delete') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { deletePost } from '@/services/userService'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const props = defineProps({ post: Object })
const emit = defineEmits(['deleted'])

async function removePost(postId) {
  try {
    await deletePost(postId)
    emit('deleted', postId)
  } catch (error) {
    console.error(error)
  }
}
</script>