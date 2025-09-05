import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import MenuView from '../views/Menu.vue'
import RestaurantsView from '../views/Restaurants.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/restaurants',
    name: 'Restaurants',
    component: RestaurantsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MenuView,
    meta: { requiresAuth: true, requiresRestaurant: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken')
  const selectedRestaurant = localStorage.getItem('selectedRestaurant')
  
  if (to.meta.requiresAuth && !token) {
    // Route requires auth but user is not authenticated
    next('/login')
  } else if (to.meta.requiresRestaurant && !selectedRestaurant) {
    // Route requires restaurant selection but none is selected
    next('/restaurants')
  } else if (to.path === '/login' && token) {
    // User is authenticated but trying to access login page
    next('/restaurants')
  } else {
    // Allow navigation
    next()
  }
})

export default router
