import { Individual, Organization } from './partyService';

export interface AuthSession {
  user: Individual | Organization;
  userType: 'individual' | 'organization';
  isAuthenticated: boolean;
  loginTime: string;
  token?: string;
}

const API_BASE_URL = 'http://localhost:3000';

class AuthService {
  private static readonly SESSION_KEY = 'auth_session';

  // Save authentication session to localStorage
  saveSession(user: Individual | Organization, userType: 'individual' | 'organization', token?: string): AuthSession {
    const session: AuthSession = {
      user,
      userType,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
      token
    };

    try {
      localStorage.setItem(AuthService.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to save auth session to localStorage:', error);
    }

    return session;
  }

  // Get current authentication session
  getSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(AuthService.SESSION_KEY);
      if (!stored) return null;

      const session: AuthSession = JSON.parse(stored);
      
      // Check if session is expired (24 hours)
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.warn('Failed to get auth session from localStorage:', error);
      return null;
    }
  }

  // Clear authentication session
  clearSession(): void {
    try {
      localStorage.removeItem(AuthService.SESSION_KEY);
    } catch (error) {
      console.warn('Failed to clear auth session from localStorage:', error);
    }
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    const session = this.getSession();
    return session?.isAuthenticated === true;
  }

  // Get current user
  getCurrentUser(): (Individual | Organization) | null {
    const session = this.getSession();
    return session?.user || null;
  }

  // Get current user type
  getCurrentUserType(): 'individual' | 'organization' | null {
    const session = this.getSession();
    return session?.userType || null;
  }

  // Real authentication with backend API
  async authenticateUser(email: string, password: string, userType: 'individual' | 'organization'): Promise<Individual | Organization> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tmf-api/auth/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Authentication failed');
      }

      // Store the token for future requests
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      return data.user;
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // If backend is not available, fall back to mock authentication
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock authentication');
        return this.mockAuthenticateUser(email, password, userType);
      }
      
      throw error;
    }
  }

  // Mock authentication (fallback when backend is not available)
  private async mockAuthenticateUser(email: string, password: string, userType: 'individual' | 'organization'): Promise<Individual | Organization> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mock user based on type
    const mockUser = userType === 'individual' ? {
      _id: `demo_individual_${Date.now()}`,
      givenName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      familyName: 'User',
      gender: 'prefer-not-to-say',
      nationality: 'LK',
      status: 'active',
      contactMedium: [{ 
        type: 'email', 
        value: email, 
        preferred: true,
        validFor: {
          startDateTime: new Date(),
          endDateTime: null
        }
      }],
      languageAbility: [],
      skill: [],
      individualIdentification: [],
      externalReference: [],
      partyCharacteristic: [],
      taxExemptionCertificate: [],
      relatedParty: []
    } as Individual : {
      _id: `demo_organization_${Date.now()}`,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) + ' Organization',
      tradingName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) + ' Organization',
      organizationType: 'private-company',
      isLegalEntity: true,
      isHeadOffice: true,
      status: 'active',
      contactMedium: [{ 
        type: 'email', 
        value: email, 
        preferred: true,
        validFor: {
          startDateTime: new Date(),
          endDateTime: null
        }
      }],
      externalReference: [],
      organizationChildRelationship: [],
      organizationParentRelationship: [],
      organizationIdentification: [],
      partyCharacteristic: [],
      taxExemptionCertificate: [],
      creditRating: [],
      relatedParty: []
    } as Organization;

    return mockUser;
  }
}

export const authService = new AuthService();
