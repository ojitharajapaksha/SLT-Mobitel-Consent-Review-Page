import React, { useState } from 'react';
import Authentication from './components/Authentication';
import { partyService, Individual, Organization } from './services/partyService';
import './services/debugService'; // Import to trigger debug logging

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Note: Removed automatic redirect to allow users to always access the authentication page

  const handleAuthenticated = async (party: Individual | Organization, type: 'individual' | 'organization') => {
    try {
      // Auto-save default consent without showing consent page
      const defaultConsents = {
        marketingEmails: false,
        personalization: false,
        thirdPartySharing: false,
        serviceUsageLogs: true, // Required for functionality
        termsAndPrivacy: true   // Required for service
      };

      // Save consent to backend
      const consentRecord = {
        partyId: party._id!,
        partyType: type,
        consents: defaultConsents,
        consentTimestamp: new Date().toISOString(),
        ipAddress: '', // Will be set by backend
        userAgent: navigator.userAgent
      };

      const savedConsent = await partyService.saveConsent(consentRecord);
      
      // Log comprehensive data storage information
      console.log('=== TMF632 DATA STORAGE COMPLETE ===');
      console.log('Party Data Stored:', {
        id: party._id,
        type: type,
        name: type === 'individual' 
          ? `${(party as Individual).givenName} ${(party as Individual).familyName}`
          : (party as Organization).name,
        contactMethods: party.contactMedium?.length || 0,
        identifications: type === 'individual' 
          ? (party as Individual).individualIdentification?.length || 0
          : (party as Organization).organizationIdentification?.length || 0,
        storedAt: party.createdAt,
        lastUpdated: party.updatedAt
      });
      
      console.log('Consent Data Stored:', {
        consentId: savedConsent._id,
        consents: savedConsent.consents,
        timestamp: savedConsent.consentTimestamp,
        linkedToParty: savedConsent.partyId
      });
      
      console.log('Complete Party Object:', party);
      console.log('Complete Consent Object:', savedConsent);
      
      // Redirect directly to MySLT website
      window.location.href = 'https://myslt.slt.lk/';
      
    } catch (error) {
      console.error('Error saving consent:', error);
      alert('Failed to save consent. Please try again.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Always show authentication, redirect happens after successful auth
  return (
    <Authentication
      onAuthenticated={handleAuthenticated}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );
}

export default App;