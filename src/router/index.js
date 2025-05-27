import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import IndexPage from '@/pages/IndexPage.vue'
import UserPage from '@/pages/UserPage.vue'
import PostPage from '@/pages/PostPage.vue'
import CreatePostPage from '@/pages/CreatePostPage.vue'
import EditPostPage from '@/pages/EditPostPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: IndexPage
  },
  {
    path: '/posts/:id',
    name: 'Post',
    component: PostPage,
    props: true
  },
    {
    path: '/posts/create',
    name: 'CreatePost',
    component: CreatePostPage,
  },
    {
    path: '/posts/edit/:id',
    name: 'EditPost',
    component: EditPostPage,
    props: true
  },
  {
    path: '/user',
    name: 'User',
    component: UserPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !auth.isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router