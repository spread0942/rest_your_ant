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
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

createAdminUser();