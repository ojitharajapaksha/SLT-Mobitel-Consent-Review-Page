// Service for interacting with the Party Management API

export interface Individual {
  _id?: string;
  // Essential TMF632 Individual Party fields
  givenName: string;
  familyName: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  status?: string;
  
  // TMF632 ContactMedium - Essential contact information
  contactMedium?: {
    type: string; // 'email', 'mobile', 'phone'
    value: string;
    preferred?: boolean;
    validFor?: {
      startDateTime: Date;
      endDateTime?: Date | null;
    };
  }[];
  
  // TMF632 IndividualIdentification - Essential for identity verification
  individualIdentification?: {
    type: string; // 'nationalId', 'passport'
    identificationId: string;
    issuingAuthority?: string;
    issuingDate?: Date | null;
    validFor?: {
      startDateTime: Date;
      endDateTime?: Date | null;
    };
  }[];
  
  // TMF632 standard optional fields
  languageAbility?: any[];
  skill?: any[];
  externalReference?: any[];
  partyCharacteristic?: {
    name: string;
    value: string;
    valueType: string;
  }[];
  taxExemptionCertificate?: any[];
  relatedParty?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Organization {
  _id?: string;
  // Essential TMF632 Organization Party fields
  name: string;
  tradingName?: string;
  organizationType: string;
  isLegalEntity?: boolean;
  isHeadOffice?: boolean;
  status?: string;
  
  // TMF632 ContactMedium - Essential contact information
  contactMedium?: {
    type: string; // 'email', 'phone', 'mobile'
    value: string;
    preferred?: boolean;
    validFor?: {
      startDateTime: Date;
      endDateTime?: Date | null;
    };
  }[];
  
  // TMF632 OrganizationIdentification - Essential for business verification
  organizationIdentification?: {
    type: string; // 'businessRegistration', 'taxId', 'vatNumber'
    identificationId: string;
    issuingAuthority?: string;
    issuingDate?: Date | null;
    validFor?: {
      startDateTime: Date;
      endDateTime?: Date | null;
    };
  }[];
  
  // TMF632 standard optional fields
  externalReference?: any[];
  organizationChildRelationship?: any[];
  organizationParentRelationship?: any[];
  partyCharacteristic?: {
    name: string;
    value: string;
    valueType: string;
  }[];
  taxExemptionCertificate?: any[];
  creditRating?: any[];
  relatedParty?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsentRecord {
  _id?: string;
  partyId: string;
  partyType: 'individual' | 'organization';
  consents: {
    marketingEmails: boolean;
    personalization: boolean;
    thirdPartySharing: boolean;
    serviceUsageLogs: boolean;
    termsAndPrivacy: boolean;
  };
  consentTimestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

const API_BASE_URL = 'http://localhost:3000/tmf-api/party/v5';
const CONSENT_API_URL = 'http://localhost:3000/tmf-api/consent/v1';
const HEALTH_URL = 'http://localhost:3000/health';

class PartyService {
  // Helper method to handle fetch with better error messages
  private async fetchWithErrorHandling(url: string, options?: RequestInit): Promise<Response> {
    try {
      console.log(`[PartyService] Making request to: ${url}`);
      console.log(`[PartyService] Request options:`, options);
      
      const response = await fetch(url, options);
      
      console.log(`[PartyService] Response status: ${response.status} ${response.statusText}`);
      console.log(`[PartyService] Response headers:`, [...response.headers.entries()]);
      
      return response;
    } catch (error) {
      console.error(`[PartyService] Network error for ${url}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Unable to connect to server. Please ensure the backend is running on port 3000. Error: ${errorMessage}`);
    }
  }
  // Individual methods
  async getIndividuals(): Promise<Individual[]> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/individual`);
      if (!response.ok) {
        throw new Error(`Failed to fetch individuals: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching individuals:', error);
      throw error;
    }
  }

  async getIndividualById(id: string): Promise<Individual> {
    try {
      const response = await fetch(`${API_BASE_URL}/individual/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch individual: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching individual:', error);
      throw error;
    }
  }

  async createIndividual(individual: Omit<Individual, '_id' | 'createdAt' | 'updatedAt'>): Promise<Individual> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/individual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(individual),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create individual: ${response.statusText} - ${errorData}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating individual:', error);
      throw error;
    }
  }

  async updateIndividual(id: string, individual: Partial<Individual>): Promise<Individual> {
    try {
      const response = await fetch(`${API_BASE_URL}/individual/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(individual),
      });
      if (!response.ok) {
        throw new Error(`Failed to update individual: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating individual:', error);
      throw error;
    }
  }

  // Organization methods
  async getOrganizations(): Promise<Organization[]> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/organization`);
      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  }

  async getOrganizationById(id: string): Promise<Organization> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch organization: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  }

  async createOrganization(organization: Omit<Organization, '_id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organization),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create organization: ${response.statusText} - ${errorData}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  }

  async updateOrganization(id: string, organization: Partial<Organization>): Promise<Organization> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organization),
      });
      if (!response.ok) {
        throw new Error(`Failed to update organization: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  }

  // Consent management methods
  async saveConsent(consentRecord: Omit<ConsentRecord, '_id'>): Promise<ConsentRecord> {
    try {
      const response = await this.fetchWithErrorHandling(`${CONSENT_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consentRecord),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to save consent: ${response.statusText} - ${errorData}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving consent:', error);
      // Fallback to localStorage if API is not available
      const consents = this.getStoredConsents();
      const newConsent: ConsentRecord = {
        ...consentRecord,
        _id: Date.now().toString(),
      };
      consents.push(newConsent);
      localStorage.setItem('consentRecords', JSON.stringify(consents));
      return newConsent;
    }
  }

  private getStoredConsents(): ConsentRecord[] {
    try {
      const stored = localStorage.getItem('consentRecords');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async getConsentsByPartyId(partyId: string): Promise<ConsentRecord[]> {
    try {
      const response = await fetch(`${CONSENT_API_URL}/party/${partyId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch consents: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching consents:', error);
      // Fallback to localStorage if API is not available
      const consents = this.getStoredConsents();
      return consents.filter(consent => consent.partyId === partyId);
    }
  }

  // Comprehensive data verification report
  async getDataVerificationReport(partyId: string): Promise<any> {
    try {
      console.log('[PartyService] Requesting data verification report for party:', partyId);
      const response = await this.fetchWithErrorHandling(`${CONSENT_API_URL}/verify/${partyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to get verification report: ${response.statusText} - ${errorData}`);
      }
      
      const report = await response.json();
      console.log('[PartyService] Data verification report received:', {
        partyId: report.partyId,
        partyType: report.partyType,
        storedFields: report.dataCompliance?.storedFields?.length || 0,
        consentRecords: report.consentData?.totalRecords || 0
      });
      
      return report;
    } catch (error) {
      console.error('[PartyService] Error fetching data verification report:', error);
      throw error;
    }
  }

  // Get all parties report (admin endpoint)
  async getAllPartiesReport(): Promise<any> {
    try {
      console.log('[PartyService] Requesting comprehensive parties report');
      const response = await this.fetchWithErrorHandling(`${CONSENT_API_URL}/admin/parties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to get parties report: ${response.statusText} - ${errorData}`);
      }
      
      const report = await response.json();
      console.log('[PartyService] Comprehensive parties report received:', {
        totalParties: report.totalParties,
        individuals: report.individuals?.count || 0,
        organizations: report.organizations?.count || 0
      });
      
      return report;
    } catch (error) {
      console.error('[PartyService] Error fetching parties report:', error);
      throw error;
    }
  }

  // Health check method
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.fetchWithErrorHandling(HEALTH_URL);
      return response.ok;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }

  // Helper methods for display
  formatPartyDisplayName(party: Individual | Organization): string {
    if ('givenName' in party) {
      return `${party.givenName} ${party.familyName}`;
    }
    return party.name;
  }

  getPartyDetails(party: Individual | Organization): string {
    if ('givenName' in party) {
      return `Individual • ${party.gender}`;
    }
    return `Organization • ${party.organizationType}${party.isLegalEntity ? ' • Legal Entity' : ''}`;
  }

  getPartyType(party: Individual | Organization): 'individual' | 'organization' {
    return 'givenName' in party ? 'individual' : 'organization';
  }
}

export const partyService = new PartyService();
