# Production Deployment Guide

## 🚀 Deploying to Vercel (Frontend) and Railway (Backend)

### Prerequisites
- Vercel account and CLI installed
- Railway account and CLI installed
- Your Railway backend URL
- Your Vercel frontend URL

### 🔧 Backend Deployment (Railway)

1. **Update Railway Environment Variables:**
   ```bash
   # Set these in your Railway dashboard or via CLI
   MONGO_URI=mongodb+srv://consentuser:12345@consentcluster.ylmrqgl.mongodb.net/PrivacyManagement?retryWrites=true&w=majority&appName=ConsentCluster
   PORT=3000
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```

2. **Deploy Backend:**
   ```bash
   # Navigate to backend directory
   cd "Party Management API"
   
   # Deploy to Railway
   railway login
   railway up
   ```

3. **Note your Railway URL** (e.g., `https://your-app.railway.app`)

### 🌐 Frontend Deployment (Vercel)

1. **Update Environment Variables in Vercel:**
   Go to your Vercel dashboard > Project > Settings > Environment Variables and add:
   
   ```
   VITE_API_BASE_URL=https://party-management-backend-production.up.railway.app
   VITE_HEALTH_URL=https://party-management-backend-production.up.railway.app/health
   VITE_TMF_API_BASE_URL=https://party-management-backend-production.up.railway.app/tmf-api/party/v5
   VITE_CONSENT_API_URL=https://party-management-backend-production.up.railway.app/tmf-api/consent/v1
   ```

2. **Build and Deploy:**
   ```bash
   # Install dependencies
   npm install
   
   # Build for production
   npm run build
   
   # Deploy to Vercel
   vercel --prod
   ```

### 🔄 Update CORS Configuration

After getting your actual Vercel URL, update the backend `.env` file:

```env
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

### 🧪 Testing Production Setup

1. **Test Backend Health:**
   ```bash
   curl https://party-management-backend-production.up.railway.app/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Check browser console for any CORS errors
   - Try authentication flow

### 🛠️ Troubleshooting

#### CORS Issues:
- Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Check Railway logs for CORS errors
- Verify environment variables are set correctly

#### API Connection Issues:
- Verify all `VITE_*` environment variables in Vercel
- Check Network tab in browser dev tools
- Ensure Railway backend is running

#### Build Issues:
- Run `npm run build` locally first to catch any build errors
- Check Vercel build logs

### 📋 Deployment Checklist

Backend (Railway):
- [ ] Environment variables set
- [ ] MongoDB connection working
- [ ] CORS configured for Vercel domain
- [ ] Health endpoint responding
- [ ] API endpoints working

Frontend (Vercel):
- [ ] Environment variables set
- [ ] Build succeeds locally
- [ ] Deployed to Vercel
- [ ] Can connect to Railway backend
- [ ] Authentication flow works
- [ ] No CORS errors in console

### 🔗 Quick URLs

Replace these with your actual URLs:
- **Frontend**: https://your-vercel-app.vercel.app
- **Backend**: https://party-management-backend-production.up.railway.app
- **Backend Health**: https://party-management-backend-production.up.railway.app/health
- **Backend API**: https://party-management-backend-production.up.railway.app/tmf-api/party/v5

### 📞 Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Check Vercel deployment logs in dashboard
3. Test API endpoints individually
4. Verify environment variables are correctly set
