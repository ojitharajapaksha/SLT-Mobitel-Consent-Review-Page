# MySLT Portal TMF632 Consent Integration Guide

This guide explains how to integrate the TMF632-compliant consent management system into the existing MySLT web portal.

## Overview

The consent management system is designed to be seamlessly integrated into the MySLT portal as middleware that checks and collects user consent before allowing access to portal services. This ensures compliance with TMF632 Party Management standards and data privacy regulations.

## Architecture

```
MySLT Portal Flow:
1. User logs into MySLT Portal (existing authentication)
2. MySLTConsentMiddleware checks for valid consent
3. If no valid consent exists, show consent collection form
4. User provides consent preferences
5. Consent saved to TMF632-compliant backend
6. User proceeds to MySLT portal services
```

## Integration Steps

### 1. Backend API Setup

The TMF632-compliant backend is already configured with the following endpoints:

```
Base URL: http://localhost:3001

Endpoints:
- GET /health - Health check
- POST /tmf-api/consent/v1 - Create consent record
- GET /tmf-api/consent/v1/party/{partyId}/latest - Get latest consent
- GET /tmf-api/consent/v1/party/{partyId} - Get all consents for party
```

**Start the backend:**
```bash
cd "Party Management API"
npm install
npm start
```

### 2. Frontend Integration

#### Option A: React Component Integration (Recommended)

```tsx
import React, { useState, useEffect } from 'react';
import MySLTConsentMiddleware from './components/MySLTConsentMiddleware';

const MySLTPortal = () => {
  const [user, setUser] = useState(null);
  const [showConsent, setShowConsent] = useState(false);
  const [consentComplete, setConsentComplete] = useState(false);

  // Your existing MySLT authentication logic here
  useEffect(() => {
    // Check if user is logged in
    const mySLTUser = getCurrentUser(); // Your existing function
    if (mySLTUser) {
      setUser(mySLTUser);
      setShowConsent(true); // Show consent middleware
    }
  }, []);

  const handleConsentComplete = (consentData) => {
    console.log('Consent collected:', consentData);
    setConsentComplete(true);
    setShowConsent(false);
    // Proceed to main MySLT portal
  };

  if (showConsent && user && !consentComplete) {
    return (
      <MySLTConsentMiddleware
        mySLTUser={{
          id: user.id,
          email: user.email,
          phone: user.phone,
          accountType: user.type, // 'individual' or 'organization'
          name: user.name
        }}
        onConsentComplete={handleConsentComplete}
        onSkip={() => setShowConsent(false)} // Optional skip
        darkMode={false}
      />
    );
  }

  // Your existing MySLT portal components
  return (
    <div>
      <MySLTDashboard user={user} />
      {/* Other MySLT components */}
    </div>
  );
};
```

#### Option B: Standalone Integration

For existing MySLT portals that cannot use React components, you can:

1. **Redirect Flow**: Redirect users to the consent page before main portal
2. **API Integration**: Use the consent API directly from your existing frontend
3. **Iframe Integration**: Embed the consent form as an iframe

### 3. User Data Mapping

Map your existing MySLT user data to the expected format:

```tsx
// Example mapping from MySLT user to consent middleware format
const mapMySLTUser = (mySLTUser) => ({
  id: mySLTUser.customerId || mySLTUser.accountNumber,
  email: mySLTUser.email,
  phone: mySLTUser.mobileNumber,
  accountType: mySLTUser.customerType === 'CORPORATE' ? 'organization' : 'individual',
  name: mySLTUser.customerType === 'CORPORATE' 
    ? mySLTUser.companyName 
    : `${mySLTUser.firstName} ${mySLTUser.lastName}`
});
```

### 4. Consent Data Structure

The system stores consent with the following structure:

```json
{
  "partyId": "customer_id_from_myslt",
  "partyType": "individual|organization",
  "consents": {
    "termsAndPrivacy": true,
    "marketingEmails": false,
    "personalization": true,
    "thirdPartySharing": false,
    "serviceUsageLogs": true
  },
  "consentTimestamp": "2024-01-01T00:00:00.000Z",
  "consentVersion": "1.0",
  "legalBasis": "consent",
  "purpose": "MySLT portal services and TMF632 compliance",
  "dataRetentionPeriod": "7 years",
  "withdrawalMethod": "MySLT portal settings or customer service"
}
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/tmf632-consent
PORT=3001
NODE_ENV=production
```

### CORS Configuration

The backend is configured to allow requests from any origin for development. For production, update the CORS settings in `app.js`:

```javascript
// Production CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://myslt.slt.lk');
  // ... other headers
});
```

## Security Considerations

1. **Authentication**: The middleware expects the user to already be authenticated by MySLT
2. **Session Management**: Consent is tied to the authenticated user session
3. **Data Protection**: No sensitive user data is exposed in the UI
4. **Audit Trail**: All consent actions are logged with timestamps and IP addresses
5. **Withdrawal**: Users can withdraw consent through MySLT portal settings

## Testing

### 1. Start Backend
```bash
cd "Party Management API"
npm start
```

### 2. Start Frontend Demo
```bash
cd project
npm run dev
```

### 3. Test Scenarios
- New user consent collection
- Existing user with valid consent
- Consent expiration (>1 year old)
- Different consent combinations

## Deployment

### Backend Deployment
- Deploy to your preferred cloud platform (AWS, Azure, GCP)
- Configure MongoDB Atlas or your preferred database
- Set up proper CORS for production domains
- Configure SSL/TLS certificates

### Frontend Integration
- Add the consent middleware component to your MySLT portal build
- Update API endpoints to match your production environment
- Configure session management integration

## Compliance Features

### TMF632 Compliance
- ✅ Party Management API structure
- ✅ Standardized consent data model
- ✅ Audit trail and versioning
- ✅ Consent withdrawal mechanisms

### Privacy Compliance
- ✅ Explicit consent collection
- ✅ Granular consent options
- ✅ Clear data usage descriptions
- ✅ Withdrawal instructions
- ✅ Data retention policies

## Support and Maintenance

### Monitoring
- Monitor consent collection rates
- Track consent preferences analytics
- Monitor API health and performance

### Updates
- Consent form content updates
- Legal text updates
- TMF632 specification updates

## API Documentation

### Create Consent
```
POST /tmf-api/consent/v1
Content-Type: application/json

{
  "partyId": "string",
  "partyType": "individual|organization",
  "consents": {
    "termsAndPrivacy": boolean,
    "marketingEmails": boolean,
    "personalization": boolean,
    "thirdPartySharing": boolean,
    "serviceUsageLogs": boolean
  },
  "consentVersion": "string",
  "legalBasis": "string",
  "purpose": "string"
}
```

### Get Latest Consent
```
GET /tmf-api/consent/v1/party/{partyId}/latest

Response:
{
  "_id": "string",
  "partyId": "string",
  "partyType": "string",
  "consents": { ... },
  "consentTimestamp": "ISO date string",
  "ipAddress": "string",
  "userAgent": "string"
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Update backend CORS configuration
2. **Database Connection**: Check MongoDB connection string
3. **User Mapping**: Ensure MySLT user data maps correctly
4. **Session Issues**: Verify authentication integration

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
```

This will log consent interactions and API calls for troubleshooting.
