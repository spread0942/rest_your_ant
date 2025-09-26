import restaurantService from '@/utils/restaurantService.js'

export const restaurantMixin = {
  data() {
    return {
      restaurants: [],
      selectedRestaurant: null,
      restaurantsLoading: true
    }
  },

  async mounted() {
    // Add listener for restaurant changes
    this.restaurantListener = (data) => {
      this.restaurants = data.restaurants
      this.selectedRestaurant = data.selectedRestaurant
      this.restaurantsLoading = false
    }
    
    restaurantService.addListener(this.restaurantListener)
    
    // Load restaurants if not already loaded
    const currentState = restaurantService.getCurrentState()
    if (currentState.loaded) {
      this.restaurants = currentState.restaurants
      this.selectedRestaurant = currentState.selectedRestaurant
      this.restaurantsLoading = false
    } else {
      await restaurantService.loadRestaurants()
    }
  },

  beforeUnmount() {
    // Remove listener to prevent memory leaks
    if (this.restaurantListener) {
      restaurantService.removeListener(this.restaurantListener)
    }
  },

  methods: {
    handleRestaurantChanged(restaurant) {
      restaurantService.setSelectedRestaurant(restaurant)
    },

    async refreshRestaurants() {
      this.restaurantsLoading = true
      await restaurantService.refresh()
    }
  }
}

export default restaurantMixin