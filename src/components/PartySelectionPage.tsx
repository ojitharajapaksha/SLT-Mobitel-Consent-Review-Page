import React, { useState } from 'react';
import { User, Building, Moon, Sun, ArrowLeft, Check } from 'lucide-react';

interface PartySelectionPageProps {
  onPartySelect?: (partyType: PartyType) => void;
  onBack?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export type PartyType = 'individual' | 'organization';

const PartySelectionPage: React.FC<PartySelectionPageProps> = ({
  onPartySelect,
  onBack,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [selectedParty, setSelectedParty] = useState<PartyType | null>(null);

  const handlePartySelect = (partyType: PartyType) => {
    setSelectedParty(partyType);
  };

  const handleContinue = () => {
    if (selectedParty) {
      onPartySelect?.(selectedParty);
    }
  };

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const optionClasses = (isSelected: boolean) => 
    `p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : darkMode
          ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    }`;

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

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 left-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
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
              Select Account Type
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose the type of account you want to create
            </p>
          </div>
        </div>

        {/* Party Selection */}
        <div className="px-8 pb-8 space-y-6">
          {/* Individual Option */}
          <div 
            className={optionClasses(selectedParty === 'individual')}
            onClick={() => handlePartySelect('individual')}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 p-3 rounded-lg ${
                selectedParty === 'individual'
                  ? 'bg-blue-100 dark:bg-blue-800'
                  : darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
              }`}>
                <User className={`w-6 h-6 ${
                  selectedParty === 'individual'
                    ? 'text-blue-600 dark:text-blue-400'
                    : darkMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    Individual Account
                  </h3>
                  {selectedParty === 'individual' && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Personal account for individual customers
                </p>
                <div className="mt-3 space-y-1">
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    ✓ Personal mobile and internet services
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    ✓ Individual billing and support
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    ✓ Personal data management
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Option */}
          <div 
            className={optionClasses(selectedParty === 'organization')}
            onClick={() => handlePartySelect('organization')}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 p-3 rounded-lg ${
                selectedParty === 'organization'
                  ? 'bg-blue-100 dark:bg-blue-800'
                  : darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
              }`}>
                <Building className={`w-6 h-6 ${
                  selectedParty === 'organization'
                    ? 'text-blue-600 dark:text-blue-400'
                    : darkMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    Organization Account
                  </h3>
                  {selectedParty === 'organization' && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Business account for companies and organizations
                </p>
                <div className="mt-3 space-y-1">
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    ✓ Enterprise solutions and services
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    ✓ Bulk billing and management
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    ✓ Dedicated business support
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedParty}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              selectedParty
                ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue with {selectedParty === 'individual' ? 'Individual' : selectedParty === 'organization' ? 'Organization' : 'Selected'} Account
          </button>

          {/* Help Text */}
          <div className="text-center pt-2">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              You can change your account type later in your profile settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartySelectionPage;
