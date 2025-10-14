const axios = require('axios');

// Replace with your actual Vercel URL
const API_URL = 'https://your-app.vercel.app/api/v1';

async function createAdminUser() {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username: 'admin',
            email: 'admin@primetrade.ai',
            password: 'admin123',
            role: 'admin'
        });
        
        console.log('✅ Admin user created successfully!');
        console.log('Username: admin');
        console.log('Email: admin@primetrade.ai');
        console.log('Password: admin123');
        console.log('Role: admin');
        console.log('Token:', response.data.data.token);
        
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
            console.log('ℹ️  Admin user already exists. You can login with:');
            console.log('Username: admin');
            console.log('Email: admin@primetrade.ai');
            console.log('Password: admin123');
        } else {
            console.error('❌ Error creating admin user:', error.response?.data?.message || error.message);
        }
    }
}

// Also create a regular user
async function createRegularUser() {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'test123',
            role: 'user'
        });
        
        console.log('✅ Regular user created successfully!');
        console.log('Username: testuser');
        console.log('Email: test@example.com');
        console.log('Password: test123');
        console.log('Role: user');
        console.log('Token:', response.data.data.token);
        
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
            console.log('ℹ️  Regular user already exists.');
        } else {
            console.error('❌ Error creating regular user:', error.response?.data?.message || error.message);
        }
    }
}

async function main() {
    console.log('🚀 Creating users for Primetrade.ai API...\n');
    
    await createAdminUser();
    console.log('');
    await createRegularUser();
    
    console.log('\n📝 You can now use these credentials to test the API!');
    console.log('🔗 API Documentation: https://your-app.vercel.app/api-docs');
}

main().catch(console.error);
