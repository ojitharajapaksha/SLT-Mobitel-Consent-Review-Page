/**
 * Customer Data Sync Service
 * 
 * This service provides functions to sync and retrieve customer data
 * for the ConsentHub CSR and Admin dashboards from the centralized database
 * 
 * Author: ConsentHub Integration Team
 * Version: 1.0.0
 */

const axios = require('axios');

class CustomerDataSyncService {
  constructor() {
    this.partyServiceURL = process.env.PARTY_SERVICE_URL || 'http://localhost:3009';
    this.authServiceURL = process.env.AUTH_SERVICE_URL || 'http://localhost:3007';
    this.consentServiceURL = process.env.CONSENT_SERVICE_URL || 'http://localhost:3008';
    this.preferenceServiceURL = process.env.PREFERENCE_SERVICE_URL || 'http://localhost:3010';
    this.apiKey = process.env.INTERNAL_API_KEY;
    this.timeout = 10000;
  }

  /**
   * Get common headers for API calls
   * @returns {Object} Headers object
   */
  getHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'SLT-Mobitel-Customer-Sync/1.0.0'
    };
  }

  /**
   * Get all customers from the centralized party service
   * @param {Object} [filters] - Optional filters
   * @param {number} [page=1] - Page number
   * @param {number} [limit=50] - Items per page
   * @returns {Promise<Object>} Customer list with pagination
   */
  async getAllCustomers(filters = {}, page = 1, limit = 50) {
    try {
      console.log('[CustomerDataSyncService] Fetching customers from centralized party service');

      const params = {
        page,
        limit,
        partyType: 'individual', // Only get individual customers
        status: 'active',
        ...filters
      };

      const response = await axios.get(
        `${this.partyServiceURL}/api/v1/parties`,
        {
          params,
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      const customers = response.data.data || response.data;
      const formattedCustomers = customers.map(customer => this.formatCustomerData(customer));

      return {
        success: true,
        data: formattedCustomers,
        pagination: response.data.pagination || {
          page,
          limit,
          total: formattedCustomers.length
        }
      };

    } catch (error) {
      console.error('[CustomerDataSyncService] Error fetching customers:', error.message);
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
  }

  /**
   * Get customer by party ID with full details
   * @param {string} partyId - Party identifier
   * @returns {Promise<Object>} Complete customer information
   */
  async getCustomerById(partyId) {
    try {
      console.log(`[CustomerDataSyncService] Fetching customer details for: ${partyId}`);

      // Fetch party details, consents, and preferences in parallel
      const [partyResponse, consentsResponse, preferencesResponse, userProfileResponse] = await Promise.allSettled([
        axios.get(`${this.partyServiceURL}/api/v1/parties/${partyId}`, {
          headers: this.getHeaders(),
          timeout: this.timeout
        }),
        axios.get(`${this.consentServiceURL}/api/v1/consents`, {
          params: { partyId },
          headers: this.getHeaders(),
          timeout: this.timeout
        }),
        axios.get(`${this.preferenceServiceURL}/api/v1/preferences`, {
          params: { partyId },
          headers: this.getHeaders(),
          timeout: this.timeout
        }),
        axios.get(`${this.authServiceURL}/api/v1/users/profile`, {
          params: { partyId },
          headers: this.getHeaders(),
          timeout: this.timeout
        })
      ]);

      // Process results
      const customerData = {
        party: partyResponse.status === 'fulfilled' ? partyResponse.value.data : null,
        consents: consentsResponse.status === 'fulfilled' ? consentsResponse.value.data : [],
        preferences: preferencesResponse.status === 'fulfilled' ? preferencesResponse.value.data : null,
        userProfile: userProfileResponse.status === 'fulfilled' ? userProfileResponse.value.data : null
      };

      if (!customerData.party) {
        throw new Error('Customer not found');
      }

      return {
        success: true,
        data: this.formatDetailedCustomerData(customerData)
      };

    } catch (error) {
      console.error(`[CustomerDataSyncService] Error fetching customer ${partyId}:`, error.message);
      throw new Error(`Failed to fetch customer details: ${error.message}`);
    }
  }

  /**
   * Search customers by criteria
   * @param {string} searchTerm - Search term (email, name, mobile)
   * @param {Object} [filters] - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchCustomers(searchTerm, filters = {}) {
    try {
      console.log(`[CustomerDataSyncService] Searching customers with term: ${searchTerm}`);

      const searchParams = {
        search: searchTerm,
        partyType: 'individual',
        status: 'active',
        ...filters
      };

      const response = await axios.get(
        `${this.partyServiceURL}/api/v1/parties/search`,
        {
          params: searchParams,
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      const customers = response.data.data || response.data;
      const formattedCustomers = customers.map(customer => this.formatCustomerData(customer));

      return {
        success: true,
        data: formattedCustomers,
        searchTerm,
        totalResults: formattedCustomers.length
      };

    } catch (error) {
      console.error('[CustomerDataSyncService] Error searching customers:', error.message);
      throw new Error(`Failed to search customers: ${error.message}`);
    }
  }

  /**
   * Get customer statistics for dashboard
   * @returns {Promise<Object>} Customer statistics
   */
  async getCustomerStats() {
    try {
      console.log('[CustomerDataSyncService] Fetching customer statistics');

      // Fetch statistics from each service
      const [partyStats, consentStats, userStats] = await Promise.allSettled([
        axios.get(`${this.partyServiceURL}/api/v1/parties/stats`, {
          headers: this.getHeaders(),
          timeout: this.timeout
        }),
        axios.get(`${this.consentServiceURL}/api/v1/consents/stats`, {
          headers: this.getHeaders(),
          timeout: this.timeout
        }),
        axios.get(`${this.authServiceURL}/api/v1/users/stats`, {
          headers: this.getHeaders(),
          timeout: this.timeout
        })
      ]);

      const stats = {
        totalCustomers: 0,
        activeCustomers: 0,
        totalConsents: 0,
        activeConsents: 0,
        pendingConsents: 0,
        registrationSources: {},
        recentRegistrations: 0
      };

      // Process party statistics
      if (partyStats.status === 'fulfilled') {
        const partyData = partyStats.value.data;
        stats.totalCustomers = partyData.total || 0;
        stats.activeCustomers = partyData.active || 0;
        stats.registrationSources = partyData.registrationSources || {};
      }

      // Process consent statistics
      if (consentStats.status === 'fulfilled') {
        const consentData = consentStats.value.data;
        stats.totalConsents = consentData.total || 0;
        stats.activeConsents = consentData.active || 0;
        stats.pendingConsents = consentData.pending || 0;
      }

      // Process user statistics
      if (userStats.status === 'fulfilled') {
        const userData = userStats.value.data;
        stats.recentRegistrations = userData.recentRegistrations || 0;
      }

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('[CustomerDataSyncService] Error fetching statistics:', error.message);
      return {
        success: false,
        data: {
          totalCustomers: 0,
          activeCustomers: 0,
          totalConsents: 0,
          activeConsents: 0,
          pendingConsents: 0,
          registrationSources: {},
          recentRegistrations: 0
        },
        error: error.message
      };
    }
  }

  /**
   * Format customer data for dashboard display
   * @param {Object} customer - Raw customer data from party service
   * @returns {Object} Formatted customer data
   */
  formatCustomerData(customer) {
    const email = customer.contactInformation?.find(c => c.contactType === 'email')?.contactValue || '';
    const mobile = customer.contactInformation?.find(c => c.contactType === 'mobile')?.contactValue || '';
    const language = customer.characteristics?.find(c => c.name === 'language')?.value || 'en';
    const registrationSource = customer.characteristics?.find(c => c.name === 'registrationSource')?.value || 'unknown';

    return {
      partyId: customer.id,
      name: customer.name,
      email,
      mobile,
      language,
      status: customer.status,
      registrationSource,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    };
  }

  /**
   * Format detailed customer data with consents and preferences
   * @param {Object} customerData - Complete customer data object
   * @returns {Object} Formatted detailed customer data
   */
  formatDetailedCustomerData(customerData) {
    const basicData = this.formatCustomerData(customerData.party);
    
    return {
      ...basicData,
      consents: customerData.consents.map(consent => ({
        id: consent.id,
        purpose: consent.purpose,
        status: consent.status,
        channel: consent.channel,
        consentType: consent.consentType,
        validFor: consent.validFor,
        createdAt: consent.createdAt,
        updatedAt: consent.updatedAt
      })),
      preferences: customerData.preferences ? {
        id: customerData.preferences.id,
        preferredChannels: customerData.preferences.preferredChannels,
        topicSubscriptions: customerData.preferences.topicSubscriptions,
        doNotDisturb: customerData.preferences.doNotDisturb,
        language: customerData.preferences.language,
        updatedAt: customerData.preferences.updatedAt
      } : null,
      userProfile: customerData.userProfile ? {
        firebaseUid: customerData.userProfile.firebaseUid,
        emailVerified: customerData.userProfile.emailVerified,
        phoneVerified: customerData.userProfile.phoneVerified,
        role: customerData.userProfile.role,
        status: customerData.userProfile.status,
        lastLoginAt: customerData.userProfile.lastLoginAt,
        loginCount: customerData.userProfile.loginCount
      } : null
    };
  }

  /**
   * Update customer status (for CSR/Admin operations)
   * @param {string} partyId - Party identifier
   * @param {string} status - New status
   * @param {string} updatedBy - Who updated the status
   * @returns {Promise<Object>} Update result
   */
  async updateCustomerStatus(partyId, status, updatedBy) {
    try {
      console.log(`[CustomerDataSyncService] Updating customer status: ${partyId} -> ${status}`);

      const response = await axios.patch(
        `${this.partyServiceURL}/api/v1/parties/${partyId}`,
        { 
          status,
          updatedBy,
          updatedAt: new Date().toISOString()
        },
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error(`[CustomerDataSyncService] Error updating customer status:`, error.message);
      throw new Error(`Failed to update customer status: ${error.message}`);
    }
  }
}

// Export singleton instance
const customerDataSyncService = new CustomerDataSyncService();

module.exports = {
  customerDataSyncService,
  
  // Individual functions
  getAllCustomers: (filters, page, limit) => customerDataSyncService.getAllCustomers(filters, page, limit),
  getCustomerById: (partyId) => customerDataSyncService.getCustomerById(partyId),
  searchCustomers: (searchTerm, filters) => customerDataSyncService.searchCustomers(searchTerm, filters),
  getCustomerStats: () => customerDataSyncService.getCustomerStats(),
  updateCustomerStatus: (partyId, status, updatedBy) => customerDataSyncService.updateCustomerStatus(partyId, status, updatedBy)
};
