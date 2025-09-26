import api from '@/config/api.js'

class RestaurantService {
  constructor() {
    this.restaurants = []
    this.selectedRestaurant = null
    this.listeners = []
    this.loaded = false
  }

  // Add a listener for when restaurants or selected restaurant changes
  addListener(callback) {
    this.listeners.push(callback)
  }

  // Remove a listener
  removeListener(callback) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        restaurants: this.restaurants,
        selectedRestaurant: this.selectedRestaurant
      })
    })
  }

  // Load restaurants from API
  async loadRestaurants() {
    if (this.loaded) {
      return { restaurants: this.restaurants, selectedRestaurant: this.selectedRestaurant }
    }

    try {
      const response = await api.get('/restaurants')
      
      if (response.success) {
        this.restaurants = response.data.restaurants
        
        // Load selected restaurant from localStorage
        const savedRestaurant = localStorage.getItem('selectedRestaurant')
        if (savedRestaurant) {
          try {
            const parsed = JSON.parse(savedRestaurant)
            // Check if the saved restaurant still exists
            const exists = this.restaurants.find(r => r.id === parsed.id)
            if (exists) {
              this.selectedRestaurant = parsed
            } else if (this.restaurants.length > 0) {
              // If saved restaurant doesn't exist, select the first available
              this.selectedRestaurant = this.restaurants[0]
              localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
            }
          } catch (e) {
            console.warn('Error parsing saved restaurant:', e)
            if (this.restaurants.length > 0) {
              this.selectedRestaurant = this.restaurants[0]
              localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
            }
          }
        } else if (this.restaurants.length > 0) {
          // No saved restaurant, select the first one
          this.selectedRestaurant = this.restaurants[0]
          localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
        }

        this.loaded = true
        this.notifyListeners()
        
        return { restaurants: this.restaurants, selectedRestaurant: this.selectedRestaurant }
      } else {
        throw new Error('Failed to fetch restaurants: ' + response.message)
      }
    } catch (error) {
      console.error('Error loading restaurants:', error)
      this.restaurants = []
      this.selectedRestaurant = null
      this.notifyListeners()
      return { restaurants: [], selectedRestaurant: null }
    }
  }

  // Select a restaurant
  setSelectedRestaurant(restaurant) {
    this.selectedRestaurant = restaurant
    localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant))
    this.notifyListeners()
  }

  // Get current state
  getCurrentState() {
    return {
      restaurants: this.restaurants,
      selectedRestaurant: this.selectedRestaurant,
      loaded: this.loaded
    }
  }

  // Refresh restaurants (for when new restaurants are added)
  async refresh() {
    this.loaded = false
    return await this.loadRestaurants()
  }

  // Update the service with already loaded restaurant data
  updateRestaurants(restaurants) {
    this.restaurants = restaurants
    this.loaded = true
    
    // Handle selected restaurant initialization if needed
    if (!this.selectedRestaurant && restaurants.length > 0) {
      const savedRestaurant = localStorage.getItem('selectedRestaurant')
      if (savedRestaurant) {
        try {
          const parsed = JSON.parse(savedRestaurant)
          const exists = this.restaurants.find(r => r.id === parsed.id)
          if (exists) {
            this.selectedRestaurant = parsed
          } else {
            this.selectedRestaurant = this.restaurants[0]
            localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
          }
        } catch (e) {
          this.selectedRestaurant = this.restaurants[0]
          localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
        }
      } else {
        this.selectedRestaurant = this.restaurants[0]
        localStorage.setItem('selectedRestaurant', JSON.stringify(this.restaurants[0]))
      }
    }
    
    this.notifyListeners()
  }
}

// Create a singleton instance
const restaurantService = new RestaurantService()

export default restaurantService