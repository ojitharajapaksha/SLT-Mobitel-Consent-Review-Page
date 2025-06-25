import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, Check, Moon, Sun, FileCheck } from 'lucide-react';
import { partyService } from '../services/partyService';

interface ConsentReviewPageProps {
  userName?: string;
  userDetails?: string;
  partyData?: any; // Add party data to show what was collected
  partyType?: 'individual' | 'organization';
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
  userDetails = "",
  partyData,
  partyType,
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
  const [verificationReport, setVerificationReport] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);

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
    // Show a brief message before logging out
    const confirmLogout = window.confirm('Are you sure you want to logout? You will need to sign in again to access this service.');
    if (confirmLogout) {
      onDecline?.();
    }
  };

  const handleTestVerification = async () => {
    if (!partyData?._id) {
      alert('No party ID available for verification');
      return;
    }

    try {
      console.log('[ConsentReviewPage] Testing data verification for party:', partyData._id);
      const report = await partyService.getDataVerificationReport(partyData._id);
      setVerificationReport(report);
      setShowReport(true);
      console.log('[ConsentReviewPage] Verification report received:', report);
      
      // Show summary alert
      alert(`Data Verification Complete!\n\nParty Type: ${report.partyType}\nStored Fields: ${report.dataCompliance?.storedFields?.length || 0}\nConsent Records: ${report.consentData?.totalRecords || 0}\nTMF632 Compliant: ${report.dataCompliance?.tmf632Compliant ? 'Yes' : 'No'}\n\nSee console for full report.`);
    } catch (error: any) {
      console.error('[ConsentReviewPage] Error testing verification:', error);
      alert(`Verification test failed: ${error.message || 'Unknown error'}`);
    }
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
              MySLT Data Consent
            </h1>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Welcome, {userName}
            </p>
            {userDetails && (
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {userDetails}
              </p>
            )}
            <div className={`text-xs p-2 rounded ${darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
              TMF632 Compliant Consent Collection
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              To access MySLT services, please review and provide your data processing consent
            </p>
            
            {/* Data Collection Summary */}
            {partyData && (
              <div className={`text-xs p-3 rounded-lg mt-3 ${darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border`}>
                <p className={`${darkMode ? 'text-yellow-400' : 'text-yellow-700'} font-medium mb-2`}>
                  📊 Data Collected & Stored (TMF632 Compliant)
                </p>
                {partyType === 'individual' ? (
                  <div className={`${darkMode ? 'text-yellow-300' : 'text-yellow-600'} space-y-1`}>
                    <div>• Personal Info: {partyData.givenName} {partyData.familyName}</div>
                    <div>• Contact: {partyData.contactMedium?.length || 0} method(s) stored</div>
                    <div>• Identity: {partyData.individualIdentification?.length || 0} ID(s) verified</div>
                    <div>• Database ID: {partyData._id}</div>
                  </div>
                ) : (
                  <div className={`${darkMode ? 'text-yellow-300' : 'text-yellow-600'} space-y-1`}>
                    <div>• Organization: {partyData.name}</div>
                    <div>• Contact: {partyData.contactMedium?.length || 0} method(s) stored</div>
                    <div>• Registration: {partyData.organizationIdentification?.length || 0} ID(s) verified</div>
                    <div>• Database ID: {partyData._id}</div>
                  </div>
                )}
              </div>
            )}

            {/* Verification Test Button */}
            {partyData?._id && (
              <div className="mt-3">
                <button
                  onClick={handleTestVerification}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 ${
                    darkMode
                      ? 'bg-purple-900/20 text-purple-400 border border-purple-800 hover:bg-purple-900/30'
                      : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                  } flex items-center justify-center space-x-2`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Test Data Verification (TMF632 Compliance)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Consent Options */}
        <div className="px-8 pb-6 space-y-4">
          {/* Optional Consents */}
          <div className="space-y-3">
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Optional Data Processing Preferences
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              These preferences help us improve your MySLT experience (TMF632 Optional Consents)
            </p>
            
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
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentReviewPage;