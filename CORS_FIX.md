# Quick Fix for CORS Issue

## 🚨 **Current Issue:** CORS blocking localhost requests to Railway

## ✅ **Quick Solutions:**

### Option 1: Update Railway Environment Variable (Fastest)
1. Go to [Railway Dashboard](https://railway.app)
2. Find your backend project
3. Go to Variables tab
4. Add or update:
   ```
   FRONTEND_URL=http://localhost:5173
   ```
5. Your app will automatically redeploy

### Option 2: Use Debug Component
1. Open http://localhost:5173 in your browser
2. Scroll down to see the Debug Connection component
3. Click "Test Direct URL" to test CORS
4. Check browser console for CORS errors

### Option 3: Deploy Updated Backend
If you want the permanent fix:
```bash
cd "Party Management API"
railway up
```

## 🧪 **Testing:**
After applying any solution, test:
1. The debug component should show ✅ success
2. Authentication page should show "Backend connected" 
3. No CORS errors in browser console

## 🔍 **Check Browser Console:**
Press F12 → Console tab to see detailed error messages
