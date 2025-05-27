<template>
  <NavbarComponent/>

  <article class="max-w-3xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-2">{{ post?.title }}</h1>
    <div class="text-sm text-gray-600 mb-4">
      By <strong>{{ post?.author }}</strong> |
      Categories: <em>{{ post?.categories.map(c => c).join(', ') }}</em> |
      {{ post?.comments_count }} comments
    </div>
    <div class="mb-8 prose" v-html="post?.content"></div>

    <section class="border-t pt-4">
      <h2 class="text-xl font-semibold mb-4">Comments</h2>

      <ul>
        <li v-for="comment in post?.comments" :key="comment.id" class="mb-4 border-b pb-2">
          <p class="text-sm text-gray-700">{{ comment?.author?.name }} <small class="text-gray-500">- {{ new Date(comment.created_at).toLocaleString() }}</small></p>
          <p>{{ comment?.message }}</p>
          <button
              v-if="comment?.user_id === user?.id"
              @click="deleteComment(comment?.id)"
              class="ml-4 text-red-600 hover:text-red-800 text-xs"
              title="Delete comment"
            >
              Delete
          </button>
        </li>
      </ul>

      <div v-if="post?.comments.length === 0 && !loading" class="text-gray-500">No comments yet.</div>
    </section>

    <section class="mt-6 pt-4">
      <h3 class="text-lg font-semibold mb-2">Add a Comment</h3>
      <textarea
        v-model="newComment"
        rows="4"
        class="w-full border rounded p-2 mb-2"
        placeholder="Write your comment here..."
      ></textarea>
      <div v-if="submitError" class="text-red-500 mb-2">{{ submitError }}</div>
      <button
        @click="submitComment"
        :disabled="submitting"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ submitting ? 'Submitting...' : 'Submit Comment' }}
      </button>
    </section>

  </article>

</template>

<script setup>
import { computed } from 'vue'
import { defineProps, ref, onMounted } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import apiClient from '../plugins/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const props = defineProps({ id: String })
const post = ref(null)
const loading = ref(false)
const error = ref(false)

const newComment = ref('')
const submitError = ref(null)
const submitting = ref(false)

const fetchPost = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const response = await apiClient.get(`/api/posts/${props.id}`)
    if (response.status !== 200) throw new Error('Network response was not ok')
    post.value = response.data.data
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

const submitComment = async () => {
  submitError.value = null
  submitting.value = true

  try {
    const response = await apiClient.post('/api/user/comment', {
      user_id: user?.value?.id,
      post_id: post?.value?.id,
      message: newComment.value
    })
    
    newComment.value = ''
    post?.value?.comments.unshift(response.data.data)
  } catch (e) {
    submitError.value = 'Failed to submit comment'
    console.error(e)
  } finally {
    submitting.value = false
  }
}

const deleteComment = async (commentId) => {
  if (!confirm('Are you sure you want to delete this comment?')) return

  try {
    await apiClient.delete(`/api/user/comment/${commentId}`)
    post.value.comments = post?.value?.comments.filter(c => c.id !== commentId)
  } catch (e) {
    alert('Failed to delete comment')
    console.error(e)
  }
}

onMounted(async () => {
  await fetchPost()
})
</script>