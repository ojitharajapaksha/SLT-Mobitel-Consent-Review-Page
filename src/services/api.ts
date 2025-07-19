// API Client Configuration
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, ''); // Remove trailing slashes

// Debug: Log the API base URL
console.log('🔗 API_BASE_URL:', API_BASE_URL);
console.log('✅ API Client loaded successfully');

// HTTP Client Interface
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Common HTTP client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL.replace(/\/+$/, ''); // Remove trailing slashes
  }

  // GET request
  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Ensure endpoint starts with a slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
      const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json().catch(() => null);
      
      return {
        data,
        status: response.status,
        error: !response.ok ? data?.message || 'Request failed' : undefined,
      };
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // POST request
  async post<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Ensure endpoint starts with a slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
      const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      const data = await response.json().catch(() => null);
      
      return {
        data,
        status: response.status,
        error: !response.ok ? data?.message || 'Request failed' : undefined,
      };
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // PUT request
  async put<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Ensure endpoint starts with a slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
      const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      const data = await response.json().catch(() => null);
      
      return {
        data,
        status: response.status,
        error: !response.ok ? data?.message || 'Request failed' : undefined,
      };
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // DELETE request
  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Ensure endpoint starts with a slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
      const response = await fetch(`${this.baseURL}${cleanEndpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json().catch(() => null);
      
      return {
        data,
        status: response.status,
        error: !response.ok ? data?.message || 'Request failed' : undefined,
      };
    } catch (error) {
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/health');
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
export { ApiClient, type ApiResponse };
