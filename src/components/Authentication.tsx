import React, { useState, useEffect } from 'react';
import { User, Building, ArrowRight, Loader2, Moon, Sun, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { partyService, Individual, Organization } from '../services/partyService';
import { authService } from '../services/authService';

interface AuthenticationProps {
  onAuthenticated: (party: Individual | Organization, type: 'individual' | 'organization') => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Authentication: React.FC<AuthenticationProps> = ({ 
  onAuthenticated, 
  darkMode = false, 
  onToggleDarkMode 
}) => {
  const [mode, setMode] = useState<'login' | 'register' | null>(null);
  const [accountType, setAccountType] = useState<'individual' | 'organization' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkBackendConnection = async () => {
      setBackendStatus('checking');
      try {
        console.log('[Authentication] Checking backend connection...');
        
        // Test health endpoint
        const healthUrl = import.meta.env.VITE_HEALTH_URL || 'http://localhost:3000/health';
        const testResponse = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('[Authentication] Test response:', testResponse.status, testResponse.statusText);
        
        if (testResponse.ok) {
          const data = await testResponse.json();
          console.log('[Authentication] Backend response:', data);
          setBackendStatus('connected');
        } else {
          console.error('[Authentication] Backend returned error:', testResponse.status);
          setBackendStatus('disconnected');
        }
      } catch (error) {
        console.error('[Authentication] Backend connection failed:', error);
        setBackendStatus('disconnected');
        
        // Try to provide more specific error information
        if (error instanceof Error) {
          if (error.message.includes('fetch')) {
            console.error('[Authentication] This appears to be a network/CORS issue');
          }
        }
      }
    };
    
    checkBackendConnection();

    // Optional: Re-check status every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Use auth service for authentication
      const authenticatedUser = await authService.authenticateUser(
        formData.email, 
        formData.password, 
        accountType!
      );

      // Save session (token is handled inside authService)
      authService.saveSession(authenticatedUser, accountType!);
      
      onAuthenticated(authenticatedUser, accountType!);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Common validations
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      let createdParty: Individual | Organization;

      if (accountType === 'individual') {
        // Individual specific validations - only essential TMF632 fields
        if (!formData.givenName || !formData.familyName || !formData.mobileNumber || !formData.nationalId) {
          throw new Error('Please fill in all required fields: First Name, Last Name, Mobile Number, and National ID');
        }

        const individualData: Omit<Individual, '_id' | 'createdAt' | 'updatedAt'> = {
          givenName: formData.givenName,
          familyName: formData.familyName,
          gender: 'not-specified', // Optional field, set default
          nationality: 'LK',
          status: 'active',
          // Essential contact medium according to TMF632
          contactMedium: [
            {
              type: 'email',
              value: formData.email,
              preferred: true,
              validFor: {
                startDateTime: new Date(),
                endDateTime: null
              }
            },
            {
              type: 'mobile',
              value: formData.mobileNumber,
              preferred: true,
              validFor: {
                startDateTime: new Date(),
                endDateTime: null
              }
            }
          ],
          // Essential identification according to TMF632
          individualIdentification: [{
            type: formData.nationalId.length > 10 ? 'passport' : 'nationalId',
            identificationId: formData.nationalId,
            issuingAuthority: formData.nationalId.length > 10 ? 'Department of Immigration' : 'Department of Registration of Persons',
            issuingDate: null,
            validFor: {
              startDateTime: new Date(),
              endDateTime: null
            }
          }],
          languageAbility: [],
          skill: [],
          externalReference: [],
          partyCharacteristic: [
            {
              name: 'password',
              value: formData.password, // In production, this should be hashed
              valueType: 'string'
            }
          ],
          taxExemptionCertificate: [],
          relatedParty: []
        };

        createdParty = await partyService.createIndividual(individualData);
      } else {
        // Organization specific validations - only essential TMF632 fields
        if (!formData.name || !formData.organizationType || !formData.businessRegNumber || !formData.businessPhone) {
          throw new Error('Please fill in all required fields: Organization Name, Type, Registration Number, and Business Phone');
        }

        const organizationData: Omit<Organization, '_id' | 'createdAt' | 'updatedAt'> = {
          name: formData.name,
          tradingName: formData.name,
          organizationType: formData.organizationType,
          isLegalEntity: true, // Default for business entities
          isHeadOffice: true,
          status: 'active',
          // Essential contact medium according to TMF632
          contactMedium: [
            {
              type: 'email',
              value: formData.email,
              preferred: true,
              validFor: {
                startDateTime: new Date(),
                endDateTime: null
              }
            },
            {
              type: 'phone',
              value: formData.businessPhone,
              preferred: true,
              validFor: {
                startDateTime: new Date(),
                endDateTime: null
              }
            }
          ],
          // Essential organization identification according to TMF632
          organizationIdentification: [{
            type: 'businessRegistration',
            identificationId: formData.businessRegNumber,
            issuingAuthority: 'Registrar of Companies',
            issuingDate: null,
            validFor: {
              startDateTime: new Date(),
              endDateTime: null
            }
          }],
          externalReference: [],
          organizationChildRelationship: [],
          organizationParentRelationship: [],
          partyCharacteristic: [
            {
              name: 'password',
              value: formData.password, // In production, this should be hashed
              valueType: 'string'
            }
          ],
          taxExemptionCertificate: [],
          creditRating: [],
          relatedParty: []
        };

        createdParty = await partyService.createOrganization(organizationData);
      }

      // Success message with essential data summary
      console.log(`Successfully registered ${accountType} with essential TMF632 data:`, {
        id: createdParty._id,
        type: accountType,
        name: accountType === 'individual' ? `${formData.givenName} ${formData.familyName}` : formData.name,
        contactMedium: createdParty.contactMedium?.length || 0,
        identification: accountType === 'individual' ? 
          (createdParty as Individual).individualIdentification?.length || 0 : 
          (createdParty as Organization).organizationIdentification?.length || 0
      });

      onAuthenticated(createdParty, accountType!);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <div className="px-8 pb-8 space-y-6">
      <div className="text-center">
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Select Customer Type
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          To access MySLT services, we need to collect your consent for data processing as per TMF632 standards
        </p>
        <div className={`text-xs p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
          <p className={`${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            � Please select your customer type to proceed with appropriate consent collection
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => {
            setAccountType('individual');
            setMode('login'); // Directly go to login
          }}
          className={`w-full p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${
            darkMode
              ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <User className="w-8 h-8 text-blue-600" />
            <div className="text-left">
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Individual Customer
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Personal MySLT account (TMF632 Individual Party)
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 ml-auto" />
          </div>
        </button>

        <button
          onClick={() => {
            setAccountType('organization');
            setMode('login'); // Directly go to login
          }}
          className={`w-full p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${
            darkMode
              ? 'border-gray-600 hover:border-green-500 hover:bg-gray-700/50'
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <Building className="w-8 h-8 text-green-600" />
            <div className="text-left">
              <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Business/Corporate Customer
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enterprise MySLT account (TMF632 Organization Party)
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 ml-auto" />
          </div>
        </button>
      </div>
      
      <div className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>By continuing, you agree to provide consent for data processing</p>
        <p>in accordance with TMF632 Party Management standards</p>
      </div>

      {/* Consent Management Portal Link */}
      <div className="flex justify-center">
        <a 
          href="https://consent-management-system-api.vercel.app/"
          className={`text-xs inline-flex items-center space-x-1 px-4 py-2 rounded-full border transition-colors duration-200 ${
            darkMode 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
              : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Login to Consent Management Portal</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="px-8 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          MySLT Login - {accountType === 'individual' ? 'Individual Customer' : 'Business Customer'}
        </h3>
        <button
          onClick={() => {
            setAccountType(null);
            setMode(null);
            setFormData({});
          }}
          className={`text-sm px-3 py-1 rounded-lg transition-colors duration-200 ${
            darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Back
        </button>
      </div>

      <div className={`text-sm p-3 rounded-lg mb-4 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
        <p className={`${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          🔐 Use your existing MySLT credentials. After login, you'll be asked to provide consent for data processing.
        </p>
        {backendStatus === 'connected' && (
          <p className={`${darkMode ? 'text-green-400' : 'text-green-700'} text-xs mt-1`}>
            ✅ Connected to live database
          </p>
        )}
        {backendStatus === 'disconnected' && (
          <p className={`${darkMode ? 'text-yellow-400' : 'text-yellow-700'} text-xs mt-1`}>
            ⚠️ Demo mode - backend not available
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            MySLT Username/Email *
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
            placeholder="Enter your MySLT username or email"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            MySLT Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
              placeholder="Enter your MySLT password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In to MySLT Portal'
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`text-sm ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Don't have an account? Register here
          </button>
        </div>
      </form>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="px-8 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Register - {accountType === 'individual' ? 'Individual Customer' : 'Business Customer'}
        </h3>
        <button
          onClick={() => {
            setAccountType(null);
            setMode(null);
            setFormData({});
          }}
          className={`text-sm px-3 py-1 rounded-lg transition-colors duration-200 ${
            darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Back
        </button>
      </div>

      <div className={`text-sm p-3 rounded-lg mb-4 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
        <p className={`${darkMode ? 'text-green-400' : 'text-green-700'} font-medium mb-2`}>
          📝 Essential TMF632 Data Collection
        </p>
        <p className={`${darkMode ? 'text-green-300' : 'text-green-600'} text-xs mb-2`}>
          We collect only the minimum required data according to TMF632 standards:
        </p>
        {backendStatus === 'connected' && (
          <p className={`${darkMode ? 'text-green-400' : 'text-green-700'} text-xs mb-2`}>
            ✅ Data will be saved to live database
          </p>
        )}
        {backendStatus === 'disconnected' && (
          <p className={`${darkMode ? 'text-yellow-400' : 'text-yellow-700'} text-xs mb-2`}>
            ⚠️ Demo mode - data will not be permanently saved
          </p>
        )}
        <ul className={`${darkMode ? 'text-green-300' : 'text-green-600'} text-xs space-y-1`}>
          {accountType === 'individual' ? (
            <>
              <li>• <strong>Identity:</strong> Full name and National ID</li>
              <li>• <strong>Contact:</strong> Email and mobile number</li>
              <li>• <strong>Authentication:</strong> Secure login credentials</li>
            </>
          ) : (
            <>
              <li>• <strong>Organization:</strong> Name and business type</li>
              <li>• <strong>Registration:</strong> Business registration number</li>
              <li>• <strong>Contact:</strong> Email and business phone</li>
              <li>• <strong>Authentication:</strong> Secure login credentials</li>
            </>
          )}
        </ul>
        <p className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-xs mt-2 font-medium`}>
          ✓ TMF632 compliant • ✓ Minimal data collection • ✓ Secure storage
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
              placeholder="Create a password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Password must be at least 8 characters long
          </p>
        </div>

        {accountType === 'individual' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.givenName || ''}
                  onChange={(e) => handleInputChange('givenName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.familyName || ''}
                  onChange={(e) => handleInputChange('familyName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.mobileNumber || ''}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
                placeholder="+94 77 123 4567"
                required
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Primary contact for MySLT services
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                National ID Number *
              </label>
              <input
                type="text"
                value={formData.nationalId || ''}
                onChange={(e) => handleInputChange('nationalId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
                placeholder="123456789V or 200012345678"
                required
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Required for TMF632 individual identification
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${inputClasses}`}
                placeholder="Enter organization name"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Organization Type *
              </label>
              <select
                value={formData.organizationType || ''}
                onChange={(e) => handleInputChange('organizationType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${inputClasses}`}
                required
              >
                <option value="">Select type</option>
                <option value="private-company">Private Company</option>
                <option value="public-company">Public Company</option>
                <option value="partnership">Partnership</option>
                <option value="sole-proprietorship">Sole Proprietorship</option>
                <option value="non-profit">Non-Profit Organization</option>
                <option value="government">Government Entity</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Business Registration Number *
              </label>
              <input
                type="text"
                value={formData.businessRegNumber || ''}
                onChange={(e) => handleInputChange('businessRegNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${inputClasses}`}
                placeholder="PV 12345 or BR/123/456"
                required
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Required for TMF632 organization identification
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Business Phone *
              </label>
              <input
                type="tel"
                value={formData.businessPhone || ''}
                onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${inputClasses}`}
                placeholder="+94 11 123 4567"
                required
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Primary contact for business communications
              </p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center ${
            accountType === 'individual'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            `Create MySLT ${accountType === 'individual' ? 'Individual' : 'Business'} Account`
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`text-sm ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Already have an account? Sign in here
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}>
      {/* Theme Toggle */}
      {onToggleDarkMode && (
        <button
          onClick={onToggleDarkMode}
          className="fixed top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}

      <div className={`w-full max-w-lg mx-auto border rounded-2xl shadow-2xl transition-colors duration-300 ${cardClasses}`}>
        {/* Header */}
        <div className="p-8 pb-6">
          <div className="flex justify-center mb-6">
            <img 
              src="/SLTMobitel_Logo.svg.png" 
              alt="SLT Mobitel" 
              className="h-16 w-auto"
            />
          </div>
          
          <div className="text-center space-y-2">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Consent Management System
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              TMF632 Compliant Data Processing
            </p>
            
            {/* Backend Status Indicator */}
            <div className="flex items-center justify-center space-x-2 mt-2">
              {backendStatus === 'checking' && (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Checking backend...
                  </span>
                </>
              )}
              {backendStatus === 'connected' && (
                <>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Backend connected
                  </span>
                </>
              )}
              {backendStatus === 'disconnected' && (
                <>
                  <XCircle className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                    Using demo mode
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {!accountType && renderWelcome()}
        {mode === 'login' && accountType && renderLoginForm()}
        {mode === 'register' && accountType && renderRegisterForm()}

        {/* Backend Connection Status */}
        <div className="px-8 py-4 border-t mt-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Backend Connection Status:
            </span>
            <div className="flex items-center space-x-2">
              {backendStatus === 'checking' && (
                <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
              )}
              {backendStatus === 'connected' && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
              )}
              {backendStatus === 'disconnected' && (
                <div className="flex items-center space-x-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Disconnected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
