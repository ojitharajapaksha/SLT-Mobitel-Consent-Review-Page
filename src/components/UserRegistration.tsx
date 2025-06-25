import React, { useState } from 'react';
import { User, Building, ArrowRight, Loader2, Moon, Sun } from 'lucide-react';
import { partyService, Individual, Organization } from '../services/partyService';

interface UserRegistrationProps {
  onUserRegistered: (party: Individual | Organization, type: 'individual' | 'organization') => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ 
  onUserRegistered, 
  darkMode = false, 
  onToggleDarkMode 
}) => {
  const [selectedType, setSelectedType] = useState<'individual' | 'organization' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  const handleTypeSelection = (type: 'individual' | 'organization') => {
    setSelectedType(type);
    setFormData({});
    setError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let createdParty: Individual | Organization;

      if (selectedType === 'individual') {
        // Validate individual form
        if (!formData.givenName || !formData.familyName || !formData.gender) {
          throw new Error('Please fill in all required fields');
        }

        const individualData: Omit<Individual, '_id' | 'createdAt' | 'updatedAt'> = {
          givenName: formData.givenName,
          familyName: formData.familyName,
          gender: formData.gender,
          contactMedium: [],
          languageAbility: [],
          skill: [],
          individualIdentification: [],
          externalReference: [],
          partyCharacteristic: [],
          taxExemptionCertificate: [],
          relatedParty: []
        };

        createdParty = await partyService.createIndividual(individualData);
      } else {
        // Validate organization form
        if (!formData.name || !formData.organizationType) {
          throw new Error('Please fill in all required fields');
        }

        const organizationData: Omit<Organization, '_id' | 'createdAt' | 'updatedAt'> = {
          name: formData.name,
          organizationType: formData.organizationType,
          isLegalEntity: formData.isLegalEntity === 'true',
          contactMedium: [],
          externalReference: [],
          organizationChildRelationship: [],
          organizationParentRelationship: [],
          organizationIdentification: [],
          partyCharacteristic: [],
          taxExemptionCertificate: [],
          creditRating: [],
          relatedParty: []
        };

        createdParty = await partyService.createOrganization(organizationData);
      }

      onUserRegistered(createdParty, selectedType!);
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderIndividualForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          First Name *
        </label>
        <input
          type="text"
          value={formData.givenName || ''}
          onChange={(e) => handleInputChange('givenName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
          placeholder="Enter your first name"
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
          placeholder="Enter your last name"
          required
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Gender *
        </label>
        <select
          value={formData.gender || ''}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${inputClasses}`}
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <User className="w-5 h-5 mr-2" />
            Create Individual Account
          </>
        )}
      </button>
    </form>
  );

  const renderOrganizationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <option value="">Select organization type</option>
          <option value="company">Company</option>
          <option value="corporation">Corporation</option>
          <option value="partnership">Partnership</option>
          <option value="non-profit">Non-Profit</option>
          <option value="government">Government</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Legal Entity Status
        </label>
        <select
          value={formData.isLegalEntity || 'true'}
          onChange={(e) => handleInputChange('isLegalEntity', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${inputClasses}`}
        >
          <option value="true">Yes, this is a legal entity</option>
          <option value="false">No, this is not a legal entity</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <Building className="w-5 h-5 mr-2" />
            Create Organization Account
          </>
        )}
      </button>
    </form>
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Register to access SLT Mobitel services
            </p>
          </div>
        </div>

        {/* Type Selection */}
        {!selectedType && (
          <div className="px-8 pb-8 space-y-4">
            <h3 className={`text-lg font-semibold text-center mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Select Account Type
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleTypeSelection('individual')}
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
                      Individual Account
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Personal account for individual users
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 ml-auto" />
                </div>
              </button>

              <button
                onClick={() => handleTypeSelection('organization')}
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
                      Organization Account
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Business or corporate account
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600 ml-auto" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Registration Form */}
        {selectedType && (
          <div className="px-8 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {selectedType === 'individual' ? 'Individual' : 'Organization'} Registration
              </h3>
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

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
              </div>
            )}

            {selectedType === 'individual' ? renderIndividualForm() : renderOrganizationForm()}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegistration;
