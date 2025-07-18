const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const registerRoutes = require('./routes/register.routes');
const customerDataRoutes = require('./routes/customerData.routes');
const tmfPartyRoutes = require('./routes/tmf-party.routes');
const tmfConsentRoutes = require('./routes/tmf-consent.routes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Define allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000', // Local backend
      'http://localhost:5173', // Local frontend (default)
      'http://localhost:5174', // Local frontend (alternate port)
      'http://localhost:5175', // Local frontend (alternate port 2)
      'http://localhost:5176', // Local frontend (alternate port 3)
      'http://localhost:5177', // Local frontend (alternate port 4)
      'http://localhost:5178', // Local frontend (alternate port 5)
      'https://slt-mobitel-consent-review-page.vercel.app', // Production frontend
    ];
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// API Routes
app.use('/api/v1', registerRoutes);
app.use('/api/v1', customerDataRoutes);

// TMF API Routes
app.use('/tmf-api/party/v5', tmfPartyRoutes);
app.use('/tmf-api/consent/v1', tmfConsentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SLT-Mobitel ConsentHub API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      register: '/api/v1/register',
      customers: '/api/v1/customers',
      health: '/health',
      api_health: '/api/v1/health',
      tmf_party: '/tmf-api/party/v5/individual',
      tmf_consent: '/tmf-api/consent/v1/consent'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SLT-Mobitel Account Service API is running with TMF endpoints',
    timestamp: new Date().toISOString(),
    service: 'account-service',
    version: '1.0.1',
    endpoints: {
      health: '/health',
      register: '/api/register',
      customerData: '/api/customer-data',
      tmfPartyIndividual: '/tmf-api/party/v5/individual',
      tmfConsent: '/tmf-api/consent/v1/consent'
    }
  });
});

// API Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SLT-Mobitel Account Service API is running',
    timestamp: new Date().toISOString(),
    service: 'account-service',
    version: '1.0.0',
    endpoints: {
      register: '/api/v1/register',
      customers: '/api/v1/customers'
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[GlobalError]', err.stack);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON format',
      error: 'PARSE_ERROR'
    });
  }
  
  res.status(500).json({
    message: 'Something went wrong!',
    error: 'INTERNAL_SERVER_ERROR'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    error: 'NOT_FOUND'
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    console.log('[MongoDB] Connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Reconnected');
    });

  } catch (error) {
    console.error('[MongoDB] Connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Shutdown] Received SIGINT. Gracefully shutting down...');
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Shutdown] Error during shutdown:', error);
    process.exit(1);
  }
});

module.exports = app;
