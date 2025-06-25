// API Configuration
const API_BASE_URL = import.meta.env.VITE_TMF_API_BASE_URL || 'https://party-management-api-production.up.railway.app/tmf-api/partyManagement/v4';

// API client with proper error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors', // Enable CORS
      credentials: 'include', // Include cookies if needed
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
          // If not JSON, use the text as is
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
        return text as unknown as T;
      }
    } catch (error) {
      console.error('API Request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Types for API responses
export interface CreatePartyResponse {
  id: string;
  partyType: string;
  status: string;
  individual?: {
    firstName: string;
    lastName: string;
    familyName: string;
    contactMedium: Array<{
      mediumType: string;
      characteristic: {
        emailAddress?: string;
        phoneNumber?: string;
      };
    }>;
  };
  organization?: {
    name: string;
    organizationType: string;
    contactMedium: Array<{
      mediumType: string;
      characteristic: {
        emailAddress?: string;
        phoneNumber?: string;
      };
    }>;
  };
}

export interface PartyData {
  partyType: 'individual' | 'organization';
  individual?: {
    firstName: string;
    lastName: string;
    familyName: string;
    contactMedium: Array<{
      mediumType: string;
      characteristic: {
        emailAddress?: string;
        phoneNumber?: string;
      };
    }>;
  };
  organization?: {
    name: string;
    organizationType: string;
    contactMedium: Array<{
      mediumType: string;
      characteristic: {
        emailAddress?: string;
        phoneNumber?: string;
      };
    }>;
  };
}

// API functions
export const partyApi = {
  // Create a new party (individual or organization)
  async createParty(data: PartyData): Promise<CreatePartyResponse> {
    try {
      return await apiClient.post<CreatePartyResponse>('/individual', data);
    } catch (error) {
      console.error('Failed to create party:', error);
      throw error;
    }
  },

  // Get all parties
  async getParties(): Promise<CreatePartyResponse[]> {
    try {
      return await apiClient.get<CreatePartyResponse[]>('/individual');
    } catch (error) {
      console.error('Failed to get parties:', error);
      throw error;
    }
  },

  // Get party by ID
  async getPartyById(id: string): Promise<CreatePartyResponse> {
    try {
      return await apiClient.get<CreatePartyResponse>(`/individual/${id}`);
    } catch (error) {
      console.error('Failed to get party:', error);
      throw error;
    }
  },

  // Update party
  async updateParty(id: string, data: Partial<PartyData>): Promise<CreatePartyResponse> {
    try {
      return await apiClient.put<CreatePartyResponse>(`/individual/${id}`, data);
    } catch (error) {
      console.error('Failed to update party:', error);
      throw error;
    }
  },

  // Delete party
  async deleteParty(id: string): Promise<void> {
    try {
      return await apiClient.delete<void>(`/individual/${id}`);
    } catch (error) {
      console.error('Failed to delete party:', error);
      throw error;
    }
  },

  // Create organization
  async createOrganization(data: PartyData): Promise<CreatePartyResponse> {
    try {
      return await apiClient.post<CreatePartyResponse>('/organization', data);
    } catch (error) {
      console.error('Failed to create organization:', error);
      throw error;
    }
  }
};

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing API connection...');
    const healthUrl = import.meta.env.VITE_HEALTH_URL || 'https://party-management-api-production.up.railway.app/health';
    const response = await fetch(healthUrl);
    if (response.ok) {
      console.log('API connection successful');
      return true;
    } else {
      throw new Error(`Health check failed: ${response.status}`);
    }
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
};

export default apiClient;
