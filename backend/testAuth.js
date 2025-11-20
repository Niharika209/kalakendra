// Simple test script for auth endpoints
async function testAuth() {
  const baseURL = 'http://localhost:5000/api/auth';
  
  console.log('Testing authentication endpoints...\n');
  
  // Test 1: Register
  console.log('1. Testing /register');
  try {
    const registerRes = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`, // unique email
        password: 'test123'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('Status:', registerRes.status);
    console.log('Response:', registerData);
    
    if (registerData.accessToken) {
      console.log('✓ Registration successful!\n');
      
      // Test 2: Login
      console.log('2. Testing /login');
      const loginRes = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.user.email,
          password: 'test123'
        })
      });
      
      const loginData = await loginRes.json();
      console.log('Status:', loginRes.status);
      console.log('Response:', loginData);
      console.log('✓ Login successful!\n');
      
      // Test 3: Get Me (protected route)
      console.log('3. Testing /me (protected)');
      const meRes = await fetch(`${baseURL}/me`, {
        headers: { 
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });
      
      const meData = await meRes.json();
      console.log('Status:', meRes.status);
      console.log('Response:', meData);
      console.log('✓ Protected route works!\n');
      
    } else {
      console.log('✗ Registration failed:', registerData);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

testAuth();
