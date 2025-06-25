# MySLT Consent Management System - Testing Guide

## Backend & Frontend Integration - Now Fully Functional! 🎉

Your MySLT Consent Management System is now connected to a live MongoDB database and ready for testing.

## What's Working:

### ✅ Backend API (Port 3000)
- **TMF632 Party Management API** running on `http://localhost:3000`
- **MongoDB Database** connected to cloud instance
- **CORS enabled** for frontend communication
- **Authentication endpoints** for secure login/registration
- **Individual & Organization** party creation and management

### ✅ Frontend React App (Port 5173)
- **Authentication UI** with party type selection
- **Registration forms** for both Individual and Organization customers
- **Login system** with real backend authentication
- **Real-time backend status** indicator
- **TMF632 compliant** data collection and display

## Test Users Available:

### Test Individual User:
- **Email:** `john.doe@example.com`
- **Password:** `testpassword123`
- **Type:** Individual Customer

You can also create new users through the registration forms!

## How to Test:

### 1. Test Login Flow:
1. Open `http://localhost:5173` in your browser
2. Click "Individual Customer"
3. Click "Sign In" option
4. Use the test credentials above
5. You should be successfully authenticated with real database data!

### 2. Test Registration Flow:
1. Go to registration page
2. Fill out the form with:
   - **Individual:** First Name, Last Name, Email, Password, Mobile Number, National ID
   - **Organization:** Organization Name, Type, Email, Password, Business Registration Number, Business Phone
3. Submit the form
4. Data will be saved to MongoDB and you'll be logged in automatically

### 3. Backend Status Indicator:
- **Green dot:** Connected to live database
- **Yellow dot:** Demo mode (if backend is down)

## API Endpoints Available:

### Health Check:
```
GET http://localhost:3000/health
```

### Authentication:
```
POST http://localhost:3000/tmf-api/auth/v1/login
POST http://localhost:3000/tmf-api/auth/v1/register
```

### TMF632 Party Management:
```
GET/POST http://localhost:3000/tmf-api/party/v5/individual
GET/POST http://localhost:3000/tmf-api/party/v5/organization
```

## Features Implemented:

### 🏢 TMF632 Compliance:
- Full TMF632 Individual and Organization party models
- Essential data collection only
- Proper contact medium and identification structures
- Party characteristics for secure credential storage

### 🔐 Authentication & Security:
- JWT token-based authentication
- Secure password handling
- Session management with localStorage
- Fallback to demo mode if backend unavailable

### 🎨 Modern UI/UX:
- Dark/Light mode toggle
- Responsive design
- Loading states and error handling
- Real-time backend connection status
- Professional SLT branding

### 📊 Data Management:
- MongoDB cloud database storage
- Real-time CRUD operations
- Validation and error handling
- TMF632 compliant data structures

## Next Steps:

1. **Test the complete flow** with both individual and organization registration
2. **Create multiple test users** to verify database persistence
3. **Implement consent collection** workflow (already have the foundation)
4. **Add party search and management** features
5. **Deploy to production** environment

## Development Commands:

```bash
# Start Backend (in Party Management API folder)
npm start

# Start Frontend (in project root)
npm run dev
```

Your system is now fully functional with backend-frontend integration! 🚀
