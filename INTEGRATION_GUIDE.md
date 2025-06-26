# TMF632 Party Management System - Integration Guide

## Overview

This integration connects the React frontend signup forms with a TMF632-compliant backend API that stores Individual and Organization party data according to TM Forum standards.

## System Architecture

```
Frontend (React + TypeScript)     Backend (Node.js + Express)     Database (MongoDB)
├── SignUpPage.tsx                ├── TMF632 Individual Model      ├── Individual Collection
├── PartySelectionPage.tsx        ├── TMF632 Organization Model    ├── Organization Collection
└── partyManagementService.ts     └── RESTful API Endpoints        └── TMF632 Compliant Schema
```

## Integration Features

### ✅ TMF632 Compliance
- **Individual Parties**: Full TMF632 Individual Party structure with givenName, familyName, contactMedium, etc.
- **Organization Parties**: Complete TMF632 Organization Party structure with name, organizationType, contactMedium, etc.
- **Contact Information**: Structured contactMedium arrays for email, phone, and other contact types
- **Identification Management**: Proper identification documents (passport, business registration, etc.)
- **Status Management**: Party lifecycle status (active, inactive, validated, etc.)

### ✅ Data Transformation
- **Frontend to TMF632**: Automatic transformation of form data to TMF632 format
- **Field Mapping**: firstName/lastName → givenName/familyName
- **Contact Medium**: Email/phone → structured contactMedium arrays
- **Authentication Context**: Password handling with secure hashing

### ✅ Security Features
- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configured for localhost development
- **Data Sanitization**: Clean data storage and retrieval

### ✅ Error Handling
- **Validation Errors**: Detailed field-level validation feedback
- **Duplicate Prevention**: Email uniqueness checking
- **Network Errors**: Proper error messages for connection issues
- **Backend Errors**: TMF632-compliant error responses

## Current Setup Status

### Backend API (Port 3000) ✅ RUNNING
- TMF632-compliant Individual and Organization models
- RESTful API endpoints for CRUD operations
- Validation middleware with comprehensive rules
- MongoDB integration with proper indexing
- Password hashing and security features

### Frontend (Port 5173) ✅ RUNNING
- React signup forms for Individual and Organization
- TypeScript service layer for API communication
- Automatic data transformation to TMF632 format
- Error handling and user feedback
- Dark/light mode support

### MongoDB Integration ⚠️ REQUIRES SETUP
- Default connection: `mongodb://localhost:27017/party-management`
- TMF632-compliant schema with proper validation
- Indexed fields for performance optimization

## API Endpoints

### Individual Party Management
- `POST /tmf-api/party/v5/individual` - Create individual (used by signup)
- `GET /tmf-api/party/v5/individual` - List individuals
- `GET /tmf-api/party/v5/individual/:id` - Get individual details
- `PATCH /tmf-api/party/v5/individual/:id` - Update individual
- `DELETE /tmf-api/party/v5/individual/:id` - Delete individual

### Organization Party Management
- `POST /tmf-api/party/v5/organization` - Create organization (used by signup)
- `GET /tmf-api/party/v5/organization` - List organizations
- `GET /tmf-api/party/v5/organization/:id` - Get organization details
- `PATCH /tmf-api/party/v5/organization/:id` - Update organization
- `DELETE /tmf-api/party/v5/organization/:id` - Delete organization

## Data Flow During Signup

### Individual Signup Flow
1. **User Input**: User fills signup form (firstName, lastName, email, phone, password)
2. **Frontend Validation**: Client-side validation ensures data quality
3. **Data Transformation**: Form data → TMF632 Individual format
4. **API Request**: POST to `/tmf-api/party/v5/individual`
5. **Backend Validation**: Server-side validation using express-validator
6. **Password Hashing**: Secure password hashing with bcrypt
7. **TMF632 Storage**: Individual party stored with proper TMF632 structure
8. **Response**: Individual party ID returned to frontend

### Organization Signup Flow
1. **User Input**: User fills signup form (organizationName, type, contact details)
2. **Frontend Validation**: Client-side validation ensures data quality
3. **Data Transformation**: Form data → TMF632 Organization format
4. **API Request**: POST to `/tmf-api/party/v5/organization`
5. **Backend Validation**: Server-side validation using express-validator
6. **Business Registration**: Optional business registration number handling
7. **TMF632 Storage**: Organization party stored with proper TMF632 structure
8. **Response**: Organization party ID returned to frontend

## TMF632 Data Structure Examples

### Individual Party (TMF632 Format)
```json
{
  "givenName": "John",
  "familyName": "Doe",
  "fullName": "John Doe",
  "status": "active",
  "contactMedium": [
    {
      "mediumType": "email",
      "preferred": true,
      "characteristic": {
        "emailAddress": "john.doe@example.com"
      }
    },
    {
      "mediumType": "phone",
      "preferred": false,
      "characteristic": {
        "phoneNumber": "+1234567890"
      }
    }
  ],
  "authenticationContext": {
    "email": "john.doe@example.com",
    "hashedPassword": "...",
    "agreedToTerms": true,
    "subscribedToNewsletter": false,
    "accountCreationDate": "2025-06-26T07:40:11.946Z"
  }
}
```

### Organization Party (TMF632 Format)
```json
{
  "name": "Acme Corporation",
  "tradingName": "Acme Corp",
  "organizationType": "company",
  "isLegalEntity": true,
  "isHeadOffice": true,
  "status": "active",
  "contactMedium": [
    {
      "mediumType": "email",
      "preferred": true,
      "characteristic": {
        "emailAddress": "contact@acme.com"
      }
    }
  ],
  "organizationIdentification": [
    {
      "identificationType": "businessRegistration",
      "identificationId": "BR123456789",
      "issuingDate": "2025-06-26T07:40:11.946Z"
    }
  ],
  "authenticationContext": {
    "contactEmail": "contact@acme.com",
    "contactPersonName": "John Doe",
    "agreedToTerms": true,
    "subscribedToNewsletter": true,
    "accountCreationDate": "2025-06-26T07:40:11.946Z"
  }
}
```

## Quick Start Guide

### 1. Start MongoDB
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or start MongoDB manually
mongod
```

### 2. Start Backend API
```bash
cd "Party Management API"
npm start
# API available at http://localhost:3000
```

### 3. Start Frontend
```bash
npm run dev
# Frontend available at http://localhost:5173
```

### 4. Test Integration
1. Open http://localhost:5173
2. Navigate to signup page
3. Select Individual or Organization
4. Fill out the form
5. Submit to see TMF632-compliant data creation

## Development Commands

### Backend Development
```bash
cd "Party Management API"
npm run dev          # Start with nodemon for auto-restart
npm start           # Start production server
```

### Frontend Development
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Configuration Files

### Backend Configuration
- `.env` - Environment variables (MongoDB URI, CORS settings)
- `package.json` - Dependencies and scripts
- `app.js` - Express application setup
- `server.js` - Server entry point

### Frontend Configuration
- `.env.local` - Local environment variables
- `vite.config.ts` - Vite configuration
- `src/services/partyManagementService.ts` - API service layer

## Testing the Integration

### Test Individual Creation
```bash
curl -X POST http://localhost:3000/tmf-api/party/v5/individual \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "password": "SecurePassword123",
    "agreeToTerms": true
  }'
```

### Test Organization Creation
```bash
curl -X POST http://localhost:3000/tmf-api/party/v5/organization \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Acme Corp",
    "organizationType": "company",
    "firstName": "John",
    "lastName": "Doe",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "password": "SecurePassword123",
    "agreeToTerms": true
  }'
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend FRONTEND_URL matches frontend URL
2. **MongoDB Connection**: Verify MongoDB is running and connection string is correct
3. **Port Conflicts**: Check if ports 3000 or 5173 are already in use
4. **Validation Errors**: Check browser console for detailed error messages

### Debug Mode
- Backend: Set `NODE_ENV=development` in `.env`
- Frontend: Check browser developer tools console
- MongoDB: Use MongoDB Compass to inspect data

## Next Steps

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Add role-based access control
3. **API Documentation**: Generate OpenAPI/Swagger documentation
4. **Testing**: Add unit and integration tests
5. **Production**: Configure for production deployment

This integration provides a solid foundation for TMF632-compliant party management with modern frontend and backend technologies.
