# 🎯 TMF632 Party Management System

A complete consent and registration flow implementation with TMF632 Party Management API integration.

## 🚀 Quick Deploy (20 minutes)

### 1. Deploy Backend → Railway
👉 **[Click to Deploy](https://railway.app/new)**
- Select this repository
- Set root directory: `Party Management API`
- Add environment variables (see `DEPLOYMENT_CHECKLIST.md`)

### 2. Deploy Frontend → Vercel  
👉 **[Click to Deploy](https://vercel.com/new)**
- Select this repository  
- Keep root directory blank
- Add environment variables with your Railway URL

### 3. Quick URL Update Tool
```bash
node update-urls.js https://your-railway-url.up.railway.app
```

---

## 📋 Documentation

- 📖 **[Full Deployment Guide](DEPLOYMENT.md)** - Complete step-by-step instructions
- ✅ **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Quick checklist format
- 🔗 **[URL Template](URL_TEMPLATE.md)** - Simple copy-paste template
- 📝 **[Environment Variables](.env.example)** - Template with instructions

---

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Consent Flow:** ConsentReviewPage → PartySelectionPage → SignUpPage
- **Authentication:** SignInPage, ForgotPasswordPage
- **UI:** Tailwind CSS with modern design
- **Logo:** SLTMobitel branding integration

### Backend (Node.js + Express + MongoDB)
- **TMF632 Compliance:** Party Management API v5
- **Endpoints:** `/tmf-api/party/v5/individual` and `/tmf-api/party/v5/organization`
- **Database:** MongoDB with mongoose ODM
- **Health Check:** `/health` endpoint for monitoring

---

## 🧪 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd "Party Management API"
npm install
npm start
```

### Environment Variables
Copy `.env.example` to `.env` and update with your URLs.

---

## 🔧 Features

### ✅ Completed
- [x] Consent review and acceptance flow
- [x] Party type selection (Individual/Organization)
- [x] Dynamic registration forms
- [x] TMF632 Party Management API integration
- [x] MongoDB data persistence
- [x] CORS-enabled backend
- [x] Health monitoring endpoint
- [x] Responsive UI with SLTMobitel branding
- [x] Easy deployment configuration

### 🎯 Project Structure
```
├── src/
│   ├── components/          # React components
│   ├── services/           # API integration
│   └── App.tsx            # Main routing
├── Party Management API/   # Backend Express server
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── controllers/       # Business logic
└── deployment files       # Easy deployment helpers
```

---

## 🆘 Troubleshooting

### Common Issues
1. **"Failed to fetch" errors** → Check Railway URL in Vercel environment variables
2. **Backend not starting** → Verify MongoDB connection string
3. **Build failures** → Check all environment variables are set

### Testing Endpoints
- Health: `https://your-railway-url/health`
- Individual API: `https://your-railway-url/tmf-api/party/v5/individual`
- Organization API: `https://your-railway-url/tmf-api/party/v5/organization`

---

## 📞 Support

Check the deployment logs:
- **Railway:** Dashboard → Deployments → View Logs
- **Vercel:** Dashboard → Functions → View Logs  
- **MongoDB:** Atlas → Collections

---

## 🎉 Success Criteria

Your deployment works when:
- ✅ Health check returns OK
- ✅ Frontend loads without errors
- ✅ Registration saves data to MongoDB
- ✅ Complete user flow works end-to-end

**Total deployment time:** ~20 minutes for first-time setup
