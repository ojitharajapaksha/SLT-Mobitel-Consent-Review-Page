# SLT Mobitel TMF632 Consent Management Deployment

## Quick Start Guide

This system provides a TMF632-compliant consent management solution for the MySLT web portal.

### Prerequisites

- Node.js 18 or higher
- MongoDB 5.0 or higher
- NPM or Yarn package manager

### 1. Backend Setup (TMF632 API)

```bash
# Navigate to the API directory
cd "Party Management API"

# Install dependencies
npm install

# Create environment file
echo "MONGO_URI=mongodb://localhost:27017/tmf632-slt-consent" > .env
echo "PORT=3001" >> .env
echo "NODE_ENV=production" >> .env

# Start MongoDB (if running locally)
# mongod --dbpath /your/mongodb/data/path

# Start the TMF632 API server
npm start
```

The API will be available at: `http://localhost:3001`

### 2. Frontend Setup (React Application)

```bash
# Navigate to the project root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### 3. Production Deployment

#### Backend Deployment

1. **Docker Deployment** (Recommended):
```bash
# Create Dockerfile for API
cat > "Party Management API/Dockerfile" << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
EOF

# Build and run
cd "Party Management API"
docker build -t slt-tmf632-api .
docker run -p 3001:3001 -e MONGO_URI="your-production-mongodb-uri" slt-tmf632-api
```

2. **Cloud Deployment Options**:
   - **AWS**: Use Elastic Beanstalk or ECS
   - **Azure**: Use App Service or Container Instances
   - **Google Cloud**: Use Cloud Run or App Engine

#### Frontend Integration Options

**Option 1: React Component Integration** (For React-based MySLT portal)
```tsx
// Add to your existing MySLT portal
import MySLTConsentMiddleware from './path/to/MySLTConsentMiddleware';

// Integrate into your authentication flow
const MyExistingMySLTPortal = () => {
  // ... your existing code
  
  if (needsConsent) {
    return (
      <MySLTConsentMiddleware
        mySLTUser={currentUser}
        onConsentComplete={handleConsentComplete}
        apiUrl="https://your-api-domain.com"
      />
    );
  }
  
  return <YourExistingPortal />;
};
```

**Option 2: Standalone Deployment** (For any technology stack)
```bash
# Build for production
npm run build

# Deploy static files to your web server
# The built files will be in the 'dist' directory
```

**Option 3: Iframe Integration** (For legacy systems)
```html
<!-- Add to your existing MySLT portal -->
<iframe 
  src="https://consent.myslt.lk" 
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

### 4. Database Configuration

#### MongoDB Schema
The system automatically creates the following collections:
- `individuals` - Individual customer records
- `organizations` - Organizational customer records
- `consents` - TMF632-compliant consent records

#### Sample MongoDB Setup (Production)
```bash
# Connect to MongoDB
mongosh

# Create database and user
use tmf632-slt-consent
db.createUser({
  user: "slt_app",
  pwd: "secure_password_here",
  roles: [
    { role: "readWrite", db: "tmf632-slt-consent" }
  ]
})

# Create indexes for performance
db.consents.createIndex({ "partyId": 1, "consentTimestamp": -1 })
db.individuals.createIndex({ "contactMedium.value": 1 })
db.organizations.createIndex({ "contactMedium.value": 1 })
```

### 5. Environment Configuration

#### Production Environment Variables
```env
# Backend (.env)
MONGO_URI=mongodb://slt_app:secure_password@your-mongodb-server:27017/tmf632-slt-consent
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://myslt.slt.lk
JWT_SECRET=your-secure-jwt-secret
ENCRYPTION_KEY=your-data-encryption-key

# Frontend (.env.production)
VITE_API_URL=https://api.myslt.lk/tmf632
VITE_ENVIRONMENT=production
```

### 6. Load Balancer Configuration

#### Nginx Configuration Example
```nginx
# /etc/nginx/sites-available/slt-consent
upstream tmf632_api {
    server localhost:3001;
    server localhost:3002; # Add more instances as needed
}

server {
    listen 80;
    server_name api.myslt.lk;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.myslt.lk;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    
    location /tmf632/ {
        proxy_pass http://tmf632_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7. Monitoring and Logging

#### Application Monitoring
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
cd "Party Management API"
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

#### Logging Configuration
```javascript
// Add to your backend (logger.js)
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'tmf632-consent' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### 8. Security Checklist

- [ ] HTTPS enabled for all endpoints
- [ ] CORS properly configured for production domains
- [ ] Database connection secured with authentication
- [ ] Input validation and sanitization implemented
- [ ] Rate limiting configured
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Access logs monitored

### 9. Integration Testing

#### Test Scenarios
```bash
# Backend API Tests
curl -X GET "http://localhost:3001/health"
curl -X POST "http://localhost:3001/tmf-api/consent/v1" \
  -H "Content-Type: application/json" \
  -d '{"partyId":"test123","partyType":"individual","consents":{"termsAndPrivacy":true}}'

# Frontend Integration Tests
npm run test
npm run e2e # if configured
```

### 10. Backup and Recovery

#### Database Backup
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --host localhost:27017 --db tmf632-slt-consent --out /backups/mongo_$DATE/
find /backups -name "mongo_*" -mtime +7 -exec rm -rf {} \;
```

#### Application Backup
```bash
# Backup application files
tar -czf slt-consent-app-$(date +%Y%m%d).tar.gz \
  "Party Management API" \
  src/ \
  public/ \
  package.json
```

### 11. Performance Optimization

#### Database Optimization
- Index frequently queried fields
- Implement connection pooling
- Use read replicas for reporting

#### Application Optimization
- Enable compression (gzip)
- Implement caching (Redis)
- Use CDN for static assets

### 12. Support and Maintenance

#### Regular Maintenance Tasks
- Monitor consent collection metrics
- Update legal text as needed
- Review and update security configurations
- Monitor system performance and scaling needs

#### Contact Information
- Technical Support: [your-support-email]
- Emergency Contact: [emergency-contact]
- Documentation: [documentation-url]

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check if MongoDB and API server are running
2. **CORS Errors**: Verify CORS configuration matches your domain
3. **Database Authentication**: Ensure MongoDB user has correct permissions
4. **SSL Certificate Issues**: Verify certificate paths and validity

### Debug Commands
```bash
# Check service status
pm2 status
pm2 logs

# Database connection test
mongosh "mongodb://your-connection-string"

# Network connectivity
curl -I http://localhost:3001/health
netstat -tulpn | grep :3001
```

This deployment guide provides a complete setup for integrating TMF632-compliant consent management into the SLT Mobitel MySLT portal.
