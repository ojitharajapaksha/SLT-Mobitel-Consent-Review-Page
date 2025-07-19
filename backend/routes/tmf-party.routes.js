const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * TMF Party Management API v5 Routes
 * Implements TMF641 Party Management API standard
 */

// In-memory storage for demo purposes (in production, use MongoDB)
const individuals = [];
const organizations = [];

/**
 * POST /tmf-api/party/v5/individual
 * Create a new individual party
 */
router.post('/individual', async (req, res) => {
  try {
    console.log('[TMF-API] Creating individual party:', req.body);
    
    const { givenName, familyName, subscribeToNewsletter, email, password, ...otherData } = req.body;
    
    // Check if user with this email already exists
    const existingIndividual = individuals.find(individual => 
      individual.authenticationContext?.email === email
    );
    
    if (existingIndividual) {
      console.log('[TMF-API] User with email already exists:', email);
      return res.status(409).json({
        message: 'You have an account, please log in',
        error: 'USER_ALREADY_EXISTS',
        details: 'An account with this email address already exists. Please sign in instead.',
        existingEmail: email
      });
    }
    
    // Generate party ID
    const partyId = uuidv4();
    
    // Create party data following TMF641 standard
    const partyData = {
      id: partyId,
      partyType: 'individual',
      name: `${givenName} ${familyName}`,
      status: 'active',
      contactInformation: [],
      // Add authentication context for sign-in
      authenticationContext: {
        email: email,
        password: password, // In production, this should be hashed
        agreedToTerms: otherData.agreeToTerms || false,
        subscribedToNewsletter: subscribeToNewsletter || false,
        accountCreationDate: new Date().toISOString()
      },
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
          name: 'email',
          value: email,
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
    
    // Store the created party in memory for authentication
    individuals.push(partyData);
    console.log('[TMF-API] Total individuals stored:', individuals.length);
    
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
    console.log('[TMF-API] Listing all individual parties');
    console.log('[TMF-API] Found', individuals.length, 'individuals in storage');
    
    // Return the actual stored individuals instead of empty array
    res.json(individuals);
    
  } catch (error) {
    console.error('[TMF-API] Error listing individual parties:', error);
    res.status(500).json({
      message: 'Failed to list individual parties',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * GET /tmf-api/party/v5/organization
 * List all organization parties
 */
router.get('/organization', async (req, res) => {
  try {
    console.log('[TMF-API] Listing all organization parties');
    console.log('[TMF-API] Found', organizations.length, 'organizations in storage');
    
    // Return the actual stored organizations instead of empty array
    res.json(organizations);
    
  } catch (error) {
    console.error('[TMF-API] Error listing organization parties:', error);
    res.status(500).json({
      message: 'Failed to list organization parties',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * POST /tmf-api/party/v5/organization
 * Create a new organization party
 */
router.post('/organization', async (req, res) => {
  try {
    console.log('[TMF-API] Creating organization party:', req.body);
    
    const { organizationName, organizationType, email, password, ...otherData } = req.body;
    
    // Check if user with this email already exists (in both individuals and organizations)
    const existingIndividual = individuals.find(individual => 
      individual.authenticationContext?.email === email
    );
    const existingOrganization = organizations.find(org => 
      org.authenticationContext?.email === email
    );
    
    if (existingIndividual || existingOrganization) {
      console.log('[TMF-API] User with email already exists:', email);
      return res.status(409).json({
        message: 'You have an account, please log in',
        error: 'USER_ALREADY_EXISTS',
        details: 'An account with this email address already exists. Please sign in instead.',
        existingEmail: email
      });
    }
    
    // Generate party ID
    const partyId = uuidv4();
    
    // Create organization data following TMF641 standard
    const partyData = {
      id: partyId,
      partyType: 'organization',
      name: organizationName || 'Unnamed Organization',
      status: 'active',
      organizationType: organizationType || 'company',
      contactInformation: [],
      // Add authentication context for sign-in
      authenticationContext: {
        email: email,
        password: password, // In production, this should be hashed
        agreedToTerms: otherData.agreeToTerms || false,
        subscribedToNewsletter: otherData.subscribeToNewsletter || false,
        accountCreationDate: new Date().toISOString()
      },
      characteristics: [
        {
          name: 'organizationType',
          value: organizationType || 'company',
          valueType: 'string'
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
    
    console.log('[TMF-API] Organization created successfully:', partyId);
    
    // Store the created organization in memory for authentication
    organizations.push(partyData);
    console.log('[TMF-API] Total organizations stored:', organizations.length);
    
    res.status(201).json(partyData);
    
  } catch (error) {
    console.error('[TMF-API] Error creating organization party:', error);
    res.status(500).json({
      message: 'Failed to create organization party',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
