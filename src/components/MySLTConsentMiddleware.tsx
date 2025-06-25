// MySLT Consent Integration Middleware
// This component can be integrated into the existing MySLT portal

import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, FileText, User, Building } from 'lucide-react';
import { partyService } from '../services/partyService';


interface ConsentMiddlewareProps {
  // MySLT user session data (passed from existing MySLT portal)
  mySLTUser?: {
    id: string;
    email: string;
    phone?: string;
    accountType: 'individual' | 'organization';
    name: string;
    // Add other MySLT user properties as needed
  };
  onConsentComplete: (consentData: any) => void;
  onSkip?: () => void; // Optional skip for existing users
  darkMode?: boolean;
}

const MySLTConsentMiddleware: React.FC<ConsentMiddlewareProps> = ({
  mySLTUser,
  onConsentComplete,
  onSkip,
  darkMode = false
}) => {
  const [currentStep, setCurrentStep] = useState<'check' | 'consent' | 'processing' | 'complete'>('check');
  const [existingConsent, setExistingConsent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consentChoices, setConsentChoices] = useState({
    marketingEmails: false,
    personalization: false,
    thirdPartySharing: false,
    serviceUsageLogs: false,
    termsAndPrivacy: true // Required - automatically set to true
  });

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  // Check if user already has valid consent
  useEffect(() => {
    const checkExistingConsent = async () => {
      if (!mySLTUser) {
        setCurrentStep('consent');
        setLoading(false);
        return;
      }

      try {
        // Check for existing consent in TMF632 system
        const response = await fetch(`http://localhost:3001/tmf-api/consent/v1/party/${mySLTUser.id}/latest`);
        
        if (response.ok) {
          const consent = await response.json();
          
          // Check if consent is still valid (within 1 year)
          const consentDate = new Date(consent.consentTimestamp);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          
          if (consentDate > oneYearAgo) {
            setExistingConsent(consent);
            setCurrentStep('complete');
          } else {
            setCurrentStep('consent');
          }
        } else {
          setCurrentStep('consent');
        }
      } catch (err) {
        console.error('Error checking existing consent:', err);
        setCurrentStep('consent');
      } finally {
        setLoading(false);
      }
    };

    checkExistingConsent();
  }, [mySLTUser]);

  const handleConsentSubmit = async () => {
    if (!mySLTUser) {
      setError('User session not found. Please log in to MySLT first.');
      return;
    }

    setCurrentStep('processing');
    setError(null);

    try {
      // Create consent record for TMF632 compliance
      const consentRecord = {
        partyId: mySLTUser.id,
        partyType: mySLTUser.accountType,
        consents: consentChoices,
        consentTimestamp: new Date().toISOString(),
        ipAddress: '', // Will be set by backend
        userAgent: navigator.userAgent,
        consentVersion: '1.0',
        legalBasis: 'consent',
        purpose: 'MySLT portal services and TMF632 compliance',
        dataRetentionPeriod: '7 years',
        withdrawalMethod: 'MySLT portal settings or customer service'
      };

      await partyService.saveConsent(consentRecord);
      
      setCurrentStep('complete');
      
      // Notify parent component that consent is complete
      setTimeout(() => {
        onConsentComplete({
          consentId: `consent_${Date.now()}`,
          consents: consentChoices,
          timestamp: new Date().toISOString()
        });
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to save consent. Please try again.');
      setCurrentStep('consent');
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses}`}>
        <div className={`p-8 rounded-xl border shadow-lg ${cardClasses} text-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Checking Consent Status</h2>
          <p className="text-gray-600">Please wait while we verify your consent preferences...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'check' || currentStep === 'processing') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses}`}>
        <div className={`p-8 rounded-xl border shadow-lg ${cardClasses} text-center max-w-md`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            {currentStep === 'processing' ? 'Processing Consent' : 'Checking Status'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 'processing' 
              ? 'Saving your consent preferences...' 
              : 'Verifying your account status...'}
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses}`}>
        <div className={`p-8 rounded-xl border shadow-lg ${cardClasses} text-center max-w-md`}>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Consent Recorded</h2>
          <p className="text-gray-600 mb-6">
            {existingConsent 
              ? 'Your existing consent preferences are valid and up to date.'
              : 'Thank you for providing your consent preferences. You will now be redirected to MySLT.'}
          </p>
          <div className="text-sm text-gray-500">
            <p>Redirecting to MySLT portal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* MySLT Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/SLTMobitel_Logo.svg.png" alt="SLT Mobitel" className="h-8" />
            <h1 className="text-xl font-bold">MySLT Portal</h1>
          </div>
          {mySLTUser && (
            <div className="flex items-center space-x-2">
              {mySLTUser.accountType === 'individual' ? <User size={16} /> : <Building size={16} />}
              <span className="text-sm">{mySLTUser.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium">TMF632 Consent</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">MySLT Services</span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border shadow-lg p-8 ${cardClasses}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Data Consent & Privacy</h1>
            <p className="text-lg text-gray-600">
              Welcome to MySLT Portal. We comply with TMF632 standards for data privacy and transparency.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Consent Form */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                Your Data, Your Choice
              </h3>
              <p className="text-gray-700 mb-4">
                As per TMF632 Party Management standards, we need your explicit consent to process your data 
                for MySLT services. You can withdraw consent at any time through your MySLT account settings.
              </p>
            </div>

            {/* Consent Options */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChoices.termsAndPrivacy}
                    disabled={true} // Required consent
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium">Terms and Privacy Policy</div>
                    <div className="text-sm text-gray-600">
                      Accept MySLT Terms of Service and Privacy Policy to access portal services. 
                      <span className="text-red-600 font-medium"> (Required)</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className="border rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChoices.marketingEmails}
                    onChange={(e) => setConsentChoices({
                      ...consentChoices,
                      marketingEmails: e.target.checked
                    })}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium">Marketing Communications</div>
                    <div className="text-sm text-gray-600">
                      Send you promotional offers, service updates, and personalized recommendations via email, SMS, or app notifications.
                    </div>
                  </div>
                </label>
              </div>

              <div className="border rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChoices.personalization}
                    onChange={(e) => setConsentChoices({
                      ...consentChoices,
                      personalization: e.target.checked
                    })}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium">Service Personalization</div>
                    <div className="text-sm text-gray-600">
                      Personalize your MySLT experience based on your usage patterns and preferences.
                    </div>
                  </div>
                </label>
              </div>

              <div className="border rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChoices.serviceUsageLogs}
                    onChange={(e) => setConsentChoices({
                      ...consentChoices,
                      serviceUsageLogs: e.target.checked
                    })}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium">Service Usage Analytics</div>
                    <div className="text-sm text-gray-600">
                      Collect usage data to improve our services and provide better user experience.
                    </div>
                  </div>
                </label>
              </div>

              <div className="border rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChoices.thirdPartySharing}
                    onChange={(e) => setConsentChoices({
                      ...consentChoices,
                      thirdPartySharing: e.target.checked
                    })}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium">Third-Party Services</div>
                    <div className="text-sm text-gray-600">
                      Share necessary data with trusted partners to provide enhanced services (e.g., payment processors, delivery services).
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Legal Information */}
            <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600">
              <h4 className="font-medium mb-2">Your Rights:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Right to access your personal data</li>
                <li>• Right to rectify inaccurate data</li>
                <li>• Right to erase your data (subject to legal obligations)</li>
                <li>• Right to restrict processing</li>
                <li>• Right to data portability</li>
                <li>• Right to withdraw consent at any time</li>
              </ul>
              <p className="mt-2 text-xs">
                Data retention: 7 years as per telecommunications regulations. 
                Contact: privacy@slt.lk or visit MySLT portal settings to manage your preferences.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              {onSkip && (
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Skip for Now
                </button>
              )}
              
              <button
                onClick={handleConsentSubmit}
                disabled={!consentChoices.termsAndPrivacy}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  consentChoices.termsAndPrivacy
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to MySLT
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            This consent process complies with TMF632 Party Management standards and Sri Lankan data protection laws.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MySLTConsentMiddleware;
