// Test script to verify frontend-backend connection
import { authService } from './src/services/authService.js';

console.log('🔗 Testing Frontend-Backend Connection...');

// Test 1: API Health Check
console.log('\n1. Testing API Health Check...');
const healthCheck = await authService.testConnection();
console.log(`Health Check: ${healthCheck ? '✅ Success' : '❌ Failed'}`);

// Test 2: Try to fetch individuals from backend
console.log('\n2. Testing TMF Individual API...');
try {
  const response = await fetch('http://localhost:3000/tmf-api/party/v5/individual');
  const data = await response.json();
  console.log(`TMF Individual API: ✅ Success (${data.length} individuals found)`);
} catch (error) {
  console.log(`TMF Individual API: ❌ Failed - ${error.message}`);
}

// Test 3: Test sign-in with existing user
console.log('\n3. Testing Sign-In with existing user...');
try {
  const signInResult = await authService.signIn({
    email: 'test@example.com', // This should match an email in your backend
    password: 'testpassword',
    rememberMe: false
  });
  console.log(`Sign-In Test: ${signInResult.success ? '✅ Success' : '❌ Failed'}`);
  if (signInResult.success) {
    console.log(`User: ${signInResult.user?.name} (${signInResult.user?.type})`);
  } else {
    console.log(`Error: ${signInResult.error}`);
  }
} catch (error) {
  console.log(`Sign-In Test: ❌ Failed - ${error.message}`);
}

console.log('\n🎉 Connection test completed!');
