# 🚨 502 Error Troubleshooting Guide

## What is a 502 Error?
A 502 Bad Gateway error means Railway can't reach your application server. This usually happens when:
- Your app crashed during startup
- MongoDB connection failed
- Environment variables are missing or incorrect
- Your app is listening on the wrong port

---

## 🔧 Quick Fixes

### 1. Check Railway Deployment Logs
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your project
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click **View Logs**

**Look for these error patterns:**
- `MongoDB connection error`
- `ECONNREFUSED`
- `Missing environment variable`
- `Port already in use`

### 2. Verify Environment Variables
Make sure these are set in Railway:
```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### 3. Test MongoDB Connection String
1. Replace placeholders in MONGO_URI:
   - `username` → your MongoDB username
   - `password` → your MongoDB password  
   - `cluster` → your cluster name
   - `database` → your database name

2. Test the connection string:
   - Copy the MONGO_URI value
   - Try connecting with MongoDB Compass or mongosh

### 4. Check MongoDB Atlas Configuration
1. **Database User:**
   - Go to MongoDB Atlas → Database Access
   - Ensure user exists with read/write permissions
   - Password should match the one in MONGO_URI

2. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allow access from anywhere)
   - This allows Railway to connect from any IP

### 5. Force Redeploy on Railway
1. Go to your Railway project
2. Click **Deployments**
3. Click **Deploy** to trigger a new deployment

---

## 🧪 Test Your Fixed Deployment

After making changes, test these URLs:

1. **Root endpoint:** `https://your-railway-url.up.railway.app/`
   - Should return API information

2. **Health check:** `https://your-railway-url.up.railway.app/health`
   - Should return `{"status":"OK",...}`

3. **Detailed health:** `https://your-railway-url.up.railway.app/health/detailed`
   - Shows MongoDB connection status

---

## 🆘 Still Getting 502?

### Check These Common Issues:

1. **Wrong MongoDB URI format:**
   ```
   ❌ mongodb://username:password@cluster
   ✅ mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Special characters in password:**
   - URL-encode special characters in your MongoDB password
   - Example: `p@ssw0rd` becomes `p%40ssw0rd`

3. **Wrong database name:**
   - Make sure the database name in MONGO_URI exists
   - MongoDB Atlas creates it automatically when you first write data

4. **Railway timeout:**
   - Railway has a 30-second startup timeout
   - If your app takes longer to start, it will get a 502 error

### Get More Help:

1. **Railway Logs:** Most important for debugging
2. **MongoDB Atlas Logs:** Atlas → Clusters → ... → View Monitoring
3. **Test Locally:** Run `npm start` in the "Party Management API" folder

---

## 💡 Prevention Tips

1. **Always test locally first:** `cd "Party Management API" && npm start`
2. **Use environment variables:** Never hardcode credentials
3. **Add health checks:** Multiple endpoints help isolate issues
4. **Monitor logs:** Check Railway logs after each deployment
5. **Test MongoDB separately:** Use MongoDB Compass to verify connection

---

## 🔄 Recovery Steps

If your deployment is broken:

1. **Rollback:** Railway → Deployments → Previous working deployment → Redeploy
2. **Fresh deploy:** Push a new commit to trigger redeploy
3. **Environment reset:** Double-check all environment variables
4. **MongoDB reset:** Create new database user if needed

Your app should be working once you fix the underlying issue!
