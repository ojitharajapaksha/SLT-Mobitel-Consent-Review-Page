# Consent Management System Integration

This project integrates a React frontend with a Node.js backend for managing party data and consent records.

## Backend Setup

The backend is located in the `Party Management API` folder and includes:

### Models:
- **Individual.js**: Handles individual party data
- **Organization.js**: Handles organization party data  
- **Consent.js**: Handles consent records

### API Endpoints:

#### Individual Endpoints:
- `GET /tmf-api/party/v5/individual` - Get all individuals
- `GET /tmf-api/party/v5/individual/:id` - Get individual by ID
- `POST /tmf-api/party/v5/individual` - Create new individual
- `PUT /tmf-api/party/v5/individual/:id` - Update individual
- `DELETE /tmf-api/party/v5/individual/:id` - Delete individual

#### Organization Endpoints:
- `GET /tmf-api/party/v5/organization` - Get all organizations
- `GET /tmf-api/party/v5/organization/:id` - Get organization by ID
- `POST /tmf-api/party/v5/organization` - Create new organization
- `PUT /tmf-api/party/v5/organization/:id` - Update organization
- `DELETE /tmf-api/party/v5/organization/:id` - Delete organization

#### Consent Endpoints:
- `GET /tmf-api/consent/v1` - Get all consent records
- `POST /tmf-api/consent/v1` - Create new consent record
- `GET /tmf-api/consent/v1/party/:partyId` - Get consent records by party ID
- `GET /tmf-api/consent/v1/party/:partyId/latest` - Get latest consent by party ID
- `PUT /tmf-api/consent/v1/:id` - Update consent record

## Frontend Integration

The React frontend connects to the backend through:

### Services:
- **partyService.ts**: Handles all API communication

### Components:
- **PartySelection.tsx**: Allows users to select individual or organization profiles
- **ConsentReviewPage.tsx**: Displays consent form and handles consent submission

## Data Flow:

1. **Party Selection**: User chooses between Individual or Organization
2. **Profile Selection**: User selects specific party from database
3. **Consent Review**: User reviews and submits consent preferences
4. **Data Storage**: Consent is saved to MongoDB with party association

## Running the System:

### Backend:
```bash
cd "Party Management API"
npm install
npm start
```

### Frontend:
```bash
npm install
npm run dev
```

## Database Records

Your existing MongoDB data:

### Individual Example:
```json
{
  "_id": "68582c9830e9925c9fb4a1d9",
  "givenName": "John",
  "familyName": "Doe", 
  "gender": "male",
  "createdAt": "2025-06-22T16:17:28.749+00:00"
}
```

### Organization Example:
```json
{
  "_id": "6858edb32d9d8bd1b1bed4df",
  "name": "SLT Telecom",
  "organizationType": "company",
  "isLegalEntity": true,
  "createdAt": "2025-06-23T06:01:23.581+00:00"
}
```

### Consent Record Structure:
```json
{
  "partyId": "68582c9830e9925c9fb4a1d9",
  "partyType": "individual",
  "consents": {
    "marketingEmails": false,
    "personalization": true,
    "thirdPartySharing": false,
    "serviceUsageLogs": true,
    "termsAndPrivacy": true
  },
  "consentTimestamp": "2025-06-25T10:30:00.000Z",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

## Features:

- **Dark/Light Mode**: Toggle between themes
- **Party-based Consent**: Links consent to specific individuals/organizations
- **Required vs Optional**: Enforces required consent items
- **API Integration**: Full CRUD operations for all entities
- **Error Handling**: Graceful fallbacks and error messages
- **Responsive Design**: Works on desktop and mobile devices
