const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register.controller');

// Middleware for request validation and logging
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

const validateContentType = (req, res, next) => {
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({
      message: 'Content-Type must be application/json',
      error: 'INVALID_CONTENT_TYPE'
    });
  }
  next();
};

// Apply middleware
router.use(requestLogger);
router.use(validateContentType);

// Register customer endpoint
router.post('/register', registerController.registerCustomer);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Register service is healthy',
    timestamp: new Date().toISOString(),
    service: 'register-api',
    version: '1.0.0'
  });
});

module.exports = router;
