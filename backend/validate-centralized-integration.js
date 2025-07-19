/**
 * Centralized ConsentHub Integration Validation Script
 * 
 * This script validates the integration between the consent review page
 * and the centralized ConsentHub system
 */

require('dotenv').config();
const axios = require('axios');
const { consentHubService } = require('./services/consentHub.service');
const { customerDataSyncService } = require('./services/customerDataSync.service');

// Test configuration
const TEST_CUSTOMER = {
  partyId: 'test-integration-' + Date.now(),
  name: 'Integration Test Customer',
  email: `test-${Date.now()}@integration.test`,
  mobile: '+94771234567',
  language: 'en',
  type: 'individual'
};

console.log('ConsentHub Centralized Integration Validation');
console.log('=============================================');

async function validateEnvironmentConfig() {
  console.log('\n=== Environment Configuration Validation ===');
  
  const requiredEnvVars = [
    'PARTY_SERVICE_URL',
    'AUTH_SERVICE_URL', 
    'CONSENT_SERVICE_URL',
    'PREFERENCE_SERVICE_URL',
    'INTERNAL_API_KEY'
  ];

  const missingVars = [];
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log(`\n⚠️  Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  console.log('\n✅ All required environment variables are configured');
  return true;
}

async function validateServiceConnectivity() {
  console.log('\n=== Service Connectivity Validation ===');
  
  const services = [
    { name: 'Party Service', url: process.env.PARTY_SERVICE_URL },
    { name: 'Auth Service', url: process.env.AUTH_SERVICE_URL },
    { name: 'Consent Service', url: process.env.CONSENT_SERVICE_URL },
    { name: 'Preference Service', url: process.env.PREFERENCE_SERVICE_URL }
  ];

  const results = [];

  for (const service of services) {
    try {
      console.log(`ℹ️  Testing ${service.name} connectivity...`);
      
      const response = await axios.get(`${service.url}/health`, {
        timeout: 5000,
        headers: {
          'x-api-key': process.env.INTERNAL_API_KEY
        }
      });

      if (response.status === 200) {
        console.log(`✅ ${service.name} is responding`);
        results.push(true);
      } else {
        console.log(`⚠️  ${service.name} responded with status: ${response.status}`);
        results.push(false);
      }
    } catch (error) {
      console.log(`❌ ${service.name} connection failed: ${error.message}`);
      results.push(false);
    }
  }

  const allConnected = results.every(result => result);
  
  if (allConnected) {
    console.log('\n✅ All services are reachable');
  } else {
    console.log('\n⚠️  Some services are not reachable - this may affect integration');
  }

  return allConnected;
}

async function validateConsentHubService() {
  console.log('\n=== ConsentHub Service Integration Test ===');

  try {
    console.log('ℹ️  Testing ConsentHub service health check...');
    const healthStatus = await consentHubService.healthCheck();
    
    console.log('Health Check Results:');
    console.log(`- Overall Status: ${healthStatus.overall ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    
    Object.entries(healthStatus.services).forEach(([service, status]) => {
      console.log(`- ${service}: ${status ? '✅ UP' : '❌ DOWN'}`);
    });

    if (healthStatus.errors.length > 0) {
      console.log('\nErrors encountered:');
      healthStatus.errors.forEach(error => console.log(`  - ${error}`));
    }

    return healthStatus.overall;

  } catch (error) {
    console.error('❌ ConsentHub service test failed:', error.message);
    return false;
  }
}

async function validateCustomerDataSync() {
  console.log('\n=== Customer Data Sync Service Test ===');

  try {
    console.log('ℹ️  Testing customer data synchronization...');

    // Test get all customers
    console.log('1. Testing getAllCustomers...');
    const customersResult = await customerDataSyncService.getAllCustomers({}, 1, 5);
    
    if (customersResult.success) {
      console.log(`✅ Successfully retrieved ${customersResult.data.length} customers`);
    } else {
      console.log('❌ Failed to retrieve customers');
      return false;
    }

    // Test customer statistics
    console.log('2. Testing getCustomerStats...');
    const statsResult = await customerDataSyncService.getCustomerStats();
    
    if (statsResult.success) {
      console.log('✅ Successfully retrieved customer statistics');
      console.log(`   - Total Customers: ${statsResult.data.totalCustomers}`);
      console.log(`   - Active Customers: ${statsResult.data.activeCustomers}`);
    } else {
      console.log('⚠️  Customer statistics retrieval had issues, but continuing...');
    }

    return true;

  } catch (error) {
    console.error('❌ Customer data sync test failed:', error.message);
    return false;
  }
}

async function testFullIntegration() {
  console.log('\n=== Full Integration Test ===');
  console.log(`ℹ️  Testing complete customer registration flow...`);
  console.log(`Test Customer: ${TEST_CUSTOMER.email}`);

  try {
    // Test complete integration
    const integrationResult = await consentHubService.completeIntegration(
      TEST_CUSTOMER,
      { purpose: 'marketing', status: 'pending' },
      { preferredChannels: { email: true, sms: false } }
    );

    console.log('\nIntegration Results:');
    console.log(`- Overall Success: ${integrationResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`- Party ID: ${integrationResult.partyId}`);
    console.log(`- Has Errors: ${integrationResult.hasErrors ? 'YES' : 'NO'}`);
    
    if (integrationResult.dashboardAccess) {
      console.log(`- Dashboard Access: ${integrationResult.dashboardAccess.canLogin ? '✅ ENABLED' : '❌ DISABLED'}`);
      console.log(`- Firebase UID: ${integrationResult.dashboardAccess.firebaseUid || 'N/A'}`);
    }

    if (integrationResult.results) {
      console.log('\nDetailed Results:');
      console.log(`- Party Creation: ${integrationResult.results.party?.success ? '✅' : '❌'}`);
      console.log(`- User Profile: ${integrationResult.results.userProfile?.success ? '✅' : '❌'}`);
      console.log(`- Consent Init: ${integrationResult.results.consent?.success ? '✅' : '❌'}`);
      console.log(`- Preferences Init: ${integrationResult.results.preferences?.success ? '✅' : '❌'}`);
      
      if (integrationResult.results.errors.length > 0) {
        console.log('\nErrors encountered:');
        integrationResult.results.errors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.step}: ${error.error}`);
        });
      }
    }

    return integrationResult.success;

  } catch (error) {
    console.error('❌ Full integration test failed:', error.message);
    return false;
  }
}

async function validateApiEndpoints() {
  console.log('\n=== API Endpoints Validation ===');
  
  const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
  const apiKey = process.env.INTERNAL_API_KEY;

  const endpoints = [
    { method: 'GET', path: '/api/v1/customers/health', description: 'Customer Data API Health' },
    { method: 'GET', path: '/api/v1/customers/stats', description: 'Customer Statistics' },
    { method: 'GET', path: '/health', description: 'Register API Health' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`ℹ️  Testing ${endpoint.method} ${endpoint.path}...`);
      
      const config = {
        method: endpoint.method,
        url: `${baseUrl}${endpoint.path}`,
        timeout: 5000
      };

      if (endpoint.path.includes('/customers/')) {
        config.headers = { 'x-api-key': apiKey };
      }

      const response = await axios(config);
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint.description} - OK`);
        results.push(true);
      } else {
        console.log(`⚠️  ${endpoint.description} - Status: ${response.status}`);
        results.push(false);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`⚠️  ${endpoint.description} - Server not running`);
      } else {
        console.log(`❌ ${endpoint.description} - Error: ${error.message}`);
      }
      results.push(false);
    }
  }

  const allWorking = results.every(result => result);
  
  if (allWorking) {
    console.log('\n✅ All API endpoints are working');
  } else {
    console.log('\n⚠️  Some API endpoints are not responding - start the server with `npm run dev`');
  }

  return allWorking;
}

async function generateSummaryReport() {
  console.log('\n=== Validation Summary Report ===');
  
  const validations = [
    { name: 'Environment Configuration', test: validateEnvironmentConfig },
    { name: 'Service Connectivity', test: validateServiceConnectivity },
    { name: 'ConsentHub Service', test: validateConsentHubService },
    { name: 'Customer Data Sync', test: validateCustomerDataSync },
    { name: 'API Endpoints', test: validateApiEndpoints },
    { name: 'Full Integration', test: testFullIntegration }
  ];

  const results = {};
  let passedCount = 0;

  for (const validation of validations) {
    try {
      const result = await validation.test();
      results[validation.name] = result;
      if (result) passedCount++;
    } catch (error) {
      results[validation.name] = false;
      console.error(`Error in ${validation.name}:`, error.message);
    }
  }

  console.log(`\n📊 Validation Results: ${passedCount}/${validations.length} passed`);
  console.log('─'.repeat(50));
  
  Object.entries(results).forEach(([name, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });

  console.log('\n=== Next Steps ===');
  
  if (passedCount === validations.length) {
    console.log('🎉 All validations passed! Your integration is ready.');
    console.log('\nTo test the complete workflow:');
    console.log('1. Start the ConsentHub backend services');
    console.log('2. Start this account service: npm run dev');
    console.log('3. Start the ConsentHub frontend');
    console.log('4. Register a customer via the consent review page');
    console.log('5. Check that they appear in CSR/Admin dashboards');
    console.log('6. Verify they can login to customer dashboard');
  } else {
    console.log('⚠️  Some validations failed. Please address the issues above.');
    console.log('\nCommon solutions:');
    console.log('- Start the ConsentHub backend services');
    console.log('- Check environment variable configuration');
    console.log('- Verify API keys are correct');
    console.log('- Ensure MongoDB is running');
  }
}

// Main execution
async function runValidation() {
  try {
    await generateSummaryReport();
  } catch (error) {
    console.error('Fatal error during validation:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runValidation();
}

module.exports = {
  validateEnvironmentConfig,
  validateServiceConnectivity,
  validateConsentHubService,
  validateCustomerDataSync,
  testFullIntegration,
  validateApiEndpoints,
  runValidation
};
