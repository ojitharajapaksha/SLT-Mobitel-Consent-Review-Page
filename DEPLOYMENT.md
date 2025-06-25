# 🚀 Easy Copy-Paste Deployment Guide

## Step 1: Deploy Backend to Railway

### Railway Deployment Settings:
- **Repository:** Your GitHub repository
- **Root Directory:** `Party Management API`
- **Start Command:** `npm start`  
- **Build Command:** `npm install`

### Environment Variables for Railway:
```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/party-management?retryWrites=true&w=majority
```

**🔗 After Railway deploys, you'll get a URL like:** `https://your-backend-name.up.railway.app`
**📝 Copy this URL - you'll need it for Step 2!**

---

## Step 2: Deploy Frontend to Vercel

### Vercel Deployment Settings:
- **Repository:** Your GitHub repository  
- **Root Directory:** Leave blank (uses main project folder)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables for Vercel:
**⚠️ Replace `YOUR_RAILWAY_URL_HERE` with the actual URL from Step 1**

```
VITE_API_BASE_URL=YOUR_RAILWAY_URL_HERE
VITE_HEALTH_URL=YOUR_RAILWAY_URL_HERE/health
VITE_TMF_API_BASE_URL=YOUR_RAILWAY_URL_HERE/tmf-api/party/v5
VITE_CONSENT_API_URL=YOUR_RAILWAY_URL_HERE/tmf-api/consent/v1
```

**Example with actual Railway URL:**
```
VITE_API_BASE_URL=https://party-management-api-production.up.railway.app
VITE_HEALTH_URL=https://party-management-api-production.up.railway.app/health
VITE_TMF_API_BASE_URL=https://party-management-api-production.up.railway.app/tmf-api/party/v5
VITE_CONSENT_API_URL=https://party-management-api-production.up.railway.app/tmf-api/consent/v1
```

---

## � Quick Start Links

### Deploy Backend (Step 1):
**👉 Click here:** https://railway.app/new

### Deploy Frontend (Step 2):  
**👉 Click here:** https://vercel.com/new

---

## 📱 Testing Your Deployment

After both deployments are complete:

1. **Test Backend Health Check:**
   - Visit: `https://your-railway-url.up.railway.app/` (should show API info)
   - Visit: `https://your-railway-url.up.railway.app/health` (should return OK status)
   - Visit: `https://your-railway-url.up.railway.app/health/detailed` (detailed system status)

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try the consent flow: Consent → Party Selection → Sign Up
   - Check browser console for any errors

### Expected Backend Responses:

**Root endpoint (`/`):**
```json
{
  "message": "TMF632 Party Management API",
  "version": "1.0.0",
  "status": "Running",
  "endpoints": { ... }
}
```

**Health endpoint (`/health`):**
```json
{
  "status": "OK",
  "message": "Party Management API is running",
  "timestamp": "...",
  "uptime": 123.45
}
```

---

## 🔧 Environment Variable Template

Copy this template and replace `YOUR_RAILWAY_URL_HERE` with your actual Railway URL:

### For Vercel Environment Variables:
```
VITE_API_BASE_URL=YOUR_RAILWAY_URL_HERE
VITE_HEALTH_URL=YOUR_RAILWAY_URL_HERE/health
VITE_TMF_API_BASE_URL=YOUR_RAILWAY_URL_HERE/tmf-api/party/v5
VITE_CONSENT_API_URL=YOUR_RAILWAY_URL_HERE/tmf-api/consent/v1
```

### For Railway Environment Variables:
```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/party-management?retryWrites=true&w=majority
```

---

## 🛠️ MongoDB Setup (Required for Backend)

1. **Go to:** https://cloud.mongodb.com/
2. **Create a free cluster**
3. **Create a database user**
4. **Get connection string**
5. **Add to Railway environment variables**

---

## � Pre-Deployment Checklist

- [ ] GitHub repository is ready
- [ ] MongoDB Atlas cluster is created
- [ ] MongoDB connection string is ready
- [ ] Project builds locally (`npm run build`)
- [ ] Backend starts locally (`cd "Party Management API" && npm start`)

---

## 🔄 Post-Deployment Updates

If you need to update URLs after deployment:

1. **Update Railway URL in Vercel:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Update all variables with new Railway URL
   - Redeploy

2. **Update MongoDB connection:**
   - Go to Railway dashboard → Your project → Variables
   - Update MONGO_URI
   - Railway will auto-redeploy

---

## 🆘 Troubleshooting

### Common Issues:

1. **502 Bad Gateway (Server Down):**
   - Check Railway deployment logs for errors
   - Verify MongoDB connection string is correct
   - Ensure all environment variables are set
   - Check if MongoDB Atlas IP whitelist includes Railway IPs (use 0.0.0.0/0)
   - Try accessing `/health` endpoint directly

2. **"Failed to fetch" errors:**
   - Check Railway backend is running
   - Verify environment variables in Vercel
   - Check browser console for CORS errors

3. **Backend not starting:**
   - Check MongoDB connection string format
   - Verify Railway environment variables
   - Check Railway deployment logs
   - Ensure MongoDB user has correct permissions

4. **Frontend not building:**
   - Check all environment variables are set
   - Verify build command is `npm run build`
   - Check Vercel build logs

### 🔍 Debugging Steps for 502 Errors:

1. **Check Railway Logs:**
   - Go to Railway dashboard → Your project → Deployments
   - Click on latest deployment → View logs
   - Look for error messages during startup

2. **Verify Environment Variables:**
   - Check that `MONGO_URI` is correctly set
   - Ensure `PORT` is set to `3000`
   - Verify `NODE_ENV` is set to `production`

3. **Test MongoDB Connection:**
   - Make sure your MongoDB Atlas cluster is running
   - Check that your database user exists and has permissions
   - Verify the connection string format

4. **Test Endpoints:**
   - Try `https://your-railway-url.up.railway.app/` (should work even if MongoDB is down)
   - Try `https://your-railway-url.up.railway.app/health`
   - Try `https://your-railway-url.up.railway.app/health/detailed` (shows MongoDB status)

### Getting Help:
- Railway logs: Railway dashboard → Your project → Deployments → View logs
- Vercel logs: Vercel dashboard → Your project → Functions → View function logs
- MongoDB logs: MongoDB Atlas → Clusters → Collections
