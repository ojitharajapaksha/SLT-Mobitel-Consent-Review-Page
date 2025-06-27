import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const ApiTestComponent: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'failed' | 'hidden'>('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await authService.testConnection();
        setConnectionStatus(isConnected ? 'success' : 'failed');
        if (!isConnected) {
          setErrorMessage('API connection test failed');
        }
      } catch (error) {
        setConnectionStatus('failed');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    testConnection();
  }, []);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (connectionStatus === 'success') {
      const timer = setTimeout(() => {
        setConnectionStatus('hidden');
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [connectionStatus]);

  if (connectionStatus === 'testing') {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Testing API connection...</span>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'failed') {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="text-sm">
          <div className="font-semibold">API Connection Failed</div>
          <div>{errorMessage}</div>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'success') {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>API Connected Successfully</span>
        </div>
      </div>
    );
  }

  // Hidden state - render nothing
  return null;
};

export default ApiTestComponent;
