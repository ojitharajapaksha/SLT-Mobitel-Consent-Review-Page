# 🔗 Easy URL Copy-Paste Template

## Step 1: Deploy Backend to Railway
👉 **Go to:** https://railway.app/new

After deployment, Railway will give you a URL like:
`https://your-backend-name.up.railway.app`

**📋 Copy your Railway URL here:** ________________________________

---

## Step 2: Copy Environment Variables for Vercel

Replace `YOUR_RAILWAY_URL_HERE` with the URL you copied above:

```
VITE_API_BASE_URL=YOUR_RAILWAY_URL_HERE
VITE_HEALTH_URL=YOUR_RAILWAY_URL_HERE/health
VITE_TMF_API_BASE_URL=YOUR_RAILWAY_URL_HERE/tmf-api/party/v5
VITE_CONSENT_API_URL=YOUR_RAILWAY_URL_HERE/tmf-api/consent/v1
```

### Example with filled URLs:
```
VITE_API_BASE_URL=https://my-party-api.up.railway.app
VITE_HEALTH_URL=https://my-party-api.up.railway.app/health
VITE_TMF_API_BASE_URL=https://my-party-api.up.railway.app/tmf-api/party/v5
VITE_CONSENT_API_URL=https://my-party-api.up.railway.app/tmf-api/consent/v1
```

---

## Step 3: Deploy Frontend to Vercel
👉 **Go to:** https://vercel.com/new

1. Select your GitHub repository
2. Keep root directory blank
3. Add the environment variables from Step 2
4. Click Deploy

---

## 🧪 Test Your Deployment

### Test Backend Health:
Visit: `YOUR_RAILWAY_URL_HERE/health`
Should show: `{"status":"OK","message":"Party Management API is running"}`

### Test Frontend:
Visit your Vercel URL and try the consent flow.

---

## 📝 MongoDB Setup (Required)

For Railway backend environment variables:
```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/partymanagement?retryWrites=true&w=majority
```

Get your MongoDB connection string from: https://cloud.mongodb.com/
