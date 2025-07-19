/**
 * ConsentHub Service - Centralized integration with ConsentHub backend
 * 
 * This service handles all interactions with the centralized ConsentHub API including:
 * - Party creation (TMF641) - Syncs to party-service
 * - Auth profile creation - Creates user profile for dashboard access
 * - Consent initialization (TMF632) - Syncs to consent-service
 * - Preference initialization (extended TMF632) - Syncs to preference-service
 * 
 * Author: ConsentHub Integration Team
 * Version: 2.0.0 - Centralized ConsentHub Integration
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class ConsentHubService {
  constructor() {
    // ConsentHub microservices endpoints
    this.partyServiceURL = process.env.PARTY_SERVICE_URL || 'http://localhost:3009';
    this.authServiceURL = process.env.AUTH_SERVICE_URL || 'http://localhost:3007';
    this.consentServiceURL = process.env.CONSENT_SERVICE_URL || 'http://localhost:3008';
    this.preferenceServiceURL = process.env.PREFERENCE_SERVICE_URL || 'http://localhost:3010';
    this.apiKey = process.env.INTERNAL_API_KEY;
    this.timeout = 10000; // 10 seconds timeout
    
    // Validate required environment variables
    if (!this.apiKey) {
      console.warn('[ConsentHubService] Warning: INTERNAL_API_KEY not configured');
    }
  }

  /**
   * Get common headers for ConsentHub API calls
   * @returns {Object} Headers object
   */
  getHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'SLT-Mobitel-Account-Service/1.0.0'
    };
  }

  /**
   * Create a new party in ConsentHub party-service (TMF641)
   * @param {Object} partyData - Party information
   * @param {string} partyData.partyId - Unique party identifier
   * @param {string} partyData.name - Full name
   * @param {string} partyData.email - Email address
   * @param {string} partyData.mobile - Mobile number
   * @param {string} [partyData.language='en'] - Preferred language
   * @param {string} [partyData.type='individual'] - Party type
   * @param {string} [partyData.dob] - Date of birth
   * @returns {Promise<Object>} ConsentHub API response
   */
  async createParty(partyData) {
    try {
      console.log(`[ConsentHubService] Creating party in centralized system: ${partyData.partyId}`);
      
      if (!this.apiKey) {
        throw new Error('ConsentHub API key missing');
      }

      // TMF641 compliant party payload for the centralized party-service
      const payload = {
        id: partyData.partyId, // Use 'id' instead of 'partyId' for TMF641 compliance
        partyType: 'individual',
        name: partyData.name,
        status: 'active',
        // Contact information array following TMF641 structure
        contactInformation: [
          {
            contactType: 'email',
            contactValue: partyData.email,
            isPrimary: true,
            validFor: {
              startDateTime: new Date().toISOString()
            }
          },
          {
            contactType: 'mobile',
            contactValue: partyData.mobile,
            isPrimary: true,
            validFor: {
              startDateTime: new Date().toISOString()
            }
          }
        ],
        // Characteristics array for additional metadata
        characteristics: [
          {
            name: 'registrationSource',
            value: 'SLT-Mobitel-Consent-Review-Page',
            valueType: 'string'
          },
          {
            name: 'language',
            value: partyData.language || 'en',
            valueType: 'string'
          },
          {
            name: 'customerSegment',
            value: 'individual',
            valueType: 'string'
          }
        ]
      };

      // Add date of birth if provided
      if (partyData.dob) {
        payload.characteristics.push({
          name: 'dateOfBirth',
          value: partyData.dob,
          valueType: 'date'
        });
      }

      const response = await axios.post(
        `${this.partyServiceURL}/api/v1/parties`,
        payload,
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      console.log(`[ConsentHubService] Party created in centralized system - Status: ${response.status}`);
      return {
        success: true,
        data: response.data,
        status: response.status
      };

    } catch (error) {
      console.error(`[ConsentHubService] Error creating party in centralized system: ${error.message}`);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        if (status === 409) {
          throw new Error(`Party already exists in ConsentHub: ${message}`);
        } else if (status === 400) {
          throw new Error(`Invalid party data: ${message}`);
        } else if (status === 401) {
          throw new Error('ConsentHub API authentication failed');
        }
      }
      
      throw new Error(`ConsentHub party creation failed: ${error.message}`);
    }
  }

  /**
   * Create user profile in auth-service for dashboard access
   * @param {Object} userData - User profile information
   * @param {string} userData.partyId - Party identifier
   * @param {string} userData.email - Email address
   * @param {string} userData.name - Full name
   * @param {string} userData.mobile - Mobile number
   * @returns {Promise<Object>} Auth service response
   */
  async createUserProfile(userData) {
    try {
      console.log(`[ConsentHubService] Creating user profile for dashboard access: ${userData.email}`);
      
      if (!this.apiKey) {
        throw new Error('ConsentHub API key missing');
      }

      // Generate a Firebase-like UID for the user (simplified for demo)
      const firebaseUid = `consent-review-${userData.partyId}`;
      
      const userProfilePayload = {
        firebaseUid: firebaseUid,
        email: userData.email,
        emailVerified: true, // Auto-verify since they registered via consent review
        phoneNumber: userData.mobile,
        phoneVerified: true,
        displayName: userData.name,
        partyId: userData.partyId,
        role: 'customer', // Default role for consent review registrations
        status: 'active',
        registrationSource: 'consent-review-page',
        preferences: {
          language: userData.language || 'en',
          notifications: {
            email: true,
            sms: true,
            push: false
          }
        },
        metadata: {
          registeredAt: new Date().toISOString(),
          lastLoginAt: null,
          loginCount: 0,
          source: 'SLT-Mobitel-Consent-Review-Page'
        }
      };

      const response = await axios.post(
        `${this.authServiceURL}/api/v1/users/profile`,
        userProfilePayload,
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      console.log(`[ConsentHubService] User profile created successfully - Status: ${response.status}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
        firebaseUid: firebaseUid
      };

    } catch (error) {
      console.error(`[ConsentHubService] Error creating user profile: ${error.message}`);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        if (status === 409) {
          console.warn(`[ConsentHubService] User profile already exists: ${userData.email}`);
          return {
            success: true,
            data: { message: 'User profile already exists' },
            status: 409,
            firebaseUid: firebaseUid
          };
        } else if (status === 400) {
          throw new Error(`Invalid user profile data: ${message}`);
        }
      }
      
      throw new Error(`User profile creation failed: ${error.message}`);
    }
  }

  /**
   * Initialize default consent for a party in consent-service (TMF632)
   * @param {string} partyId - Party identifier
   * @param {Object} [options] - Consent options
   * @param {string} [options.purpose='marketing'] - Consent purpose
   * @param {string} [options.status='pending'] - Initial consent status
   * @param {string} [options.channel='email'] - Communication channel
   * @param {string} [options.consentType='explicit'] - Type of consent
   * @returns {Promise<Object>} ConsentHub API response
   */
  async initConsent(partyId, options = {}) {
    try {
      console.log(`[ConsentHubService] Initializing consent in centralized consent-service: ${partyId}`);
      
      if (!this.apiKey) {
        throw new Error('ConsentHub API key missing');
      }

      const consentPayload = {
        id: uuidv4(),
        partyId: partyId,
        purpose: options.purpose || 'marketing',
        status: options.status || 'pending',
        channel: options.channel || 'email',
        consentType: options.consentType || 'explicit',
        category: 'privacy',
        validFor: {
          startDateTime: new Date().toISOString(),
          endDateTime: null // No end date for indefinite consent
        },
        description: `Default ${options.purpose || 'marketing'} consent for SLT-Mobitel services`,
        source: 'SLT-Mobitel-Consent-Review-Page',
        // Additional TMF632 fields
        characteristic: [
          {
            name: 'autoGenerated',
            value: 'true'
          },
          {
            name: 'consentMethod',
            value: 'registration'
          },
          {
            name: 'registrationSource',
            value: 'consent-review-page'
          }
        ]
      };

      const response = await axios.post(
        `${this.consentServiceURL}/api/v1/consents`,
        consentPayload,
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      console.log(`[ConsentHubService] Consent initialized in centralized system - Status: ${response.status}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
        consentId: consentPayload.id
      };

    } catch (error) {
      console.error(`[ConsentHubService] Error initializing consent in centralized system: ${error.message}`);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        if (status === 404) {
          throw new Error(`Party not found in ConsentHub: ${partyId}`);
        } else if (status === 400) {
          throw new Error(`Invalid consent data: ${message}`);
        }
      }
      
      throw new Error(`ConsentHub consent initialization failed: ${error.message}`);
    }
  }

  /**
   * Initialize default preferences for a party in preference-service (extended TMF632)
   * @param {string} partyId - Party identifier
   * @param {Object} [preferences] - Custom preference settings
   * @returns {Promise<Object>} ConsentHub API response
   */
  async initPreference(partyId, preferences = {}) {
    try {
      console.log(`[ConsentHubService] Initializing preferences in centralized preference-service: ${partyId}`);
      
      if (!this.apiKey) {
        throw new Error('ConsentHub API key missing');
      }

      const defaultPreferences = {
        preferredChannels: {
          email: true,
          sms: true,
          push: false,
          postal: false
        },
        topicSubscriptions: {
          promotions: false, // Start with marketing disabled
          billing: true,     // Essential notifications enabled
          security: true,    // Security alerts enabled
          service: true,     // Service updates enabled
          newsletter: false  // Newsletter disabled by default
        },
        doNotDisturb: {
          enabled: true,
          start: "21:00",
          end: "07:00",
          timezone: "Asia/Colombo"
        },
        language: 'en',
        frequency: {
          promotional: 'weekly',
          transactional: 'immediate',
          newsletter: 'monthly'
        }
      };

      const preferencePayload = {
        id: uuidv4(),
        partyId: partyId,
        ...defaultPreferences,
        ...preferences, // Override defaults with custom preferences
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'SLT-Mobitel-Consent-Review-Page',
        version: '1.0',
        status: 'active',
        // Additional metadata for TMF632 compliance
        characteristic: [
          {
            name: 'autoGenerated',
            value: 'true'
          },
          {
            name: 'profileType',
            value: 'default'
          },
          {
            name: 'registrationSource',
            value: 'consent-review-page'
          }
        ]
      };

      const response = await axios.post(
        `${this.preferenceServiceURL}/api/v1/preferences`,
        preferencePayload,
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      console.log(`[ConsentHubService] Preferences initialized in centralized system - Status: ${response.status}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
        preferenceId: preferencePayload.id
      };

    } catch (error) {
      console.error(`[ConsentHubService] Error initializing preferences in centralized system: ${error.message}`);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        if (status === 404) {
          throw new Error(`Party not found in ConsentHub: ${partyId}`);
        } else if (status === 400) {
          throw new Error(`Invalid preference data: ${message}`);
        }
      }
      
      throw new Error(`ConsentHub preference initialization failed: ${error.message}`);
    }
  }

  /**
   * Complete integration - creates party, user profile, initializes consent and preferences
   * @param {Object} partyData - Complete party information
   * @param {Object} [consentOptions] - Consent initialization options
   * @param {Object} [preferenceOptions] - Preference initialization options
   * @returns {Promise<Object>} Complete integration result
   */
  async completeIntegration(partyData, consentOptions = {}, preferenceOptions = {}) {
    const results = {
      party: null,
      userProfile: null,
      consent: null,
      preferences: null,
      errors: []
    };

    try {
      console.log(`[ConsentHubService] Starting complete centralized integration for party: ${partyData.partyId}`);

      // Step 1: Create Party in party-service
      try {
        results.party = await this.createParty(partyData);
      } catch (error) {
        results.errors.push({ step: 'party', error: error.message });
        throw error; // Critical failure - cannot continue without party
      }

      // Step 2: Create User Profile in auth-service for dashboard access
      try {
        const userData = {
          partyId: partyData.partyId,
          email: partyData.email,
          name: partyData.name,
          mobile: partyData.mobile,
          language: partyData.language
        };
        results.userProfile = await this.createUserProfile(userData);
      } catch (error) {
        results.errors.push({ step: 'userProfile', error: error.message });
        console.warn(`[ConsentHubService] User profile creation failed but continuing: ${error.message}`);
      }

      // Step 3: Initialize Consent in consent-service (non-critical)
      try {
        results.consent = await this.initConsent(partyData.partyId, consentOptions);
      } catch (error) {
        results.errors.push({ step: 'consent', error: error.message });
        console.warn(`[ConsentHubService] Consent initialization failed but continuing: ${error.message}`);
      }

      // Step 4: Initialize Preferences in preference-service (non-critical)
      try {
        results.preferences = await this.initPreference(partyData.partyId, preferenceOptions);
      } catch (error) {
        results.errors.push({ step: 'preferences', error: error.message });
        console.warn(`[ConsentHubService] Preference initialization failed but continuing: ${error.message}`);
      }

      console.log(`[ConsentHubService] Complete centralized integration finished for party: ${partyData.partyId}`);
      
      return {
        success: true,
        partyId: partyData.partyId,
        results: results,
        hasErrors: results.errors.length > 0,
        dashboardAccess: {
          canLogin: results.userProfile?.success || false,
          firebaseUid: results.userProfile?.firebaseUid || null,
          role: 'customer'
        }
      };

    } catch (error) {
      console.error(`[ConsentHubService] Critical error in complete centralized integration: ${error.message}`);
      return {
        success: false,
        partyId: partyData.partyId,
        results: results,
        error: error.message,
        dashboardAccess: {
          canLogin: false,
          firebaseUid: null,
          role: null
        }
      };
    }
  }

  /**
   * Health check for ConsentHub centralized services
   * @returns {Promise<Object>} Service availability status
   */
  async healthCheck() {
    const healthStatus = {
      overall: false,
      services: {
        partyService: false,
        authService: false,
        consentService: false,
        preferenceService: false
      },
      errors: []
    };

    try {
      if (!this.apiKey) {
        healthStatus.errors.push('API key not configured');
        return healthStatus;
      }

      // Check each service
      const services = [
        { name: 'partyService', url: this.partyServiceURL },
        { name: 'authService', url: this.authServiceURL },
        { name: 'consentService', url: this.consentServiceURL },
        { name: 'preferenceService', url: this.preferenceServiceURL }
      ];

      const healthChecks = services.map(async (service) => {
        try {
          const response = await axios.get(`${service.url}/health`, {
            headers: this.getHeaders(),
            timeout: 5000
          });
          healthStatus.services[service.name] = response.status === 200;
          return true;
        } catch (error) {
          healthStatus.services[service.name] = false;
          healthStatus.errors.push(`${service.name}: ${error.message}`);
          return false;
        }
      });

      const results = await Promise.all(healthChecks);
      healthStatus.overall = results.every(result => result);

      return healthStatus;

    } catch (error) {
      console.warn(`[ConsentHubService] Health check failed: ${error.message}`);
      healthStatus.errors.push(error.message);
      return healthStatus;
    }
  }
}

// Export singleton instance
const consentHubService = new ConsentHubService();

// Export individual functions for backward compatibility
module.exports = {
  // Main service instance
  consentHubService,
  
  // Individual functions
  createParty: (partyData) => consentHubService.createParty(partyData),
  createUserProfile: (userData) => consentHubService.createUserProfile(userData),
  initConsent: (partyId, options) => consentHubService.initConsent(partyId, options),
  initPreference: (partyId, preferences) => consentHubService.initPreference(partyId, preferences),
  completeIntegration: (partyData, consentOptions, preferenceOptions) => 
    consentHubService.completeIntegration(partyData, consentOptions, preferenceOptions),
  healthCheck: () => consentHubService.healthCheck()
};
