# ✅ Deployment Checklist

## Before You Start
- [ ] GitHub repository is ready and accessible
- [ ] You have a MongoDB Atlas account (free tier works)
- [ ] You have accounts on Railway and Vercel (both free)

---

## 🚀 Deployment Steps

### Step 1: Setup MongoDB (5 minutes)
- [ ] Go to https://cloud.mongodb.com/
- [ ] Create a free cluster
- [ ] Create a database user with username/password
- [ ] Add your IP to whitelist (or use 0.0.0.0/0 for all IPs)
- [ ] Copy the connection string
- [ ] Replace `<username>`, `<password>`, and database name in the connection string

### Step 2: Deploy Backend to Railway (5 minutes)
- [ ] Go to https://railway.app/new
- [ ] Connect your GitHub repository
- [ ] Set root directory to: `Party Management API`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `MONGO_URI=your_mongodb_connection_string`
- [ ] Deploy and wait for completion
- [ ] **📋 Copy your Railway URL:** ________________________

### Step 3: Test Backend (2 minutes)
- [ ] Visit: `YOUR_RAILWAY_URL/health`
- [ ] Should see: `{"status":"OK","timestamp":"..."}`
- [ ] If not working, check Railway logs

### Step 4: Deploy Frontend to Vercel (5 minutes)
- [ ] Go to https://vercel.com/new
- [ ] Connect your GitHub repository
- [ ] Leave root directory blank
- [ ] Add environment variables (replace YOUR_RAILWAY_URL with actual URL from Step 2):
  - [ ] `VITE_API_BASE_URL=YOUR_RAILWAY_URL`
  - [ ] `VITE_HEALTH_URL=YOUR_RAILWAY_URL/health`
  - [ ] `VITE_TMF_API_BASE_URL=YOUR_RAILWAY_URL/tmf-api/party/v5`
  - [ ] `VITE_CONSENT_API_URL=YOUR_RAILWAY_URL/tmf-api/consent/v1`
- [ ] Deploy and wait for completion

### Step 5: Test Complete Application (3 minutes)
- [ ] Visit your Vercel URL
- [ ] Go through the flow: Consent → Party Selection → Sign Up
- [ ] Try creating both Individual and Organization accounts
- [ ] Check browser console for any errors
- [ ] If errors, check that environment variables are correct

---

## 📱 URLs After Deployment

**Frontend (Vercel):** ________________________________

**Backend (Railway):** ________________________________

**MongoDB Atlas:** https://cloud.mongodb.com/

---

## 🔧 Common Issues & Fixes

### "Failed to fetch" errors:
- [ ] Check Railway backend is running and healthy
- [ ] Verify all Vercel environment variables are correct
- [ ] Make sure Railway URL doesn't have trailing slash

### Backend won't start:
- [ ] Check MongoDB connection string is correct
- [ ] Verify MongoDB user has read/write permissions
- [ ] Check Railway deployment logs

### Frontend not building:
- [ ] Verify all environment variables are set in Vercel
- [ ] Check that Railway URL is accessible
- [ ] Look at Vercel build logs

---

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] `/health` endpoint returns OK status
- [ ] Frontend loads without console errors
- [ ] You can complete the sign-up flow
- [ ] Data is saved to MongoDB (check MongoDB Atlas Collections)

---

## 📞 Need Help?

### Check Logs:
- **Railway:** Dashboard → Your Project → Deployments → View Logs
- **Vercel:** Dashboard → Your Project → Functions → View Logs
- **MongoDB:** Atlas → Collections → View Data

### Test Endpoints:
- **Health Check:** `https://your-railway-url.up.railway.app/health`
- **Individual API:** `https://your-railway-url.up.railway.app/tmf-api/party/v5/individual`
- **Organization API:** `https://your-railway-url.up.railway.app/tmf-api/party/v5/organization`

Total Time: ~20 minutes for first deployment
