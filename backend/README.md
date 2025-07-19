# SLT-Mobitel ConsentHub Backend API

A Node.js Express backend for managing customer registration and consent management for SLT-Mobitel ConsentHub.

## Features

- 🔐 Customer registration with validation
- 🔄 ConsentHub API integration
- 📱 Mobile and email validation
- 🌍 Multi-language support (English, Sinhala, Tamil)
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📊 MongoDB integration with Mongoose
- ⚡ Error handling and logging
- 🏥 Health check endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **HTTP Client**: Axios
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Mongoose validators
- **Environment**: dotenv

## Project Structure

```
backend/
├── controllers/
│   └── register.controller.js  # Registration business logic
├── models/
│   └── Party.js                # Customer data model
├── routes/
│   └── register.routes.js      # API route definitions
├── app.js                      # Express app configuration
├── server.js                   # Server entry point
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables
└── README.md                   # This file
```

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values according to your setup

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/consenthub-users

# ConsentHub API Configuration
CONSENTHUB_API=https://party-management-backend-new.onrender.com
INTERNAL_API_KEY=your-secure-api-key

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Registration

**POST** `/api/v1/register`

Register a new customer and sync with ConsentHub.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "mobile": "0771234567",
  "dob": "1990-01-01",
  "language": "en"
}
```

**Response (Success)**:
```json
{
  "message": "Customer registered successfully",
  "data": {
    "partyId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "mobile": "0771234567",
    "language": "en",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Health Check

**GET** `/api/v1/health`

Check if the registration service is healthy.

**Response**:
```json
{
  "message": "Register service is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "register-api",
  "version": "1.0.0"
}
```

## Data Models

### Party Model

```javascript
{
  partyId: String,      // UUID - Unique identifier
  name: String,         // Customer full name
  email: String,        // Email address (unique)
  mobile: String,       // Mobile number (unique)
  dob: Date,           // Date of birth (optional)
  language: String,     // Preferred language (en/si/ta)
  type: String,        // 'individual' or 'business'
  status: String,      // 'active', 'inactive', 'suspended'
  consentHubSynced: Boolean, // Sync status with ConsentHub
  createdAt: Date,     // Registration timestamp
  updatedAt: Date      // Last update timestamp
}
```

## ConsentHub Integration

The system integrates with ConsentHub API to:

1. **Sync Customer Data**: Send party information to ConsentHub
2. **Initialize Consent**: Set up default consent preferences
3. **Manage Preferences**: Configure communication preferences

### Integration Flow

1. Customer registers via frontend
2. Data saved to local MongoDB
3. Customer data synced to ConsentHub `/party` endpoint
4. Default consent created in ConsentHub
5. Communication preferences initialized
6. Success response sent to frontend

## Error Handling

The API includes comprehensive error handling for:

- **Validation Errors**: Invalid email, mobile, or required field missing
- **Duplicate Customers**: Email or mobile already exists
- **Database Errors**: MongoDB connection or operation failures
- **ConsentHub Errors**: External API integration failures
- **Server Errors**: Unexpected application errors

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin request handling
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Mongoose schema validation
- **Error Sanitization**: Prevent information leakage

## Logging

The application includes structured logging for:
- API requests and responses
- Database operations
- ConsentHub synchronization
- Error tracking
- Performance monitoring

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix code style issues

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Production Deployment

1. **Set environment to production**:
   ```env
   NODE_ENV=production
   ```

2. **Configure production database**:
   ```env
   MONGO_URI=mongodb://your-production-mongodb-uri
   ```

3. **Set secure API keys**:
   ```env
   INTERNAL_API_KEY=your-production-api-key
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check `MONGO_URI` in `.env`
   - Verify network connectivity

2. **ConsentHub Sync Failed**
   - Check `CONSENTHUB_API` URL
   - Verify `INTERNAL_API_KEY`
   - Check network connectivity to ConsentHub

3. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill existing process: `lsof -ti:5000 | xargs kill`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the MIT License.
