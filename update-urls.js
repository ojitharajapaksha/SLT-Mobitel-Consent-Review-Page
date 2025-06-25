#!/usr/bin/env node

/**
 * Railway URL Replacer Script
 * 
 * This script helps you quickly update all environment variables
 * with your new Railway deployment URL.
 * 
 * Usage:
 * node update-urls.js https://your-new-railway-url.up.railway.app
 */

const fs = require('fs');
const path = require('path');

function updateEnvFile() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🔗 Railway URL Replacer');
        console.log('');
        console.log('Usage: node update-urls.js <your-railway-url>');
        console.log('');
        console.log('Example:');
        console.log('  node update-urls.js https://my-party-api.up.railway.app');
        console.log('');
        console.log('This will generate the environment variables you need for Vercel.');
        return;
    }

    const railwayUrl = args[0].replace(/\/$/, ''); // Remove trailing slash
    
    console.log('🚀 Generating environment variables for Vercel...');
    console.log('');
    console.log('Copy and paste these into your Vercel environment variables:');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`VITE_API_BASE_URL=${railwayUrl}`);
    console.log(`VITE_HEALTH_URL=${railwayUrl}/health`);
    console.log(`VITE_TMF_API_BASE_URL=${railwayUrl}/tmf-api/party/v5`);
    console.log(`VITE_CONSENT_API_URL=${railwayUrl}/tmf-api/consent/v1`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('✅ Ready to paste into Vercel!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to your Vercel project settings');
    console.log('2. Navigate to Environment Variables');
    console.log('3. Add each variable above');
    console.log('4. Redeploy your frontend');
    console.log('');
    console.log(`🧪 Test your backend: ${railwayUrl}/health`);
}

updateEnvFile();
