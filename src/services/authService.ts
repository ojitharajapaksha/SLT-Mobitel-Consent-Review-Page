import apiClient from './api';

// Authentication service for the consent management system
export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    type: 'individual' | 'organization';
  };
  message?: string;
  error?: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Since we don't have a dedicated sign-in endpoint, we'll simulate authentication
  // by checking if a user with the given email exists in the system
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      // First, check if the user exists as an individual
      const individuals = await apiClient.get<any[]>('/tmf-api/party/v5/individual');
      
      // Look for a user with matching email in authenticationContext or contactMedium
      const matchingIndividual = individuals.find(individual => {
        // Check authenticationContext email first (for users created via sign-up)
        if (individual.authenticationContext?.email === credentials.email) {
          return true;
        }
        
        // Also check contactMedium for legacy users
        return individual.contactMedium?.some((contact: any) => 
          contact.mediumType === 'email' && 
          contact.characteristic?.emailAddress === credentials.email
        );
      });

      if (matchingIndividual) {
        // For demo purposes, we'll accept any password for existing users
        // In a real system, you'd verify the password hash
        return {
          success: true,
          user: {
            id: matchingIndividual._id || matchingIndividual.id,
            email: matchingIndividual.authenticationContext?.email || credentials.email,
            name: matchingIndividual.fullName || `${matchingIndividual.givenName} ${matchingIndividual.familyName}`,
            type: 'individual'
          },
          message: 'Sign in successful'
        };
      }

      // If not found as individual, check organizations
      const organizations = await apiClient.get<any[]>('/tmf-api/party/v5/organization');
      
      const matchingOrganization = organizations.find(org => {
        // Check authenticationContext email first
        if (org.authenticationContext?.email === credentials.email) {
          return true;
        }
        
        // Also check contactMedium
        return org.contactMedium?.some((contact: any) => 
          contact.mediumType === 'email' && 
          contact.characteristic?.emailAddress === credentials.email
        );
      });

      if (matchingOrganization) {
        return {
          success: true,
          user: {
            id: matchingOrganization._id || matchingOrganization.id,
            email: matchingOrganization.authenticationContext?.email || credentials.email,
            name: matchingOrganization.name || matchingOrganization.tradingName,
            type: 'organization'
          },
          message: 'Sign in successful'
        };
      }

      // User not found
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials or sign up for a new account.'
      };

    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign in failed. Please try again.'
      };
    }
  }

  // Store user session (in localStorage for demo)
  storeUserSession(user: AuthResponse['user']): void {
    if (user) {
      localStorage.setItem('userSession', JSON.stringify(user));
    }
  }

  // Get current user session
  getCurrentUser(): AuthResponse['user'] | null {
    try {
      const session = localStorage.getItem('userSession');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  // Clear user session (sign out)
  clearUserSession(): void {
    localStorage.removeItem('userSession');
  }

  // Check if user is signed in
  isSignedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
export default authService;
