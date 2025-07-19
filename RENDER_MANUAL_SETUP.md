# 🎯 Alternative Render Service Configuration
# Use this if the Blueprint approach isn't working

# BACKEND SERVICE CONFIGURATION
# Create manually in Render Dashboard with these settings:

# Service Type: Web Service
# Name: slt-mobitel-consent-review-backend
# Runtime: Node
# Region: Oregon (or closest to your users)
# Branch: main
# Root Directory: backend
# Build Command: npm ci
# Start Command: node server.js
# Plan: Starter (Free)

# Environment Variables to set in Render Dashboard:
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/consenthub-users?retryWrites=true&w=majority
CONSENTHUB_API=https://party-management-backend-new.onrender.com
FRONTEND_URL=https://slt-mobitel-consent-review-page.vercel.app
# INTERNAL_API_KEY, JWT_SECRET, SESSION_SECRET will be auto-generated

# Health Check Path: /health
# Auto-Deploy: Yes

---

# FRONTEND SERVICE CONFIGURATION  
# Create manually in Render Dashboard with these settings:

# Service Type: Static Site
# Name: slt-mobitel-consent-review-frontend
# Runtime: Node
# Region: Oregon (or closest to your users)  
# Branch: main
# Root Directory: / (keep root)
# Build Command: npm ci && npm run build
# Publish Directory: dist
# Plan: Starter (Free)

# Environment Variables to set in Render Dashboard:
# VITE_API_BASE_URL=https://party-management-backend-new.onrender.com
# VITE_HEALTH_URL=https://party-management-backend-new.onrender.com/health
# VITE_TMF_API_BASE_URL=https://party-management-backend-new.onrender.com/tmf-api/party/v5
# VITE_CONSENT_API_URL=https://party-management-backend-new.onrender.com/tmf-api/consent/v1
# ⚠️ IMPORTANT: Use your ACTUAL backend URL (party-management-backend-new.onrender.com)

# Auto-Deploy: Yes
