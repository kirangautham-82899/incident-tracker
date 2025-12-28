import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/auth/register';

const adminData = {
    name: 'Admin',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
};

async function createAdmin() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Admin account created successfully!');
            console.log('📧 Email:', adminData.email);
            console.log('🔑 Password:', adminData.password);
            console.log('\nYou can now login with these credentials.');
        } else {
            console.log('❌ Failed to create admin:', data.error);
            if (data.error.includes('already exists')) {
                console.log('\n✅ Admin account already exists! Use:');
                console.log('📧 Email:', adminData.email);
                console.log('🔑 Password:', adminData.password);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

createAdmin();
