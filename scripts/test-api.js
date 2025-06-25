// Test script to verify production API connectivity
const https = require('https');
const http = require('http');

// Configuration - replace with your actual URLs
const RAILWAY_URL = process.env.RAILWAY_URL || 'https://party-management-backend-production.up.railway.app';
const VERCEL_URL = process.env.VERCEL_URL || 'https://your-vercel-app.vercel.app';

console.log('🧪 Testing Production API Connectivity...\n');

// Test backend health endpoint
function testBackendHealth() {
  return new Promise((resolve, reject) => {
    const url = `${RAILWAY_URL}/health`;
    console.log(`Testing Backend Health: ${url}`);
    
    const requestHandler = url.startsWith('https') ? https : http;
    
    requestHandler.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Backend Health Check: PASSED');
          console.log(`   Response: ${data}\n`);
          resolve(data);
        } else {
          console.log(`❌ Backend Health Check: FAILED (${res.statusCode})`);
          reject(new Error(`Status: ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      console.log('❌ Backend Health Check: FAILED');
      console.log(`   Error: ${err.message}\n`);
      reject(err);
    });
  });
}

// Test TMF632 API endpoint
function testTMF632API() {
  return new Promise((resolve, reject) => {
    const url = `${RAILWAY_URL}/tmf-api/party/v5/individual`;
    console.log(`Testing TMF632 API: ${url}`);
    
    const requestHandler = url.startsWith('https') ? https : http;
    
    requestHandler.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ TMF632 API: PASSED');
          const parsed = JSON.parse(data);
          console.log(`   Found ${parsed.length} individuals in database\n`);
          resolve(data);
        } else {
          console.log(`❌ TMF632 API: FAILED (${res.statusCode})`);
          reject(new Error(`Status: ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      console.log('❌ TMF632 API: FAILED');
      console.log(`   Error: ${err.message}\n`);
      reject(err);
    });
  });
}

// Test CORS by simulating frontend request
function testCORS() {
  return new Promise((resolve, reject) => {
    const url = `${RAILWAY_URL}/health`;
    console.log(`Testing CORS: ${url}`);
    
    const requestHandler = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Origin': VERCEL_URL,
        'Content-Type': 'application/json'
      }
    };
    
    const req = requestHandler.request(options, (res) => {
      const corsHeader = res.headers['access-control-allow-origin'];
      if (corsHeader && (corsHeader === '*' || corsHeader === VERCEL_URL || corsHeader.includes('vercel.app'))) {
        console.log('✅ CORS Configuration: PASSED');
        console.log(`   Allowed Origin: ${corsHeader}\n`);
        resolve(corsHeader);
      } else {
        console.log('❌ CORS Configuration: FAILED');
        console.log(`   Expected: ${VERCEL_URL}`);
        console.log(`   Got: ${corsHeader}\n`);
        reject(new Error('CORS not configured properly'));
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ CORS Test: FAILED');
      console.log(`   Error: ${err.message}\n`);
      reject(err);
    });
    
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log(`🔗 Backend URL: ${RAILWAY_URL}`);
  console.log(`🌐 Frontend URL: ${VERCEL_URL}\n`);
  
  try {
    await testBackendHealth();
    await testTMF632API();
    await testCORS();
    
    console.log('🎉 All tests passed! Your production setup is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Update environment variables with actual URLs');
    console.log('2. Deploy frontend to Vercel');
    console.log('3. Test authentication flow in production');
    
  } catch (error) {
    console.log('\n❌ Some tests failed. Please check your configuration.');
    console.log('\n🛠️ Troubleshooting:');
    console.log('- Verify Railway backend is deployed and running');
    console.log('- Check environment variables are set correctly');
    console.log('- Ensure CORS is configured for your Vercel domain');
  }
}

// Run the tests
runTests();
