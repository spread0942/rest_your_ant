import axios from 'axios';

const HOST = process.env.HOST || 'http://localhost:3000';

// create the admin user
const createAdminUser = async () => {
  try {
    let response = await axios.post(`${HOST}/api/tenants`, {
        name: 'Default Tenant',
        domain: 'default-tenant.com',
    });
    const tenantId = response.data.data.id;
    console.log('✅ Tenant created:', response.data);
    console.log('Tenant id:', tenantId);

    response = await axios.post(`${HOST}/api/accounts`, {
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      role: 'admin',
      tenantId: tenantId
    });
    console.log('✅ Admin user created:', response.data);

    response = await axios.post(`${HOST}/api/accounts/login`, {
      email: "john@example.com",
      password: "password123"
    });
    const token = response.data.data.token;
    console.log('✅ Admin user logged in, token:', token);

    // create a sample restaurant
    response = await axios.post(`${HOST}/api/restaurants`, {
      name: "John's Diner",
      description: "A cozy place for comfort food.",
      address: "123 Main St, Anytown, USA",
      phone: "555-1234",
      website: "http://www.johnsdiner.com",
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    console.log('✅ Sample restaurant created:', response.data);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

createAdminUser();