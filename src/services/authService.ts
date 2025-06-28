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

  // Authentication that checks against MongoDB database
  // Will be enhanced with Firebase authentication later
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      // Basic validation - check if email and password are provided
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Please provide both email and password.'
        };
      }

      // Try to check if the user exists in MongoDB, with fallback
      let individuals: any[] = [];
      let organizations: any[] = [];
      
      try {
        // Check if the user exists as an individual in MongoDB
        const individualsResponse = await apiClient.get<any[]>('/tmf-api/party/v5/individual');
        individuals = individualsResponse.data || [];
        
        // If not found as individual, check organizations
        const organizationsResponse = await apiClient.get<any[]>('/tmf-api/party/v5/organization');
        organizations = organizationsResponse.data || [];
      } catch (apiError) {
        console.log('MongoDB connection issue, using fallback authentication');
        // Fallback: Accept any valid email/password for demo purposes
        if (credentials.email.includes('@') && credentials.password.length >= 6) {
          // Show success alert
          alert('You have successfully logged in!');
          
          // Redirect to MySLT website
          window.location.href = 'https://myslt.slt.lk/';
          
          const userName = credentials.email.split('@')[0];
          return {
            success: true,
            user: {
              id: `temp_${Date.now()}`,
              email: credentials.email,
              name: userName.charAt(0).toUpperCase() + userName.slice(1),
              type: 'individual'
            },
            message: 'Sign in successful (fallback mode)'
          };
        } else {
          return {
            success: false,
            error: 'Please enter a valid email and password (minimum 6 characters).'
          };
        }
      }
      
      // Look for a user with matching email in authenticationContext or contactMedium
      const matchingIndividual = individuals.find((individual: any) => {
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
        // In a real system with Firebase, you'd verify the password hash
        
        // Show success alert
        alert('You have successfully logged in!');
        
        // Redirect to MySLT website
        window.location.href = 'https://myslt.slt.lk/';
        
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
      const matchingOrganization = organizations.find((org: any) => {
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
        // Show success alert
        alert('You have successfully logged in!');
        
        // Redirect to MySLT website
        window.location.href = 'https://myslt.slt.lk/';
        
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

      // User not found in database
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
