import React from 'react';
import { User, Building, Shield, Check, Database, ArrowRight } from 'lucide-react';
import { Individual, Organization } from '../services/partyService';

interface DataCollectionSummaryProps {
  party: Individual | Organization;
  partyType: 'individual' | 'organization';
  darkMode?: boolean;
  onContinue: () => void;
}

const DataCollectionSummary: React.FC<DataCollectionSummaryProps> = ({
  party,
  partyType,
  darkMode = false,
  onContinue
}) => {
  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const renderIndividualSummary = (individual: Individual) => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
        <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          <User className="w-4 h-4 mr-2" />
          Essential Individual Information (TMF632 Individual Party)
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Full Name:</span>
            <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {individual.givenName} {individual.familyName}
            </span>
          </div>
          <div>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
            <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {individual.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
        <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
          <Database className="w-4 h-4 mr-2" />
          Contact Information (TMF632 ContactMedium)
        </h4>
        <div className="space-y-2 text-sm">
          {individual.contactMedium?.map((contact, index) => (
            <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {contact.type.toUpperCase()}:
              </span>
              <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {contact.value}
              </span>
              {contact.preferred && (
                <span className={`ml-2 text-xs px-2 py-1 rounded ${darkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'} border`}>
        <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
          <Shield className="w-4 h-4 mr-2" />
          Identity Verification (TMF632 IndividualIdentification)
        </h4>
        <div className="space-y-3 text-sm">
          {individual.individualIdentification?.map((id, index) => (
            <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {id.type === 'nationalId' ? 'National ID' : 'Passport'}:
                </span>
                <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {id.identificationId}
                </span>
              </div>
              {id.issuingAuthority && (
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Issuing Authority: {id.issuingAuthority}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrganizationSummary = (organization: Organization) => (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
        <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
          <Building className="w-4 h-4 mr-2" />
          Essential Organization Information (TMF632 Organization Party)
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name:</span>
            <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {organization.name}
            </span>
          </div>
          <div>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Type:</span>
            <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {organization.organizationType}
            </span>
          </div>
          <div>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Legal Entity:</span>
            <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {organization.isLegalEntity ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
            <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {organization.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
        <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          <Database className="w-4 h-4 mr-2" />
          Contact Information (TMF632 ContactMedium)
        </h4>
        <div className="space-y-2 text-sm">
          {organization.contactMedium?.map((contact, index) => (
            <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {contact.type.toUpperCase()}:
              </span>
              <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {contact.value}
              </span>
              {contact.preferred && (
                <span className={`ml-2 text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'} border`}>
        <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
          <Shield className="w-4 h-4 mr-2" />
          Business Registration (TMF632 OrganizationIdentification)
        </h4>
        <div className="space-y-3 text-sm">
          {organization.organizationIdentification?.map((id, index) => (
            <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div>
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {id.type === 'businessRegistration' ? 'Business Registration' : 'Tax ID'}:
                </span>
                <span className={`ml-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {id.identificationId}
                </span>
              </div>
              {id.issuingAuthority && (
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Issuing Authority: {id.issuingAuthority}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}>
      <div className={`w-full max-w-4xl mx-auto border rounded-2xl shadow-2xl transition-colors duration-300 ${cardClasses}`}>
        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <img 
              src="/SLTMobitel_Logo.svg.png" 
              alt="SLT Mobitel" 
              className="h-12 w-auto"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className={`text-xl font-bold flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              <Check className="w-5 h-5 mr-2" />
              Registration Successful
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              TMF632 Compliant Data Successfully Collected & Stored
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Review the data structure below to see how your information is organized
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              ✅ Essential TMF632 Data Collection Complete
            </h3>
            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
              Your essential information has been successfully collected and structured according to TMF632 standards. 
              We collect only the minimum required data for telecom service provisioning and compliance.
            </p>
            <div className={`mt-3 text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              <p><strong>Collected Data:</strong></p>
              <ul className="mt-1 space-y-1">
                {partyType === 'individual' ? (
                  <>
                    <li>• Identity: Name and National ID verification</li>
                    <li>• Contact: Email and mobile for service communications</li>
                    <li>• Authentication: Secure credentials for portal access</li>
                  </>
                ) : (
                  <>
                    <li>• Business Identity: Organization name and registration</li>
                    <li>• Contact: Email and phone for business communications</li>
                    <li>• Authentication: Secure credentials for portal access</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {partyType === 'individual' ? renderIndividualSummary(party as Individual) : renderOrganizationSummary(party as Organization)}

          <div className="mt-8 flex justify-center">
            <button
              onClick={onContinue}
              className={`px-8 py-3 text-white rounded-lg font-semibold transition-all duration-200 flex items-center ${
                partyType === 'individual'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}
            >
              Continue to Consent Management
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionSummary;
