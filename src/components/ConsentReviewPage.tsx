import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, Check, Moon, Sun } from 'lucide-react';

interface ConsentReviewPageProps {
  userName?: string;
  onAgree?: (consents: ConsentData) => void;
  onDecline?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface ConsentData {
  marketingEmails: boolean;
  personalization: boolean;
  thirdPartySharing: boolean;
  serviceUsageLogs: boolean;
  termsAndPrivacy: boolean;
}

const ConsentReviewPage: React.FC<ConsentReviewPageProps> = ({
  userName = "John Doe",
  onAgree,
  onDecline,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [consents, setConsents] = useState<ConsentData>({
    marketingEmails: false,
    personalization: false,
    thirdPartySharing: false,
    serviceUsageLogs: false,
    termsAndPrivacy: false
  });

  const [showValidation, setShowValidation] = useState(false);

  const handleConsentChange = (key: keyof ConsentData) => {
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    if (showValidation) {
      setShowValidation(false);
    }
  };

  const isFormValid = consents.serviceUsageLogs && consents.termsAndPrivacy;

  const handleAgree = () => {
    if (!isFormValid) {
      setShowValidation(true);
      return;
    }
    onAgree?.(consents);
    // Redirect to SLT website
    window.location.href = 'https://myslt.slt.lk/';
  };

  const handleDecline = () => {
    onDecline?.();
  };

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Welcome to {userName}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Please review your data preferences before continuing
            </p>
          </div>
        </div>

        {/* Consent Options */}
        <div className="px-8 pb-6 space-y-4">
          {/* Optional Consents */}
          <div className="space-y-3">
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Optional Preferences
            </h3>
            
            {[
              {
                key: 'marketingEmails' as keyof ConsentData,
                label: 'Allow marketing emails',
                description: 'Receive updates about new services and offers'
              },
              {
                key: 'personalization' as keyof ConsentData,
                label: 'Allow personalization using my usage data',
                description: 'Improve your experience with personalized recommendations'
              },
              {
                key: 'thirdPartySharing' as keyof ConsentData,
                label: 'Share data with trusted third parties',
                description: 'Enable enhanced services through partner integrations'
              }
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700/50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={consents[item.key]}
                    onChange={() => handleConsentChange(item.key)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    consents[item.key]
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 border-transparent'
                      : darkMode
                        ? 'border-gray-500 hover:border-gray-400'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {consents[item.key] && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Required Consents */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Required Agreements
            </h3>
            
            {/* Service Usage Logs */}
            <label className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700/50 border border-gray-700' 
                : 'hover:bg-gray-50 border border-gray-200'
            }`}>
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={consents.serviceUsageLogs}
                  onChange={() => handleConsentChange('serviceUsageLogs')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  consents.serviceUsageLogs
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 border-transparent'
                    : 'border-red-400 hover:border-red-500'
                }`}>
                  {consents.serviceUsageLogs && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`flex items-center space-x-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  <span>Consent for service usage logs</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Required for service functionality and support
                </div>
              </div>
            </label>

            {/* Terms and Privacy */}
            <label className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700/50 border border-gray-700' 
                : 'hover:bg-gray-50 border border-gray-200'
            }`}>
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={consents.termsAndPrivacy}
                  onChange={() => handleConsentChange('termsAndPrivacy')}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  consents.termsAndPrivacy
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 border-transparent'
                    : 'border-red-400 hover:border-red-500'
                }`}>
                  {consents.termsAndPrivacy && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  I agree to the{' '}
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms & Privacy Policy
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Required to use our services
                </div>
              </div>
            </label>
          </div>

          {/* Validation Message */}
          {showValidation && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  Please agree to all required terms to continue
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-4 space-y-3">
          <div className="mb-3">
            <a 
              href="https://consent-management-system-api.vercel.app/"
              className={`text-xs inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Login to Consent Management Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <button
            onClick={handleAgree}
            disabled={!isFormValid}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isFormValid
                ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Agree & Continue
          </button>
          
          <button
            onClick={handleDecline}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Decline / Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentReviewPage;