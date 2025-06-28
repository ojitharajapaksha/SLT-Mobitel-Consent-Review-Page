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

  // Simplified authentication - accepts any valid credentials
  // Will be replaced with Firebase authentication later
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      // Basic validation - just check if email and password are provided
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Please provide both email and password.'
        };
      }

      // For demo purposes, accept any credentials that pass basic validation
      // Simulate a brief delay to mimic real authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a simple user object from the email
      const userName = credentials.email.split('@')[0];
      
      // Show success alert
      alert('You have successfully logged in!');
      
      // Redirect to MySLT website
      window.location.href = 'https://myslt.slt.lk/';
      
      return {
        success: true,
        user: {
          id: `user_${Date.now()}`, // Generate a simple ID
          email: credentials.email,
          name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
          type: 'individual' // Default to individual for now
        },
        message: 'Sign in successful'
      };

    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'Sign in failed. Please try again.'
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
