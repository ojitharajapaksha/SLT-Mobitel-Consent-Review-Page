import React, { useState } from 'react';
import { User, Building, ArrowRight, Loader2, Moon, Sun, Plus, Users } from 'lucide-react';
import { partyService, Individual, Organization } from '../services/partyService';
import UserRegistration from './UserRegistration';

interface PartySelectionProps {
  onPartySelected: (party: Individual | Organization, type: 'individual' | 'organization') => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const PartySelection: React.FC<PartySelectionProps> = ({ onPartySelected, darkMode = false, onToggleDarkMode }) => {
  const [selectedType, setSelectedType] = useState<'individual' | 'organization' | null>(null);
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const loadData = async (type: 'individual' | 'organization') => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'individual') {
        const data = await partyService.getIndividuals();
        setIndividuals(data);
      } else {
        const data = await partyService.getOrganizations();
        setOrganizations(data);
      }
    } catch (err) {
      setError(`Failed to load ${type}s. Please try again.`);
      console.error(`Error loading ${type}s:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelection = (type: 'individual' | 'organization') => {
    setSelectedType(type);
    loadData(type);
  };

  const handlePartySelection = (party: Individual | Organization) => {
    onPartySelected(party, selectedType!);
  };

  const handleUserRegistered = (party: Individual | Organization, type: 'individual' | 'organization') => {
    onPartySelected(party, type);
  };

  const getDisplayName = (party: Individual | Organization) => {
    if ('givenName' in party) {
      return `${party.givenName} ${party.familyName}`;
    }
    return party.name;
  };

  const getSubInfo = (party: Individual | Organization) => {
    if ('givenName' in party) {
      return `Gender: ${party.gender}`;
    }
    return `Type: ${party.organizationType}`;
  };

  return (
    <>
      {showRegistration ? (
        <UserRegistration
          onUserRegistered={handleUserRegistered}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      ) : (
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

      <div className={`w-full max-w-2xl mx-auto border rounded-2xl shadow-2xl transition-colors duration-300 ${cardClasses}`}>
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
              Select Your Profile
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose your account type to continue
            </p>
          </div>
        </div>

        {/* Type Selection */}
        {!selectedType && (
          <div className="px-8 pb-8 space-y-6">
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Choose Your Account Type
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select an account type to continue or create a new account
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleTypeSelection('individual')}
                className={`p-6 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <User className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Individual Account
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Login to existing account or create new personal account
                </p>
              </button>

              <button
                onClick={() => handleTypeSelection('organization')}
                className={`p-6 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? 'border-gray-600 hover:border-green-500 hover:bg-gray-700/50'
                    : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                }`}
              >
                <Building className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Organization Account
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Login to existing account or create new business account
                </p>
              </button>
            </div>
          </div>
        )}

            {/* Party List */}
        {selectedType && (
          <div className="px-8 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Select {selectedType === 'individual' ? 'Individual' : 'Organization'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowRegistration(true)}
                  className={`text-sm px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 ${
                    darkMode
                      ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700'
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>New Account</span>
                </button>
                <button
                  onClick={() => setSelectedType(null)}
                  className={`text-sm px-3 py-1 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Back
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Loading {selectedType}s...
                </span>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(selectedType === 'individual' ? individuals : organizations).map((party) => (
                  <button
                    key={party._id}
                    onClick={() => handlePartySelection(party)}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                      darkMode
                        ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {getDisplayName(party)}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getSubInfo(party)}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </button>
                ))}
                
                {(selectedType === 'individual' ? individuals : organizations).length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        No {selectedType}s found
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Be the first to create a {selectedType} account
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRegistration(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New {selectedType === 'individual' ? 'Individual' : 'Organization'} Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
        </div>
      )}
    </>
  );
};

export default PartySelection;
