// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Interface definitions for API requests
export interface IndividualData {
  givenName: string;
  familyName: string;
  fullName?: string;
  title?: string;
  birthDate?: string;
  countryOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'unknown';
  nationality?: string;
  placeOfBirth?: string;
  status?: 'initialized' | 'validated' | 'active' | 'inactive' | 'terminated';
  contactMedium?: Array<{
    mediumType: 'email' | 'phone' | 'mobile' | 'fax' | 'pager' | 'sms' | 'landline' | 'other';
    preferred: boolean;
    characteristic: {
      emailAddress?: string;
      phoneNumber?: string;
      faxNumber?: string;
      city?: string;
      country?: string;
      postCode?: string;
      stateOrProvince?: string;
      street1?: string;
      street2?: string;
    };
    validFor?: {
      startDateTime?: Date;
      endDateTime?: Date;
    };
  }>;
  languageAbility?: Array<{
    languageCode?: string;
    languageName?: string;
    listeningProficiency?: string;
    readingProficiency?: string;
    speakingProficiency?: string;
    writingProficiency?: string;
    isFavouriteLanguage?: boolean;
  }>;
  skill?: Array<{
    skillCode?: string;
    skillName?: string;
    comment?: string;
    evaluatedLevel?: string;
    skillCategory?: string;
  }>;
  individualIdentification?: Array<{
    identificationType: 'passport' | 'nationalId' | 'drivingLicense' | 'socialSecurity' | 'other';
    identificationId: string;
    issuingAuthority?: string;
    issuingDate?: Date;
    validFor?: {
      startDateTime?: Date;
      endDateTime?: Date;
    };
  }>;
  authenticationContext?: {
    email?: string;
    agreedToTerms?: boolean;
    subscribedToNewsletter?: boolean;
    accountCreationDate?: Date;
  };
}

export interface OrganizationData {
  name: string;
  tradingName?: string;
  nameType?: 'legal' | 'trading' | 'brand' | 'other';
  organizationType?: 'company' | 'partnership' | 'sole_proprietorship' | 'nonprofit' | 'government' | 'corporation' | 'llc' | 'other';
  existsDuring?: {
    startDateTime?: Date;
    endDateTime?: Date;
  };
  isHeadOffice?: boolean;
  isLegalEntity?: boolean;
  status?: 'initialized' | 'validated' | 'active' | 'inactive' | 'terminated';
  contactMedium?: Array<{
    mediumType: 'email' | 'phone' | 'mobile' | 'fax' | 'pager' | 'sms' | 'landline' | 'website' | 'other';
    preferred: boolean;
    characteristic: {
      emailAddress?: string;
      phoneNumber?: string;
      faxNumber?: string;
      website?: string;
      socialNetworkId?: string;
      city?: string;
      country?: string;
      postCode?: string;
      stateOrProvince?: string;
      street1?: string;
      street2?: string;
    };
    validFor?: {
      startDateTime?: Date;
      endDateTime?: Date;
    };
  }>;
  organizationIdentification?: Array<{
    identificationType: 'businessRegistration' | 'taxId' | 'vatNumber' | 'duns' | 'lei' | 'other';
    identificationId: string;
    issuingAuthority?: string;
    issuingDate?: Date;
    validFor?: {
      startDateTime?: Date;
      endDateTime?: Date;
    };
  }>;
  authenticationContext?: {
    contactEmail?: string;
    contactPersonName?: string;
    agreedToTerms?: boolean;
    subscribedToNewsletter?: boolean;
    accountCreationDate?: Date;
  };
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
  // Additional organization fields
  organizationName?: string;
  organizationType?: 'company' | 'partnership' | 'sole_proprietorship' | 'nonprofit' | 'government' | 'corporation' | 'llc' | 'other';
  businessRegistrationNumber?: string;
}

export type PartyType = 'individual' | 'organization';

class PartyManagementService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include',
      ...options,
    };

    try {
      console.log(`Making request to: ${url}`);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('API Response:', data);
        return data;
      } else {
        const text = await response.text();
        console.log('API Response (text):', text);
        return text;
      }
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and verify the server is running.');
      }
      
      throw error;
    }
  }

  // Create Individual Party
  async createIndividual(formData: SignUpFormData): Promise<any> {
    const individualData: IndividualData = {
      givenName: formData.firstName,
      familyName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      status: 'active',
      contactMedium: [
        {
          mediumType: 'email',
          preferred: true,
          characteristic: {
            emailAddress: formData.email,
          },
        },
        {
          mediumType: 'phone',
          preferred: false,
          characteristic: {
            phoneNumber: formData.phone,
          },
        },
      ],
      authenticationContext: {
        email: formData.email,
        agreedToTerms: formData.agreeToTerms,
        subscribedToNewsletter: formData.subscribeToNewsletter,
        accountCreationDate: new Date(),
      }
    };

    // Include password for backend processing (will be hashed there)
    const requestData = {
      ...individualData,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      // Also send original form field names for backend compatibility
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      agreeToTerms: formData.agreeToTerms,
      subscribeToNewsletter: formData.subscribeToNewsletter,
    };

    return this.makeRequest('/tmf-api/party/v5/individual', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Create Organization Party
  async createOrganization(formData: SignUpFormData): Promise<any> {
    const organizationData: OrganizationData = {
      name: formData.organizationName || `${formData.firstName} ${formData.lastName} Organization`,
      tradingName: formData.organizationName,
      organizationType: formData.organizationType || 'company',
      isLegalEntity: true,
      isHeadOffice: true,
      status: 'active',
      contactMedium: [
        {
          mediumType: 'email',
          preferred: true,
          characteristic: {
            emailAddress: formData.email,
          },
        },
        {
          mediumType: 'phone',
          preferred: false,
          characteristic: {
            phoneNumber: formData.phone,
          },
        },
      ],
      authenticationContext: {
        contactEmail: formData.email,
        contactPersonName: `${formData.firstName} ${formData.lastName}`,
        agreedToTerms: formData.agreeToTerms,
        subscribedToNewsletter: formData.subscribeToNewsletter,
        accountCreationDate: new Date(),
      }
    };

    if (formData.businessRegistrationNumber) {
      organizationData.organizationIdentification = [
        {
          identificationType: 'businessRegistration',
          identificationId: formData.businessRegistrationNumber,
          issuingDate: new Date(),
        },
      ];
    }

    // Include password for backend processing (will be hashed there)
    const requestData = {
      ...organizationData,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      // Also send original form field names for backend compatibility
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      businessRegistrationNumber: formData.businessRegistrationNumber,
      agreeToTerms: formData.agreeToTerms,
      subscribeToNewsletter: formData.subscribeToNewsletter,
    };

    return this.makeRequest('/tmf-api/party/v5/organization', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  // Get all individuals
  async getIndividuals(): Promise<any[]> {
    return this.makeRequest('/tmf-api/party/v5/individual');
  }

  // Get all organizations
  async getOrganizations(): Promise<any[]> {
    return this.makeRequest('/tmf-api/party/v5/organization');
  }

  // Get individual by ID
  async getIndividualById(id: string): Promise<any> {
    return this.makeRequest(`/tmf-api/party/v5/individual/${id}`);
  }

  // Get organization by ID
  async getOrganizationById(id: string): Promise<any> {
    return this.makeRequest(`/tmf-api/party/v5/organization/${id}`);
  }

  // Update individual
  async updateIndividual(id: string, data: Partial<IndividualData>): Promise<any> {
    return this.makeRequest(`/tmf-api/party/v5/individual/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Update organization
  async updateOrganization(id: string, data: Partial<OrganizationData>): Promise<any> {
    return this.makeRequest(`/tmf-api/party/v5/organization/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Delete individual
  async deleteIndividual(id: string): Promise<void> {
    return this.makeRequest(`/tmf-api/party/v5/individual/${id}`, {
      method: 'DELETE',
    });
  }

  // Delete organization
  async deleteOrganization(id: string): Promise<void> {
    return this.makeRequest(`/tmf-api/party/v5/organization/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const partyManagementService = new PartyManagementService();

// Export individual functions for easier importing
export const {
  createIndividual,
  createOrganization,
  getIndividuals,
  getOrganizations,
  getIndividualById,
  getOrganizationById,
  updateIndividual,
  updateOrganization,
  deleteIndividual,
  deleteOrganization,
} = partyManagementService;
