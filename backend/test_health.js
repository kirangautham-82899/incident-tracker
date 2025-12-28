

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:5000/api';

async function checkService(name, url) {
    try {
        const res = await fetch(url);
        console.log(`✅ ${name} is reachable (${res.status})`);
        return true;
    } catch (e) {
        console.log(`❌ ${name} is NOT reachable: ${e.message}`);
        return false;
    }
}

async function testAuth() {
    console.log('\nTesting Authentication API...');
    const testUser = {
        name: 'Test Auto',
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        role: 'citizen'
    };

    try {
        // Register
        const regRes = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();

        if (regRes.ok) {
            console.log('✅ Registration successful');
        } else {
            console.log('❌ Registration failed:', regData.error);
            return;
        }

        // Login
        const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
            console.log('✅ Login successful');
            console.log(`   Token received: ${loginData.token ? 'Yes' : 'No'}`);
            return loginData.token;
        } else {
            console.log('❌ Login failed:', loginData.error);
        }

    } catch (e) {
        console.log('❌ Auth test error:', e.message);
    }
}

async function runTests() {
    console.log('🚀 Starting System Checks...\n');

    await checkService('Frontend (Vite)', FRONTEND_URL);
    await checkService('Backend API', `${BACKEND_URL}/incidents`); // Utilizing a get route to check connectivity

    await testAuth();

    console.log('\n✨ Test run complete.');
}

runTests();
