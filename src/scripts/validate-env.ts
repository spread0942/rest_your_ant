import dotenv from 'dotenv';
import { Client } from 'pg';

// Load environment variables
dotenv.config();

interface ValidationResult {
  isValid: boolean;
  message: string;
  value?: string;
}

/**
 * Validate environment variables
 */
const validateEnvironment = (): ValidationResult[] => {
  const results: ValidationResult[] = [];
  
  const requiredVars = [
    'DB_HOST',
    'DB_PORT', 
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'PORT'
  ];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      results.push({
        isValid: false,
        message: `❌ Missing required environment variable: ${varName}`
      });
    } else {
      results.push({
        isValid: true,
        message: `✅ ${varName} is set`,
        value: varName === 'DB_PASSWORD' || varName === 'JWT_SECRET' ? '***' : value
      });
    }
  });
  
  return results;
};

/**
 * Test database connection
 */
const testDatabaseConnection = async (): Promise<ValidationResult> => {
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    
    await client.connect();
    await client.query('SELECT NOW()');
    await client.end();
    
    return {
      isValid: true,
      message: '✅ Database connection successful'
    };
  } catch (error) {
    return {
      isValid: false,
      message: `❌ Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Main validation function
 */
const main = async () => {
  console.log('🔍 Validating Restaurant API Environment');
  console.log('=========================================\n');
  
  // Validate environment variables
  console.log('📋 Environment Variables:');
  const envResults = validateEnvironment();
  envResults.forEach(result => {
    console.log(result.message, result.value ? `(${result.value})` : '');
  });
  
  const envValid = envResults.every(result => result.isValid);
  
  if (!envValid) {
    console.log('\n❌ Environment validation failed. Please check your .env file.');
    process.exit(1);
  }
  
  // Test database connection
  console.log('\n🗄️  Database Connection:');
  const dbResult = await testDatabaseConnection();
  console.log(dbResult.message);
  
  if (!dbResult.isValid) {
    console.log('\n❌ Database connection failed. Please check your database settings.');
    process.exit(1);
  }
  
  console.log('\n🎉 Environment validation passed! Ready to start the API.');
  console.log('💡 Run: npm run dev');
};

// Run validation
main().catch(error => {
  console.error('❌ Validation error:', error);
  process.exit(1);
});
