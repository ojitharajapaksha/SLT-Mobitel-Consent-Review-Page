// 🧾 Copilot Prompt:
// Build a controller to register a new customer account in ConsentHub.
// Stack: Node.js + Express + Mongoose + Axios.
// Steps:
// 1. Receive a POST request to /api/v1/register with body: name, email, mobile, dob, language
// 2. Validate required fields (name, email, mobile).
// 3. Save customer into MongoDB (Party model).
// 4. Auto-generate a UUID partyId using 'uuid' library.
// 5. After saving to local DB, send the party object to ConsentHub backend:
//    - POST /party to https://consenthub-api.onrender.com/api/v1/party
//    - Include x-api-key header for security
// 6. Optionally initialize default consent and preferences
// 7. Log all responses and return success message with the party object

const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const Party = require('../models/Party');

exports.registerCustomer = async (req, res) => {
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

    // Save to local DB
    const newParty = new Party({
      partyId,
      name,
      email,
      mobile,
      dob: dob ? new Date(dob) : null,
      language: language || 'en'
    });

    const savedParty = await newParty.save();
    console.log(`[PartyCreated] Local DB - PartyId: ${partyId}`);

    // Send to ConsentHub (TMF641 /party)
    const consentHubBaseURL = process.env.CONSENTHUB_API;
    const apiKey = process.env.INTERNAL_API_KEY;

    if (consentHubBaseURL && apiKey) {
      try {
        // Sync party to ConsentHub
        const partyResponse = await axios.post(`${consentHubBaseURL}/tmf-api/party/v5/individual`, {
          partyId,
          name,
          email,
          mobile,
          language: language || 'en',
          type: "individual",
          dateOfBirth: dob || null
        }, {
          headers: { 
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          }
        });

        console.log(`[ConsentHubSync] Party synced successfully - Status: ${partyResponse.status}`);

        // (Optional) Initialize default consent for marketing
        try {
          await axios.post(`${consentHubBaseURL}/api/v1/privacyConsent`, {
            partyId,
            purpose: "marketing",
            status: "pending", // Start as pending until user explicitly consents
            channel: "email",
            validFor: {
              startDateTime: new Date().toISOString()
            },
            consentType: "explicit"
          }, {
            headers: { 
              'x-api-key': apiKey,
              'Content-Type': 'application/json'
            }
          });

          console.log(`[ConsentInit] Default consent initialized for ${partyId}`);
        } catch (consentError) {
          console.warn(`[ConsentInit] Warning - Could not initialize consent: ${consentError.message}`);
        }

        // (Optional) Initialize default preferences
        try {
          await axios.post(`${consentHubBaseURL}/api/v1/privacyPreference`, {
            partyId,
            preferredChannels: { 
              email: true, 
              sms: true, 
              push: false 
            },
            topicSubscriptions: { 
              promotions: false, 
              billing: true, 
              security: true 
            },
            doNotDisturb: { 
              start: "21:00", 
              end: "07:00" 
            }
          }, {
            headers: { 
              'x-api-key': apiKey,
              'Content-Type': 'application/json'
            }
          });

          console.log(`[PreferencesInit] Default preferences initialized for ${partyId}`);
        } catch (prefError) {
          console.warn(`[PreferencesInit] Warning - Could not initialize preferences: ${prefError.message}`);
        }

      } catch (consentHubError) {
        console.error(`[ConsentHubSync] Error syncing to ConsentHub: ${consentHubError.message}`);
        // Don't fail the registration if ConsentHub sync fails
        console.warn('[ConsentHubSync] Registration completed locally, but ConsentHub sync failed');
      }
    } else {
      console.warn('[ConsentHubSync] ConsentHub API configuration missing - skipping sync');
    }

    console.log(`[PartyCreatedEvent] - ${partyId} registration completed successfully`);
    
    return res.status(201).json({ 
      message: 'Customer registered successfully', 
      data: {
        partyId: savedParty.partyId,
        name: savedParty.name,
        email: savedParty.email,
        mobile: savedParty.mobile,
        language: savedParty.language,
        createdAt: savedParty.createdAt
      }
    });

  } catch (error) {
    console.error('[RegisterController] Error in registration:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.message 
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Customer already exists',
        error: 'DUPLICATE_KEY'
      });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};
