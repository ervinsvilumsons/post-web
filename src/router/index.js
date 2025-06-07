import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AuthPage from '@/pages/AuthPage.vue'
import { default as ShowPost } from '@/pages/Post/ShowPage.vue'
import { default as ShowPosts } from '@/pages/Post/IndexPage.vue'
import { default as PostEditor } from '@/pages/Post/EditorPage.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: ShowPosts,
    meta: { layout: 'auth' },
  },
  {
    path: '/user',
    name: 'User',
    component: ShowPosts,
    meta: { layout: 'auth' },
  },
  {
    path: '/posts/:id',
    name: 'Post',
    component: ShowPost,
    meta: { layout: 'auth' },
    props: true,
  },
    {
    path: '/posts/create',
    name: 'CreatePost',
    component: PostEditor,
    meta: { layout: 'auth' },
  },
    {
    path: '/posts/edit/:id',
    name: 'EditPost',
    component: PostEditor,
    meta: { layout: 'auth' },
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthPage,
    meta: { layout: 'guest' },
  },
  {
    path: '/register',
    name: 'Register',
    component: AuthPage,
    meta: { layout: 'guest' },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.layout === 'auth' && !auth.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.layout === 'guest' && auth.isAuthenticated) {
    next({ name: 'Index' })
  } else {
    next()
  }
})

export default router