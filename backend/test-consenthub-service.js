/**
 * ConsentHub Service Integration Test
 * 
 * This file demonstrates how to use the ConsentHub service for testing
 * and provides examples of individual function usage.
 */

const { createParty, initConsent, initPreference, completeIntegration, healthCheck } = require('./services/consentHub.service');

// Example usage of individual functions
async function testIndividualFunctions() {
  console.log('=== Testing Individual ConsentHub Service Functions ===\n');

  const testPartyId = 'test-party-123';
  const testPartyData = {
    partyId: testPartyId,
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+94771234567',
    language: 'en',
    type: 'individual'
  };

  try {
    // Test 1: Health Check
    console.log('1. Testing ConsentHub health check...');
    const isHealthy = await healthCheck();
    console.log(`ConsentHub health status: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}\n`);

    // Test 2: Create Party
    console.log('2. Testing party creation...');
    const partyResult = await createParty(testPartyData);
    console.log('Party creation result:', partyResult.success ? 'SUCCESS' : 'FAILED');
    console.log('Party data:', partyResult.data);
    console.log('');

    // Test 3: Initialize Consent
    console.log('3. Testing consent initialization...');
    const consentResult = await initConsent(testPartyId, {
      purpose: 'marketing',
      status: 'pending',
      channel: 'email'
    });
    console.log('Consent initialization result:', consentResult.success ? 'SUCCESS' : 'FAILED');
    console.log('Consent ID:', consentResult.consentId);
    console.log('');

    // Test 4: Initialize Preferences
    console.log('4. Testing preference initialization...');
    const preferenceResult = await initPreference(testPartyId, {
      preferredChannels: {
        email: true,
        sms: false,
        push: true
      }
    });
    console.log('Preference initialization result:', preferenceResult.success ? 'SUCCESS' : 'FAILED');
    console.log('Preference ID:', preferenceResult.preferenceId);
    console.log('');

  } catch (error) {
    console.error('Error in individual function testing:', error.message);
  }
}

// Example usage of complete integration
async function testCompleteIntegration() {
  console.log('=== Testing Complete ConsentHub Integration ===\n');

  const testPartyData = {
    partyId: 'integration-test-456',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobile: '+94779876543',
    language: 'en',
    type: 'individual',
    dob: '1990-05-15'
  };

  const consentOptions = {
    purpose: 'service',
    status: 'pending',
    channel: 'email',
    consentType: 'explicit'
  };

  const preferenceOptions = {
    preferredChannels: {
      email: true,
      sms: true,
      push: false
    },
    topicSubscriptions: {
      promotions: false,
      billing: true,
      security: true,
      service: true
    },
    doNotDisturb: {
      enabled: true,
      start: "22:00",
      end: "08:00",
      timezone: "Asia/Colombo"
    }
  };

  try {
    console.log('Starting complete integration test...');
    const result = await completeIntegration(testPartyData, consentOptions, preferenceOptions);
    
    console.log('\n=== Integration Results ===');
    console.log('Overall Success:', result.success);
    console.log('Party ID:', result.partyId);
    console.log('Has Errors:', result.hasErrors);
    
    if (result.results) {
      console.log('\nDetailed Results:');
      console.log('- Party Creation:', result.results.party?.success ? 'SUCCESS' : 'FAILED');
      console.log('- Consent Init:', result.results.consent?.success ? 'SUCCESS' : 'FAILED');
      console.log('- Preferences Init:', result.results.preferences?.success ? 'SUCCESS' : 'FAILED');
      
      if (result.results.errors.length > 0) {
        console.log('\nErrors encountered:');
        result.results.errors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.step}: ${error.error}`);
        });
      }
    }

  } catch (error) {
    console.error('Error in complete integration testing:', error.message);
  }
}

// Example of how to use in a registration controller context
function demonstrateControllerUsage() {
  console.log('\n=== Controller Integration Example ===');
  console.log(`
// In your register.controller.js:

const { createParty, initConsent, initPreference } = require('../services/consentHub.service');

exports.registerCustomer = async (req, res) => {
  try {
    // ... local database save logic ...
    
    const partyPayload = {
      partyId,
      name,
      email,
      mobile,
      language,
      type: 'individual'
    };

    // Option 1: Use individual functions
    await createParty(partyPayload);
    await initConsent(partyId);
    await initPreference(partyId);

    // Option 2: Use complete integration
    const result = await completeIntegration(partyPayload);
    
    res.json({ success: true, data: result });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  `);
}

// Main test runner
async function runTests() {
  console.log('ConsentHub Service Integration Tests\n');
  console.log('=====================================\n');
  
  try {
    await testIndividualFunctions();
    await testCompleteIntegration();
    demonstrateControllerUsage();
    
    console.log('\n=== Test Completion ===');
    console.log('All tests completed. Check the output above for results.');
    
  } catch (error) {
    console.error('Fatal error in test runner:', error.message);
  }
}

// Export for external use
module.exports = {
  testIndividualFunctions,
  testCompleteIntegration,
  runTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
