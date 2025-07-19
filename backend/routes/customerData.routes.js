/**
 * Customer Data API Routes
 * 
 * These routes provide customer data endpoints for the ConsentHub
 * CSR and Admin dashboards to fetch real customer data from the
 * centralized database
 */

const express = require('express');
const router = express.Router();
const { 
  getAllCustomers, 
  getCustomerById, 
  searchCustomers, 
  getCustomerStats,
  updateCustomerStatus 
} = require('../services/customerDataSync.service');

// Middleware for request validation and logging
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.INTERNAL_API_KEY;
  
  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      message: 'Unauthorized - Invalid API key',
      error: 'INVALID_API_KEY'
    });
  }
  next();
};

// Apply middleware
router.use(requestLogger);
router.use(validateApiKey);

/**
 * GET /api/v1/customers
 * Get all customers with pagination and filtering
 */
router.get('/customers', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      registrationSource,
      language
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (registrationSource) filters.registrationSource = registrationSource;
    if (language) filters.language = language;

    const result = await getAllCustomers(filters, parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      message: 'Customers retrieved successfully',
      ...result
    });

  } catch (error) {
    console.error('[CustomerDataAPI] Error fetching customers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
});

/**
 * GET /api/v1/customers/search
 * Search customers by term
 */
router.get('/customers/search', async (req, res) => {
  try {
    const { q: searchTerm, ...filters } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required',
        error: 'MISSING_SEARCH_TERM'
      });
    }

    const result = await searchCustomers(searchTerm, filters);
    
    res.json({
      success: true,
      message: 'Customer search completed',
      ...result
    });

  } catch (error) {
    console.error('[CustomerDataAPI] Error searching customers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search customers',
      error: error.message
    });
  }
});

/**
 * GET /api/v1/customers/stats
 * Get customer statistics for dashboard
 */
router.get('/customers/stats', async (req, res) => {
  try {
    const result = await getCustomerStats();
    
    res.json({
      success: true,
      message: 'Customer statistics retrieved successfully',
      ...result
    });

  } catch (error) {
    console.error('[CustomerDataAPI] Error fetching customer stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer statistics',
      error: error.message
    });
  }
});

/**
 * GET /api/v1/customers/:partyId
 * Get customer by party ID with full details
 */
router.get('/customers/:partyId', async (req, res) => {
  try {
    const { partyId } = req.params;

    if (!partyId) {
      return res.status(400).json({
        success: false,
        message: 'Party ID is required',
        error: 'MISSING_PARTY_ID'
      });
    }

    const result = await getCustomerById(partyId);
    
    res.json({
      success: true,
      message: 'Customer details retrieved successfully',
      ...result
    });

  } catch (error) {
    console.error(`[CustomerDataAPI] Error fetching customer ${req.params.partyId}:`, error.message);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
        error: 'CUSTOMER_NOT_FOUND'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer details',
      error: error.message
    });
  }
});

/**
 * PATCH /api/v1/customers/:partyId/status
 * Update customer status (CSR/Admin operation)
 */
router.patch('/customers/:partyId/status', async (req, res) => {
  try {
    const { partyId } = req.params;
    const { status, updatedBy } = req.body;

    if (!partyId || !status || !updatedBy) {
      return res.status(400).json({
        success: false,
        message: 'Party ID, status, and updatedBy are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        error: 'INVALID_STATUS'
      });
    }

    const result = await updateCustomerStatus(partyId, status, updatedBy);
    
    res.json({
      success: true,
      message: 'Customer status updated successfully',
      ...result
    });

  } catch (error) {
    console.error(`[CustomerDataAPI] Error updating customer status:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer status',
      error: error.message
    });
  }
});

/**
 * GET /api/v1/customers/export/csv
 * Export customers to CSV (for CSR/Admin)
 */
router.get('/customers/export/csv', async (req, res) => {
  try {
    const { status, registrationSource } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (registrationSource) filters.registrationSource = registrationSource;

    // Get all customers without pagination for export
    const result = await getAllCustomers(filters, 1, 10000);
    
    if (!result.success) {
      throw new Error('Failed to fetch customers for export');
    }

    // Generate CSV content
    const csvHeaders = [
      'Party ID',
      'Name',
      'Email', 
      'Mobile',
      'Language',
      'Status',
      'Registration Source',
      'Created At'
    ];

    const csvRows = result.data.map(customer => [
      customer.partyId,
      customer.name,
      customer.email,
      customer.mobile,
      customer.language,
      customer.status,
      customer.registrationSource,
      customer.createdAt
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field || ''}"`).join(','))
    ].join('\n');

    // Set CSV response headers
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `consenthub-customers-${timestamp}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    console.error('[CustomerDataAPI] Error exporting customers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to export customers',
      error: error.message
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Customer Data API is healthy',
    timestamp: new Date().toISOString(),
    service: 'customer-data-api',
    version: '1.0.0'
  });
});

module.exports = router;
