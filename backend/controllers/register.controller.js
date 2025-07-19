/**
 * Register Controller - Customer Registration with ConsentHub Integration
 * 
 * This controller handles customer registration with integrated ConsentHub sync:
 * 1. Validates and saves customer data to local MongoDB
 * 2. Syncs party information to ConsentHub (TMF641)
 * 3. Initializes default consent settings (TMF632)
 * 4. Sets up default privacy preferences
 * 
 * Stack: Node.js + Express + Mongoose + ConsentHub Service
 * Author: SLT-Mobitel Development Team
 * Version: 2.0.0 - Modular ConsentHub Integration
 */

const { v4: uuidv4 } = require('uuid');
const Party = require('../models/Party');
const { createParty, initConsent, initPreference, completeIntegration } = require('../services/consentHub.service');

/**
 * Register a new customer with ConsentHub integration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.registerCustomer = async (req, res) => {
  let savedParty = null;
  
  try {
    const { name, email, mobile, dob, language } = req.body;

    // Validate required fields
    if (!name || !email || !mobile) {
      return res.status(400).json({ 
        message: 'Name, email, and mobile are required',
        error: 'VALIDATION_ERROR'
      });
    }

    // Check if customer already exists
    const existingParty = await Party.findOne({ $or: [{ email }, { mobile }] });
    if (existingParty) {
      return res.status(409).json({ 
        message: 'Customer already exists with this email or mobile number',
        error: 'DUPLICATE_CUSTOMER'
      });
    }

    // Generate unique partyId
    const partyId = uuidv4();

    // Step 1: Save to local MongoDB first
    const newParty = new Party({
      partyId,
      name,
      email,
      mobile,
      dob: dob ? new Date(dob) : null,
      language: language || 'en'
    });

    savedParty = await newParty.save();
    console.log(`[RegisterController] Local party saved successfully - PartyId: ${partyId}`);

    // Step 2: Integrate with ConsentHub using modular service
    const partyPayload = {
      partyId,
      name,
      email,
      mobile,
      language: language || 'en',
      type: 'individual',
      dob: dob || null
    };

    // Optional: Define custom consent and preference options
    const consentOptions = {
      purpose: 'marketing',
      status: 'pending', // Start as pending until user explicitly consents
      channel: 'email',
      consentType: 'explicit'
    };

    const preferenceOptions = {
      preferredChannels: { 
        email: true, 
        sms: true, 
        push: false 
      },
      topicSubscriptions: { 
        promotions: false, // Conservative default
        billing: true, 
        security: true,
        service: true
      },
      doNotDisturb: { 
        enabled: true,
        start: "21:00", 
        end: "07:00",
        timezone: "Asia/Colombo"
      }
    };

    // Use the complete integration service
    const integrationResult = await completeIntegration(partyPayload, consentOptions, preferenceOptions);

    // Prepare response based on integration results
    const responseData = {
      message: 'Customer registered successfully',
      data: {
        partyId: savedParty.partyId,
        name: savedParty.name,
        email: savedParty.email,
        mobile: savedParty.mobile,
        language: savedParty.language,
        createdAt: savedParty.createdAt
      },
      consentHubIntegration: {
        success: integrationResult.success,
        hasErrors: integrationResult.hasErrors || false
      },
      dashboardAccess: {
        canLogin: integrationResult.dashboardAccess?.canLogin || false,
        loginUrl: integrationResult.dashboardAccess?.canLogin ? 
          `${process.env.FRONTEND_URL || 'http://localhost:5173'}/customer-dashboard` : null,
        credentials: integrationResult.dashboardAccess?.canLogin ? {
          email: savedParty.email,
          // In production, this would be sent via secure email
          tempPassword: 'Use your email to login via ConsentHub dashboard'
        } : null
      }
    };

    // Add integration details if successful
    if (integrationResult.success) {
      console.log(`[RegisterController] ConsentHub integration completed successfully for ${partyId}`);
      
      if (integrationResult.hasErrors) {
        responseData.consentHubIntegration.warnings = integrationResult.results.errors;
        console.warn(`[RegisterController] ConsentHub integration completed with warnings for ${partyId}:`, integrationResult.results.errors);
      }
    } else {
      console.error(`[RegisterController] ConsentHub integration failed for ${partyId}:`, integrationResult.error);
      responseData.consentHubIntegration.error = integrationResult.error;
      
      // Note: We don't rollback the local registration as ConsentHub sync is not critical
      // The customer account still exists locally and can be synced later
    }

    console.log(`[RegisterController] Customer registration completed - PartyId: ${partyId}`);
    
    return res.status(201).json(responseData);

  } catch (error) {
    console.error('[RegisterController] Error in registration process:', error.message);
    
    // If we have a saved party but ConsentHub integration failed, 
    // we should note this but not fail the registration
    if (savedParty) {
      console.warn(`[RegisterController] Local registration succeeded but ConsentHub integration failed for ${savedParty.partyId}`);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.message 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Customer already exists',
        error: 'DUPLICATE_KEY'
      });
    }
    
    // Handle other errors
    return res.status(500).json({ 
      message: 'Internal server error',
      error: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
