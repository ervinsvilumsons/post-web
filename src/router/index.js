import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AuthPage from '@/pages/AuthPage.vue'
import PostShowPage from '@/pages/Post/PostShowPage.vue'
import PostIndexPage from '@/pages/Post/PostIndexPage.vue'
import PostEditorPage from '@/pages/Post/PostEditorPage.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: PostIndexPage,
    meta: { layout: 'auth' },
  },
  {
    path: '/user',
    name: 'User',
    component: PostIndexPage,
    meta: { layout: 'auth' },
  },
  {
    path: '/posts/:id',
    name: 'Post',
    component: PostShowPage,
    meta: { layout: 'auth' },
    props: true,
  },
    {
    path: '/posts/create',
    name: 'CreatePost',
    component: PostEditorPage,
    meta: { layout: 'auth' },
  },
    {
    path: '/posts/edit/:id',
    name: 'EditPost',
    component: PostEditorPage,
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