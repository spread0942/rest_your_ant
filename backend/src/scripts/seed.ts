import dotenv from 'dotenv';
import sequelize from '../config/database';
import { seedDatabase, clearDatabase } from '../utils/seeder';

// Load environment variables
dotenv.config();

const main = async () => {
  try {
    console.log('🚀 Starting database seeder...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync database
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database synchronized.');

    // Get command line argument
    const command = process.argv[2];

    if (command === 'clear') {
      await clearDatabase();
      console.log('🧹 Database cleared successfully!');
    } else {
      await seedDatabase();
      console.log('🌱 Database seeded successfully!');
    }

    await sequelize.close();
    console.log('👋 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

// Run the seeder
main();
