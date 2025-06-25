import React, { useState } from 'react';

const DebugConnection: React.FC = () => {
  const [result, setResult] = useState<string>('');
  
  const testDirect = async () => {
    try {
      setResult('Testing direct connection...');
      const response = await fetch('https://party-management-backend-production.up.railway.app/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Direct connection works! ${JSON.stringify(data)}`);
      } else {
        setResult(`❌ Direct connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
  };
  
  const testEnvVar = async () => {
    try {
      setResult('Testing with environment variable...');
      const healthUrl = import.meta.env.VITE_HEALTH_URL;
      setResult(`Using URL: ${healthUrl}`);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Env var connection works! ${JSON.stringify(data)}`);
      } else {
        setResult(`❌ Env var connection failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
  };
  
  return (
    <div className="p-4 m-4 border rounded bg-gray-100">
      <h3 className="text-lg font-bold mb-4">🔍 Debug Railway Connection</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>VITE_API_BASE_URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'undefined'}</p>
        <p><strong>VITE_HEALTH_URL:</strong> {import.meta.env.VITE_HEALTH_URL || 'undefined'}</p>
      </div>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={testDirect}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Direct URL
        </button>
        <button 
          onClick={testEnvVar}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Env Var URL
        </button>
      </div>
      
      <div className="p-3 bg-white border rounded">
        <strong>Result:</strong>
        <pre className="mt-2 text-sm">{result}</pre>
      </div>
    </div>
  );
};

export default DebugConnection;
