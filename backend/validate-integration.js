#!/usr/bin/env node

/**
 * ConsentHub Integration Validation Script
 * 
 * This script validates the integration setup and tests connectivity
 * to ConsentHub services. Run this before deploying to production.
 */

require('dotenv').config();
const { healthCheck } = require('./services/consentHub.service');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function validateEnvironment() {
  log('\n=== Environment Configuration Validation ===\n', 'bright');
  
  let isValid = true;
  
  // Check required environment variables
  const requiredVars = {
    'CONSENTHUB_API': process.env.CONSENTHUB_API,
    'INTERNAL_API_KEY': process.env.INTERNAL_API_KEY,
    'MONGO_URI': process.env.MONGO_URI
  };
  
  for (const [varName, value] of Object.entries(requiredVars)) {
    if (!value) {
      logError(`${varName} is not configured`);
      isValid = false;
    } else {
      if (varName === 'INTERNAL_API_KEY' && value.length < 10) {
        logWarning(`${varName} might be too short for production use`);
      } else {
        logSuccess(`${varName} is configured`);
      }
    }
  }
  
  // Check optional but recommended variables
  const optionalVars = {
    'PORT': process.env.PORT || '5000',
    'NODE_ENV': process.env.NODE_ENV || 'development',
    'LOG_LEVEL': process.env.LOG_LEVEL || 'info'
  };
  
  logInfo('\nOptional configurations:');
  for (const [varName, value] of Object.entries(optionalVars)) {
    log(`  ${varName}: ${value}`);
  }
  
  return isValid;
}

async function validateServiceFiles() {
  log('\n=== Service Files Validation ===\n', 'bright');
  
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'services/consentHub.service.js',
    'controllers/register.controller.js',
    'models/Party.js',
    'routes/register.routes.js'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      logSuccess(`${file} exists`);
    } else {
      logError(`${file} is missing`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

async function testConsentHubConnectivity() {
  log('\n=== ConsentHub Connectivity Test ===\n', 'bright');
  
  try {
    logInfo('Testing ConsentHub service health...');
    const isHealthy = await healthCheck();
    
    if (isHealthy) {
      logSuccess('ConsentHub service is reachable and healthy');
      return true;
    } else {
      logWarning('ConsentHub service is not responding to health checks');
      logInfo('This might be normal if the service doesn\'t have a /health endpoint');
      return false;
    }
  } catch (error) {
    logError(`ConsentHub connectivity test failed: ${error.message}`);
    return false;
  }
}

async function validateDependencies() {
  log('\n=== Dependencies Validation ===\n', 'bright');
  
  const requiredPackages = [
    'axios',
    'uuid',
    'express',
    'mongoose',
    'dotenv'
  ];
  
  let allDepsValid = true;
  
  for (const pkg of requiredPackages) {
    try {
      require.resolve(pkg);
      logSuccess(`${pkg} is installed`);
    } catch (error) {
      logError(`${pkg} is not installed`);
      allDepsValid = false;
    }
  }
  
  return allDepsValid;
}

async function generateSampleRequest() {
  log('\n=== Sample Registration Request ===\n', 'bright');
  
  const sampleRequest = {
    method: 'POST',
    url: `http://localhost:${process.env.PORT || 5000}/api/v1/register`,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '+94771234567',
      dob: '1990-01-01',
      language: 'en'
    }
  };
  
  log('You can test the integration with this sample request:\n');
  log('curl -X POST \\');
  log(`  ${sampleRequest.url} \\`, 'blue');
  log('  -H "Content-Type: application/json" \\', 'blue');
  log('  -d \'{', 'blue');
  log('    "name": "John Doe",', 'blue');
  log('    "email": "john.doe@example.com",', 'blue');
  log('    "mobile": "+94771234567",', 'blue');
  log('    "dob": "1990-01-01",', 'blue');
  log('    "language": "en"', 'blue');
  log('  }\'', 'blue');
}

async function main() {
  log('ConsentHub Integration Validation', 'bright');
  log('==================================\n', 'bright');
  
  const results = {
    environment: false,
    files: false,
    dependencies: false,
    connectivity: false
  };
  
  // Run all validations
  results.environment = await validateEnvironment();
  results.files = await validateServiceFiles();
  results.dependencies = await validateDependencies();
  results.connectivity = await testConsentHubConnectivity();
  
  // Summary
  log('\n=== Validation Summary ===\n', 'bright');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  if (passed === total) {
    logSuccess(`All validations passed (${passed}/${total})`);
    logSuccess('Integration is ready for testing!');
  } else {
    logWarning(`${passed}/${total} validations passed`);
    logInfo('Please fix the issues above before proceeding');
  }
  
  // Show detailed results
  for (const [test, result] of Object.entries(results)) {
    const status = result ? '✅' : '❌';
    log(`  ${status} ${test.charAt(0).toUpperCase() + test.slice(1)}`);
  }
  
  await generateSampleRequest();
  
  log('\n=== Next Steps ===\n', 'bright');
  log('1. Fix any validation issues shown above');
  log('2. Start your MongoDB instance');
  log('3. Run: npm run dev');
  log('4. Test the registration endpoint with the sample request');
  log('5. Check the logs for ConsentHub integration results');
}

// Run validation if this script is executed directly
if (require.main === module) {
  main().catch(error => {
    logError(`Validation script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  validateEnvironment,
  validateServiceFiles,
  testConsentHubConnectivity,
  validateDependencies
};
