const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * TMF Party Management API v5 Routes
 * Implements TMF641 Party Management API standard
 */

/**
 * POST /tmf-api/party/v5/individual
 * Create a new individual party
 */
router.post('/individual', async (req, res) => {
  try {
    console.log('[TMF-API] Creating individual party:', req.body);
    
    const { givenName, familyName, subscribeToNewsletter, ...otherData } = req.body;
    
    // Generate party ID
    const partyId = uuidv4();
    
    // Create party data following TMF641 standard
    const partyData = {
      id: partyId,
      partyType: 'individual',
      name: `${givenName} ${familyName}`,
      status: 'active',
      contactInformation: [],
      characteristics: [
        {
          name: 'givenName',
          value: givenName,
          valueType: 'string'
        },
        {
          name: 'familyName', 
          value: familyName,
          valueType: 'string'
        },
        {
          name: 'subscribeToNewsletter',
          value: subscribeToNewsletter ? 'true' : 'false',
          valueType: 'boolean'
        },
        {
          name: 'registrationSource',
          value: 'SLT-Mobitel-Consent-Review-Page',
          valueType: 'string'
        }
      ],
      creationDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };
    
    // Add any additional characteristics
    Object.entries(otherData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        partyData.characteristics.push({
          name: key,
          value: String(value),
          valueType: typeof value
        });
      }
    });
    
    console.log('[TMF-API] Party created successfully:', partyId);
    
    res.status(201).json({
      ...partyData,
      message: 'Individual party created successfully',
      redirectUrl: 'https://myslt.slt.lk/' // Redirect URL as requested
    });
    
  } catch (error) {
    console.error('[TMF-API] Error creating individual party:', error);
    res.status(500).json({
      message: 'Failed to create individual party',
      error: 'INTERNAL_SERVER_ERROR',
      details: error.message
    });
  }
});

/**
 * GET /tmf-api/party/v5/individual/:id
 * Get individual party by ID
 */
router.get('/individual/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, you would fetch from database
    // For now, return a mock response
    res.json({
      id: id,
      partyType: 'individual',
      name: 'Mock Individual',
      status: 'active',
      message: 'Individual party retrieved (mock response)'
    });
    
  } catch (error) {
    console.error('[TMF-API] Error retrieving individual party:', error);
    res.status(500).json({
      message: 'Failed to retrieve individual party',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * GET /tmf-api/party/v5/individual
 * List individual parties
 */
router.get('/individual', async (req, res) => {
  try {
    // In a real implementation, you would fetch from database with pagination
    res.json({
      parties: [],
      totalCount: 0,
      message: 'Individual parties retrieved (mock response)'
    });
    
  } catch (error) {
    console.error('[TMF-API] Error listing individual parties:', error);
    res.status(500).json({
      message: 'Failed to list individual parties',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
