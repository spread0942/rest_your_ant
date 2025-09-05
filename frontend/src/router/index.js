import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  
  if (to.meta.requiresAuth && !token) {
    // Route requires auth but user is not authenticated
    next('/login')
  } else if (to.path === '/login' && token) {
    // User is authenticated but trying to access login page
    next('/dashboard')
  } else {
    // Allow navigation
    next()
  }
})

export default router
