const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Party = require('../models/Party');

// Mock environment variables for testing
process.env.MONGO_URI = 'mongodb://localhost:27017/consenthub-test';
process.env.CONSENTHUB_API = 'https://consenthub-api.onrender.com/api/v1';
process.env.INTERNAL_API_KEY = 'test-api-key';

describe('Register Controller', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await Party.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and close database connection
    await Party.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/v1/register', () => {
    const validCustomerData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '0771234567',
      dob: '1990-01-01',
      language: 'en'
    };

    test('should register a new customer successfully', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send(validCustomerData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.message).toBe('Customer registered successfully');
      expect(response.body.data).toHaveProperty('partyId');
      expect(response.body.data.name).toBe(validCustomerData.name);
      expect(response.body.data.email).toBe(validCustomerData.email);
      expect(response.body.data.mobile).toBe(validCustomerData.mobile);
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteData = {
        name: 'John Doe'
        // Missing email and mobile
      };

      const response = await request(app)
        .post('/api/v1/register')
        .send(incompleteData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.message).toBe('Name, email, and mobile are required');
      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    test('should return 409 for duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/v1/register')
        .send(validCustomerData)
        .expect(201);

      // Second registration with same email
      const duplicateData = {
        ...validCustomerData,
        mobile: '0777654321' // Different mobile
      };

      const response = await request(app)
        .post('/api/v1/register')
        .send(duplicateData)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.message).toBe('Customer already exists with this email or mobile number');
      expect(response.body.error).toBe('DUPLICATE_CUSTOMER');
    });

    test('should return 409 for duplicate mobile', async () => {
      // First registration
      await request(app)
        .post('/api/v1/register')
        .send(validCustomerData)
        .expect(201);

      // Second registration with same mobile
      const duplicateData = {
        ...validCustomerData,
        email: 'jane.doe@example.com' // Different email
      };

      const response = await request(app)
        .post('/api/v1/register')
        .send(duplicateData)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.message).toBe('Customer already exists with this email or mobile number');
      expect(response.body.error).toBe('DUPLICATE_CUSTOMER');
    });

    test('should handle invalid email format', async () => {
      const invalidData = {
        ...validCustomerData,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/v1/register')
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.message).toBe('Validation error');
    });

    test('should save customer to database', async () => {
      await request(app)
        .post('/api/v1/register')
        .send(validCustomerData)
        .expect(201);

      const savedCustomer = await Party.findOne({ email: validCustomerData.email });
      expect(savedCustomer).toBeTruthy();
      expect(savedCustomer.name).toBe(validCustomerData.name);
      expect(savedCustomer.email).toBe(validCustomerData.email);
      expect(savedCustomer.mobile).toBe(validCustomerData.mobile);
      expect(savedCustomer.partyId).toBeTruthy();
    });
  });

  describe('GET /api/v1/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.message).toBe('Register service is healthy');
      expect(response.body.service).toBe('register-api');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.message).toBe('SLT-Mobitel ConsentHub API');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.status).toBe('running');
      expect(response.body.endpoints).toBeDefined();
    });
  });
});
