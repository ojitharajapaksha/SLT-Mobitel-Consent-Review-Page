# 🚀 Render Deployment Guide for SLT-Mobitel-Consent-Review-Page

## 📋 Prerequisites

✅ **Complete System Status:**
- ✅ Frontend: React + TypeScript + Vite + Tailwind CSS
- ✅ Backend: Node.js + Express + MongoDB integration
- ✅ ConsentHub Integration: Full centralized system integration
- ✅ Customer Data API: For CSR/Admin dashboard integration
- ✅ Authentication: JWT-based auth with user profiles
- ✅ Database: MongoDB with Party model and full CRUD operations

## 🌐 Deployment Architecture

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│ Frontend (Render)       │───▶│ Backend API (Render)    │───▶│ MongoDB Atlas (Cloud)   │
│ React + Vite            │    │ Node.js + Express       │    │ Centralized Database    │
│ Static Site             │    │ Web Service             │    │ Managed Database        │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

## 🚀 Deployment Methods

### Method 1: Using render.yaml (Recommended)

1. **Push to GitHub** (if not already done)
2. **Connect to Render** using the `render.yaml` configuration
3. **Set Environment Variables** in Render dashboard
4. **Deploy automatically**

### Method 2: Manual Service Creation

Create services separately in Render dashboard.

## 📝 Step-by-Step Deployment

### 1. 🗂️ GitHub Setup

```bash
# Initialize git repository (if not done)
cd "SLT-Mobitel-Consent-Review-Page"
git init
git add .
git commit -m "Initial commit - Complete ConsentHub integration"
git branch -M main
git remote add origin https://github.com/yourusername/SLT-Mobitel-Consent-Review-Page.git
git push -u origin main
```

### 2. 🍃 MongoDB Atlas Setup

1. **Go to** [MongoDB Atlas](https://cloud.mongodb.com)
2. **Create** a new cluster (Free tier available)
3. **Create** database user with username/password
4. **Get** connection string: `mongodb+srv://username:password@cluster.mongodb.net/consenthub-users`
5. **Whitelist** `0.0.0.0/0` for Render IP ranges

### 3. 🔧 Render Deployment

#### Option A: Blueprint Deployment (render.yaml)

1. **Go to** [Render Dashboard](https://dashboard.render.com)
2. **Click** "New" → "Blueprint"
3. **Connect** your GitHub repository
4. **Select** the repository containing `render.yaml`
5. **Review** the configuration and click "Apply"

#### Option B: Manual Service Creation

**Backend Service:**
1. **Click** "New" → "Web Service"
2. **Connect** your GitHub repository
3. **Configure:**
   - **Name:** `slt-mobitel-consent-review-backend`
   - **Runtime:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `backend`

**Frontend Service:**
1. **Click** "New" → "Static Site"  
2. **Connect** your GitHub repository
3. **Configure:**
   - **Name:** `slt-mobitel-consent-review-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

### 4. 🔑 Environment Variables (Backend)

Set these in Render Backend Service → Environment:

```env
# Required Production Variables
NODE_ENV=production
PORT=10000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/consenthub-users

# Security (Generate strong values)
INTERNAL_API_KEY=generate-secure-32-char-key
JWT_SECRET=generate-secure-jwt-secret-key
SESSION_SECRET=generate-secure-session-secret

# Frontend URL (Will be available after frontend deployment)
FRONTEND_URL=https://your-frontend-app.onrender.com

# ConsentHub Services (Update with actual production URLs)
PARTY_SERVICE_URL=https://consenthub-party-service.onrender.com
AUTH_SERVICE_URL=https://consenthub-auth-service.onrender.com
CONSENT_SERVICE_URL=https://consenthub-consent-service.onrender.com
PREFERENCE_SERVICE_URL=https://consenthub-preference-service.onrender.com

# Optional
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. 🔑 Environment Variables (Frontend)

Set these in Render Frontend Service → Environment:

```env
# Backend API URL (Will be available after backend deployment)
VITE_API_BASE_URL=https://your-backend-api.onrender.com
```

### 6. ✅ Verify Deployment

**Backend Health Check:**
```
GET https://your-backend-api.onrender.com/health
```

**Frontend Access:**
```
https://your-frontend-app.onrender.com
```

**Customer Registration Test:**
```bash
curl -X POST https://your-backend-api.onrender.com/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "test@example.com",
    "mobile": "+94771234567",
    "language": "en"
  }'
```

## 📁 Repository Structure

```
SLT-Mobitel-Consent-Review-Page/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/ (generated)
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── models/
│   ├── package.json
│   └── server.js
├── render.yaml (Blueprint)
└── README.md
```

## 🔧 Build Configuration

### Frontend (Vite)
- **Build Command:** `npm install && npm run build`
- **Output:** `dist/` directory
- **Static Files:** Served by Render CDN

### Backend (Node.js)
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Port:** `process.env.PORT` (Render provides this)

## 🌍 Custom Domain (Optional)

1. **Purchase** domain from provider
2. **Add** custom domain in Render service settings
3. **Update** DNS records to point to Render
4. **SSL** certificate automatically provisioned

## 📊 Expected URLs

After deployment, you'll have:

```
Frontend:  https://slt-mobitel-consent-review-frontend.onrender.com
Backend:   https://slt-mobitel-consent-review-backend.onrender.com
API Base:  https://slt-mobitel-consent-review-backend.onrender.com/api/v1
```

## 🔄 Auto Deployment

- **Automatic** deployment on git push to main branch
- **Build** logs available in Render dashboard
- **Rollback** capability if deployment fails
- **Preview** deployments for pull requests (optional)

## 💰 Pricing (Render)

- **Free Tier:** Available with limitations
- **Starter Plan:** $7/month per service
- **Pro Plans:** Available for high traffic

**Estimated Costs:**
- Frontend (Static): $0-7/month
- Backend (Web Service): $7-25/month  
- MongoDB Atlas: $0-9/month (free tier available)
- **Total:** $7-41/month depending on usage

## 🛠️ Production Optimizations

### Backend Optimizations
```javascript
// Already implemented in the code:
// ✅ Environment-based configuration
// ✅ Production error handling
// ✅ Security headers (helmet)
// ✅ Rate limiting
// ✅ CORS configuration
// ✅ Request logging
// ✅ Health check endpoint
```

### Frontend Optimizations
```javascript
// Vite automatically handles:
// ✅ Code splitting
// ✅ Asset optimization  
// ✅ Tree shaking
// ✅ Minification
// ✅ Static asset optimization
```

## 🔍 Monitoring & Debugging

### Render Dashboard
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory, request stats
- **Events:** Deployment and service events

### Application Monitoring
```javascript
// Health checks available at:
// GET /health - Basic health check
// GET /api/v1/customers/health - Customer API health
```

### Debug Commands
```bash
# Check service status
curl https://your-backend.onrender.com/health

# Test customer registration
curl -X POST https://your-backend.onrender.com/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","mobile":"+94771234567"}'

# Check customer data API
curl -H "x-api-key: your-api-key" \
  https://your-backend.onrender.com/api/v1/customers/stats
```

## 🎯 Production Checklist

### ✅ Pre-Deployment
- ✅ Code tested locally
- ✅ Environment variables configured
- ✅ MongoDB Atlas cluster created
- ✅ GitHub repository set up
- ✅ Domain purchased (optional)

### ✅ Post-Deployment  
- ✅ Health checks passing
- ✅ Customer registration working
- ✅ Database connections established
- ✅ Frontend-backend communication working
- ✅ ConsentHub integration tested
- ✅ Monitoring set up

## 🔄 CI/CD Pipeline

The system includes automatic deployment:

```
GitHub Push → Render Build → Health Check → Live Deployment
     ↓              ↓            ↓              ↓
   Code Update → Install Deps → Test Endpoint → Serve Traffic
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Verify package.json scripts
   - Check node version compatibility

2. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Confirm database user credentials

3. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify API keys are correct

4. **CORS Issues**
   - Update FRONTEND_URL in backend env vars
   - Check CORS configuration in app.js

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **GitHub Issues:** For code-related problems

Your SLT-Mobitel-Consent-Review-Page is fully production-ready with complete frontend, backend, and database integration! 🎉
