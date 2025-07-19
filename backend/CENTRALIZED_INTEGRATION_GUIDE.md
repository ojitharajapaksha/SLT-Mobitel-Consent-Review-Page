# ConsentHub Centralized Integration Guide

## 🎯 Overview

This guide explains how the SLT-Mobitel-Consent-Review-Page integrates with the centralized ConsentHub system to enable:

1. **Customer Registration** → Centralized ConsentHub database
2. **Customer Dashboard Access** → Login to ConsentHub customer portal  
3. **CSR/Admin Dashboard** → View real customers from centralized database

## 🏗️ Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ Consent Review Page │    │ Registration API    │    │ Centralized         │
│ (Customer Frontend) │───▶│ (Account Service)   │───▶│ ConsentHub System   │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                       │                           │
                                       ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ ConsentHub Frontend │◄───│ Customer Data API   │◄───│ Microservices:      │
│ (Customer/CSR/Admin)│    │ (Data Sync Service) │    │ • party-service     │
└─────────────────────┘    └─────────────────────┘    │ • auth-service      │
                                                       │ • consent-service   │
                                                       │ • preference-service│
                                                       └─────────────────────┘
```

## 🔄 Integration Flow

### Customer Registration Flow
1. Customer fills form on **Consent Review Page**
2. **Registration API** saves to local MongoDB
3. **ConsentHub Service** syncs to centralized system:
   - Creates party in **party-service** (TMF641)
   - Creates user profile in **auth-service** for login
   - Initializes consent in **consent-service** (TMF632)
   - Sets preferences in **preference-service**
4. Customer can now login to **ConsentHub Customer Dashboard**

### Dashboard Data Flow
1. **CSR/Admin Dashboards** call **Customer Data API**
2. **Data Sync Service** fetches from centralized microservices
3. Real customer data displayed in dashboards

## 📁 Implementation Files

### New Files Created

#### Services
- `services/consentHub.service.js` - Centralized ConsentHub integration
- `services/customerDataSync.service.js` - Customer data synchronization

#### Routes  
- `routes/customerData.routes.js` - Customer data API endpoints

#### Updated Files
- `controllers/register.controller.js` - Enhanced with dashboard access info
- `app.js` - Added customer data routes
- `.env` - Centralized service URLs

## ⚙️ Configuration

### Environment Variables

```env
# Centralized ConsentHub Services
PARTY_SERVICE_URL=http://localhost:3009
AUTH_SERVICE_URL=http://localhost:3007
CONSENT_SERVICE_URL=http://localhost:3008
PREFERENCE_SERVICE_URL=http://localhost:3010
INTERNAL_API_KEY=your-secure-api-key

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Service Ports (ConsentHub System)
- **API Gateway**: 3006
- **Auth Service**: 3007  
- **Consent Service**: 3008
- **Party Service**: 3009
- **Preference Service**: 3010
- **CSR Service**: 3011
- **Customer Service**: 3012

## 📊 API Endpoints

### Customer Data API (for CSR/Admin Dashboards)

```
GET /api/v1/customers                    # Get all customers
GET /api/v1/customers/search?q=term     # Search customers
GET /api/v1/customers/stats             # Dashboard statistics
GET /api/v1/customers/:partyId          # Get customer details
PATCH /api/v1/customers/:partyId/status # Update customer status
GET /api/v1/customers/export/csv       # Export to CSV
```

### Registration API (for Customer Registration)

```
POST /api/v1/register                   # Register new customer
```

## 🔧 Service Functions

### ConsentHub Service

```javascript
const { 
  createParty, 
  createUserProfile, 
  initConsent, 
  initPreference, 
  completeIntegration 
} = require('./services/consentHub.service');

// Complete integration (recommended)
const result = await completeIntegration(partyData, consentOptions, preferenceOptions);

// Individual functions
await createParty(partyData);
await createUserProfile(userData);
await initConsent(partyId, options);
await initPreference(partyId, preferences);
```

### Customer Data Sync Service

```javascript
const { 
  getAllCustomers, 
  getCustomerById, 
  searchCustomers, 
  getCustomerStats 
} = require('./services/customerDataSync.service');

// For CSR/Admin dashboards
const customers = await getAllCustomers({status: 'active'}, 1, 50);
const customer = await getCustomerById(partyId);
const stats = await getCustomerStats();
```

## 🖥️ Frontend Integration

### ConsentHub Frontend Updates

To display real customer data in CSR/Admin dashboards, update the frontend services to call the Customer Data API:

```javascript
// In ConsentHub frontend services
const API_BASE = 'http://localhost:5000/api/v1';
const API_KEY = 'your-secure-api-key';

const customerService = {
  async getAllCustomers(page = 1, limit = 50) {
    const response = await fetch(`${API_BASE}/customers?page=${page}&limit=${limit}`, {
      headers: { 'x-api-key': API_KEY }
    });
    return await response.json();
  },

  async searchCustomers(searchTerm) {
    const response = await fetch(`${API_BASE}/customers/search?q=${searchTerm}`, {
      headers: { 'x-api-key': API_KEY }
    });
    return await response.json();
  },

  async getCustomerStats() {
    const response = await fetch(`${API_BASE}/customers/stats`, {
      headers: { 'x-api-key': API_KEY }
    });
    return await response.json();
  }
};
```

### Customer Authentication

Update the ConsentHub authentication to recognize users from consent review:

```javascript
// In ConsentHub AuthContext.tsx
const CUSTOMER_API_BASE = 'http://localhost:5000/api/v1';

// Add to existing login logic
const authenticateCustomer = async (email, password) => {
  // Check if user registered via consent review page
  const response = await fetch(`${CUSTOMER_API_BASE}/customers/search?q=${email}`, {
    headers: { 'x-api-key': API_KEY }
  });
  
  const customerData = await response.json();
  
  if (customerData.success && customerData.data.length > 0) {
    const customer = customerData.data[0];
    
    // Create user object for ConsentHub
    return {
      id: customer.partyId,
      email: customer.email,
      name: customer.name,
      role: 'customer',
      phone: customer.mobile,
      registrationSource: customer.registrationSource
    };
  }
  
  return null;
};
```

## 🚀 Deployment Steps

### 1. Start ConsentHub Backend Services

```bash
cd "project/backend/backend"

# Start each service
cd auth-service && npm start &
cd consent-service && npm start &
cd party-service && npm start &
cd preference-service && npm start &
```

### 2. Start Account Service (Consent Review Backend)

```bash
cd "SLT-Mobitel-Consent-Review-Page/backend"
npm run dev
```

### 3. Start ConsentHub Frontend

```bash
cd "project"
npm run dev
```

### 4. Start Consent Review Frontend

```bash
cd "SLT-Mobitel-Consent-Review-Page"
npm run dev
```

## 📋 Testing Workflow

### 1. Customer Registration Test

```bash
# Register a customer via consent review page
curl -X POST http://localhost:5000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "+94771234567",
    "language": "en"
  }'
```

### 2. Verify Data in ConsentHub Dashboards

```bash
# Check if customer appears in CSR/Admin dashboard data
curl -X GET http://localhost:5000/api/v1/customers \
  -H "x-api-key: your-secure-api-key"

# Search for the customer
curl -X GET "http://localhost:5000/api/v1/customers/search?q=john.doe@example.com" \
  -H "x-api-key: your-secure-api-key"
```

### 3. Customer Dashboard Access Test

1. Go to ConsentHub customer dashboard
2. Try to login with customer email 
3. Should see customer's consent and preference data

## 🔍 Monitoring & Debugging

### Log Locations

- **Registration API**: Console logs with `[ConsentHubService]` prefix
- **Customer Data API**: Console logs with `[CustomerDataSyncService]` prefix
- **Microservices**: Individual service logs

### Debug Commands

```bash
# Check service health
curl http://localhost:5000/api/v1/customers/health

# Validate ConsentHub integration
npm run validate

# Test ConsentHub service
npm run test:consenthub
```

## 🎯 Expected Results

### After Customer Registration
- ✅ Customer saved in local MongoDB
- ✅ Party created in centralized party-service
- ✅ User profile created in auth-service  
- ✅ Default consent initialized in consent-service
- ✅ Preferences set in preference-service
- ✅ Customer can login to ConsentHub dashboard

### CSR/Admin Dashboard
- ✅ Real customers appear in customer lists
- ✅ Search functionality works with real data
- ✅ Customer statistics show accurate counts
- ✅ Customer details show complete information
- ✅ Export functionality works

### Customer Dashboard  
- ✅ Registered customers can login
- ✅ Personal data displays correctly
- ✅ Consent history is visible
- ✅ Preference settings are accessible

## 🔒 Security Considerations

1. **API Key Authentication** - All inter-service calls use API keys
2. **CORS Configuration** - Proper CORS setup for frontend integration
3. **Rate Limiting** - Prevents API abuse
4. **Data Validation** - Input validation at all endpoints
5. **Error Handling** - Graceful error handling without exposing internals

## 📈 Scalability

- **Microservices Architecture** - Each service can scale independently  
- **Database Sharding** - MongoDB can be sharded by customer segments
- **Load Balancing** - API Gateway can distribute load
- **Caching** - Redis can cache frequently accessed data

This integration creates a seamless experience where customers register once via the consent review page and gain access to the full ConsentHub ecosystem!
