import bcrypt from 'bcryptjs';
import { Account, Restaurant, Menu, Plate, Product, Drink, Table, Tenant } from '../models';

/**
 * Seed the database with initial data for development
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if data already exists
    const accountCount = await Account.count();
    if (accountCount > 0) {
      console.log('📝 Database already contains data. Skipping seeding.');
      return;
    }
    
    const tenant = await Tenant.create({
      name: 'Admin Tenant',
      domain: 'admin-tenant.com'
    });

    console.log('✅ Admin tenant created');

    // Create admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminAccount = await Account.create({
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      role: 'admin',
      tenantId: tenant.id
    });

    console.log('✅ Admin account created');

    // Create sample restaurant
    const restaurant = await Restaurant.create({
      name: 'Sample Restaurant',
      address: '123 Main Street, City, State 12345',
      phone: '+1-555-0123',
      email: 'info@samplerestaurant.com',
      description: 'A beautiful sample restaurant for testing',
      website: 'https://www.samplerestaurant.com',
      tenantId: tenant.id,
    });

    console.log('✅ Sample restaurant created');

    // Create sample products
    const products = await Product.bulkCreate([
      {
        name: 'Chicken Breast',
        description: 'Fresh chicken breast',
        unit: 'kg',
        price: 12.50,
        stock: 100,
        minStock: 10,
        restaurantId: restaurant.id
      },
      {
        name: 'Tomatoes',
        description: 'Fresh tomatoes',
        unit: 'kg',
        price: 3.20,
        stock: 50,
        minStock: 5,
        restaurantId: restaurant.id
      },
      {
        name: 'Mozzarella Cheese',
        description: 'Fresh mozzarella cheese',
        unit: 'kg',
        price: 8.75,
        stock: 25,
        minStock: 3,
        restaurantId: restaurant.id
      },
      {
        name: 'Pasta',
        description: 'Italian pasta',
        unit: 'kg',
        price: 2.40,
        stock: 80,
        minStock: 10,
        restaurantId: restaurant.id
      }
    ]);

    console.log('✅ Sample products created');

    // Create sample plates
    const plates = await Plate.bulkCreate([
      {
        name: 'Grilled Chicken',
        description: 'Delicious grilled chicken with herbs',
        price: 18.99,
        category: 'main',
        isAvailable: true
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh caesar salad with parmesan',
        price: 12.99,
        category: 'salad',
        isAvailable: true
      },
      {
        name: 'Pasta Marinara',
        description: 'Classic pasta with marinara sauce',
        price: 15.99,
        category: 'main',
        isAvailable: true
      }
    ]);

    console.log('✅ Sample plates created');

    // Create sample drinks
    const drinks = await Drink.bulkCreate([
      {
        name: 'Coca Cola',
        description: 'Classic Coca Cola',
        price: 2.99,
        category: 'soft_drink',
        isAlcoholic: false,
        isAvailable: true,
        restaurantId: restaurant.id
      },
      {
        name: 'House Wine',
        description: 'Red house wine',
        price: 8.99,
        category: 'wine',
        isAlcoholic: true,
        isAvailable: true,
        restaurantId: restaurant.id
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 4.99,
        category: 'juice',
        isAlcoholic: false,
        isAvailable: true,
        restaurantId: restaurant.id
      }
    ]);

    console.log('✅ Sample drinks created');

    // Create sample tables
    await Table.bulkCreate([
      {
        number: 1,
        capacity: 4,
        status: 'available',
        restaurantId: restaurant.id
      },
      {
        number: 2,
        capacity: 2,
        status: 'available',
        restaurantId: restaurant.id
      },
      {
        number: 3,
        capacity: 6,
        status: 'available',
        restaurantId: restaurant.id
      },
      {
        number: 4,
        capacity: 4,
        status: 'available',
        restaurantId: restaurant.id
      }
    ]);

    console.log('✅ Sample tables created');

    // Create sample menu
    const menu = await Menu.create({
      name: 'Main Menu',
      description: 'Our main dining menu',
      category: 'main',
      isActive: true,
      restaurantId: restaurant.id
    });

    console.log('✅ Sample menu created');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📧 Admin login: admin@restaurant.com / admin123`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

/**
 * Clear all data from the database
 */
export const clearDatabase = async (): Promise<void> => {
  try {
    console.log('🧹 Clearing database...');
    
    // Clear in reverse order to avoid foreign key constraints
    await Account.destroy({ truncate: true, cascade: true });
    await Restaurant.destroy({ truncate: true, cascade: true });
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};
