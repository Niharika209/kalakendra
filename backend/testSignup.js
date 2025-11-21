import fetch from 'node-fetch';

const testSignup = async () => {
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'learner'
  };

  console.log('🧪 Testing signup with:', testUser.email);

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Signup test PASSED - User created successfully!');
    } else {
      console.log('❌ Signup test FAILED:', data.message);
    }
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testSignup();
