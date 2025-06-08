<template>
  <article class="max-w-3xl mx-auto p-4">
    <div v-if="loading" class="p-4">
      <h3 class="text-xl font-bold mb-2 text-gray-800">{{ $t('loading') }}</h3>
    </div>
    <div v-else>
      <h1 class="text-3xl font-bold mb-2">{{ post?.title }}</h1>
      <div class="text-sm text-gray-600 mb-4">
        {{ $t('by') }} <strong>{{ post?.author }}</strong> |
        {{ $t('categories') }}: <em>{{ post?.categories?.map(c => c).join(', ') }}</em> |
        {{ post?.comments_count }} {{ $t('comments') }}
      </div>
      <div class="mb-8 prose" v-html="post?.content"></div>

      <section class="border-t pt-4">
        <h2 v-if="post?.comments_count !== 0"
          class="text-xl font-semibold mb-4">
          {{ $t('comments') }}
        </h2>
        <ul>
          <li v-for="comment in post?.comments" :key="comment.id" class="mb-4 border-b pb-2">
            <p class="text-sm text-gray-700">
              {{ comment?.author?.name }} <small class="text-gray-500">- {{ new Date(comment.created_at).toLocaleString() }}</small>
            </p>
            <p>{{ comment?.message }}</p>
            <button
              id="deleteComment"
              v-if="comment?.user_id === user?.id"
              @click="removeComment(comment?.id)"
              class="ml-4 text-red-600 hover:text-red-800 text-xs"
              title="Delete comment"
            >
              {{ $t('delete') }}
            </button>
          </li>
        </ul>
        <div v-if="post?.comments_count === 0 && !loading" 
          class="text-gray-500">
          {{ $t('no_comments') }}
        </div>
      </section>

      <section class="mt-6 pt-4">
        <h3 class="text-lg font-semibold mb-2">{{ $t('add_comment') }}</h3>
        <textarea
          id="comment"
          v-model="newComment"
          rows="4"
          class="w-full border rounded p-2 mb-2"
          :placeholder="$t('comment_here')"
        >
        </textarea>
        <div v-if="submitError" class="text-red-500 mb-2">{{ submitError }}</div>
        <button
          id="addComment"
          @click="addComment"
          :disabled="submitting"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ submitting ? $t('submitting') : $t('submit') }}
        </button>
      </section>
    </div>
  </article>
</template>

<script setup>
import { computed, defineProps, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getPost } from '@/services/postService'
import { createComment, deleteComment } from '@/services/userService'

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
  loading.value = true

  try {
    post.value = await getPost(props.id)
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function addComment() {
  submitError.value = null
  submitting.value = true

  try {
    const response = await createComment({
      post_id: post?.value?.id,
      message: newComment.value,
    })
    
    newComment.value = ''
    post?.value?.comments.unshift(response)
    post.value.comments_count++
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

async function removeComment(commentId) {
  try {
    await deleteComment(commentId)
    post.value.comments = post?.value?.comments.filter(c => c.id !== commentId)
    post.value.comments_count--
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await fetchPost()
})
</script>