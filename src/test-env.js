// Quick test to verify environment variables are working
console.log('🔍 Environment Variables Check:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_HEALTH_URL:', import.meta.env.VITE_HEALTH_URL);
console.log('VITE_TMF_API_BASE_URL:', import.meta.env.VITE_TMF_API_BASE_URL);
console.log('VITE_CONSENT_API_URL:', import.meta.env.VITE_CONSENT_API_URL);

// Test actual connection
async function testConnection() {
  try {
    const healthUrl = import.meta.env.VITE_HEALTH_URL || 'http://localhost:3000/health';
    console.log('🧪 Testing connection to:', healthUrl);
    
    const response = await fetch(healthUrl);
    const data = await response.json();
    
    console.log('✅ Connection successful!', data);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
