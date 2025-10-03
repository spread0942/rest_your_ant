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
  },
  {
    path: '/menu/create',
    name: 'MenuCreate',
    component: () => import('../views/MenuCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/menu/:id/edit',
    name: 'MenuEdit',
    component: () => import('../views/MenuCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/plates',
    name: 'PlatesList',
    component: () => import('../views/PlatesList.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/plates/create',
    name: 'PlateCreate',
    component: () => import('../views/PlateCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/plates/:id/edit',
    name: 'PlateEdit',
    component: () => import('../views/PlateCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/plates/:id/products',
    name: 'PlateProducts',
    component: () => import('../views/PlateProducts.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/products',
    name: 'ProductsList',
    component: () => import('../views/ProductsList.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/products/create',
    name: 'ProductCreate',
    component: () => import('../views/ProductCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/products/:id/edit',
    name: 'ProductEdit',
    component: () => import('../views/ProductCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/drinks',
    name: 'DrinksList',
    component: () => import('../views/DrinksList.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/drinks/create',
    name: 'DrinkCreate',
    component: () => import('../views/DrinkCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/drinks/:id/edit',
    name: 'DrinkEdit',
    component: () => import('../views/DrinkCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/orders',
    name: 'OrdersList',
    component: () => import('../views/OrdersList.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/orders/create',
    name: 'OrderCreate',
    component: () => import('../views/OrderCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('../views/OrderDetail.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/orders/:id/edit',
    name: 'OrderEdit',
    component: () => import('../views/OrderCreate.vue'),
    meta: { requiresAuth: true, requiresRestaurant: true }
  },
  {
    path: '/piatti/:category',
    name: 'Piatti',
    component: () => import('../views/Piatti.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/piatto/nuovo',
    name: 'NuovoPiatto',
    component: () => import('../views/ModificaPiatto.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/piatto/:id/modifica',
    name: 'ModificaPiatto',
    component: () => import('../views/ModificaPiatto.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/aree-tavoli',
    name: 'AreeTavoli',
    component: () => import('../views/AreeTavoli.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tavoli/:area',
    name: 'Tavoli',
    component: () => import('../views/Tavoli.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tavolo/:id',
    name: 'TavoloSingolo',
    component: () => import('../views/TavoloSingolo.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/impostazioni',
    name: 'Impostazioni',
    component: () => import('../views/Impostazioni.vue'),
    meta: { requiresAuth: true }
  },
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
