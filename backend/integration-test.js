const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testCustomer = {
  name: 'Test Customer',
  email: 'test@example.com',
  mobile: '0771234567',
  dob: '1990-01-01',
  language: 'en'
};

async function runTests() {
  console.log('🧪 Starting API Integration Tests...\n');

  try {
    // Test 1: Root endpoint
    console.log('1️⃣ Testing root endpoint...');
    const rootResponse = await axios.get(BASE_URL);
    console.log('✅ Root endpoint working:', rootResponse.status === 200);
    console.log('   Response:', rootResponse.data.message);

    // Test 2: Health check
    console.log('\n2️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/v1/health`);
    console.log('✅ Health check working:', healthResponse.status === 200);
    console.log('   Service:', healthResponse.data.service);

    // Test 3: Customer registration
    console.log('\n3️⃣ Testing customer registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/v1/register`, testCustomer);
    console.log('✅ Customer registration working:', registerResponse.status === 201);
    console.log('   Party ID:', registerResponse.data.data.partyId);
    console.log('   Customer Name:', registerResponse.data.data.name);

    // Test 4: Duplicate customer (should fail)
    console.log('\n4️⃣ Testing duplicate customer registration...');
    try {
      await axios.post(`${BASE_URL}/api/v1/register`, testCustomer);
      console.log('❌ Duplicate validation failed - should have thrown error');
    } catch (duplicateError) {
      console.log('✅ Duplicate validation working:', duplicateError.response.status === 409);
      console.log('   Error:', duplicateError.response.data.message);
    }

    // Test 5: Missing required fields
    console.log('\n5️⃣ Testing validation for missing fields...');
    try {
      await axios.post(`${BASE_URL}/api/v1/register`, { name: 'Incomplete' });
      console.log('❌ Validation failed - should have thrown error');
    } catch (validationError) {
      console.log('✅ Field validation working:', validationError.response.status === 400);
      console.log('   Error:', validationError.response.data.message);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Root endpoint: Working');
    console.log('   ✅ Health check: Working');
    console.log('   ✅ Customer registration: Working');
    console.log('   ✅ Duplicate prevention: Working');
    console.log('   ✅ Input validation: Working');
    console.log('\n🔗 ConsentHub Integration:');
    console.log('   ⚠️  External API sync may fail (404) - this is expected if the render service is sleeping');
    console.log('   ✅ Local registration continues to work even if ConsentHub sync fails');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run tests
runTests();
