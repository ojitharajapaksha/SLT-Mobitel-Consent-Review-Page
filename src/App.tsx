import React, { useState, useEffect } from 'react';
import ConsentReviewPage from './components/ConsentReviewPage';
import Authentication from './components/Authentication';
import MySLTPortalExample from './components/MySLTPortalExample';
import { partyService, Individual, Organization } from './services/partyService';
import { authService } from './services/authService';
import './services/debugService'; // Import to trigger debug logging

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Individual | Organization | null>(null);
  const [partyType, setPartyType] = useState<'individual' | 'organization' | null>(null);
  const [showMySLTExample, setShowMySLTExample] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const existingSession = authService.getSession();
    if (existingSession && existingSession.isAuthenticated) {
      setSelectedParty(existingSession.user);
      setPartyType(existingSession.userType);
    }
  }, []);

  const handleAuthenticated = (party: Individual | Organization, type: 'individual' | 'organization') => {
    setSelectedParty(party);
    setPartyType(type);
  };

  const handleAgree = async (consents: any) => {
    if (!selectedParty || !partyType) {
      console.error('No party selected');
      return;
    }

    try {
      // Save consent to backend
      const consentRecord = {
        partyId: selectedParty._id!,
        partyType,
        consents,
        consentTimestamp: new Date().toISOString(),
        ipAddress: '', // Will be set by backend
        userAgent: navigator.userAgent
      };

      const savedConsent = await partyService.saveConsent(consentRecord);
      
      // Log comprehensive data storage information
      console.log('=== TMF632 DATA STORAGE COMPLETE ===');
      console.log('Party Data Stored:', {
        id: selectedParty._id,
        type: partyType,
        name: partyType === 'individual' 
          ? `${(selectedParty as Individual).givenName} ${(selectedParty as Individual).familyName}`
          : (selectedParty as Organization).name,
        contactMethods: selectedParty.contactMedium?.length || 0,
        identifications: partyType === 'individual' 
          ? (selectedParty as Individual).individualIdentification?.length || 0
          : (selectedParty as Organization).organizationIdentification?.length || 0,
        storedAt: selectedParty.createdAt,
        lastUpdated: selectedParty.updatedAt
      });
      
      console.log('Consent Data Stored:', {
        consentId: savedConsent._id,
        consents: savedConsent.consents,
        timestamp: savedConsent.consentTimestamp,
        linkedToParty: savedConsent.partyId
      });
      
      console.log('Complete Party Object:', selectedParty);
      console.log('Complete Consent Object:', savedConsent);
      
      // Show MySLT example after consent
      setShowMySLTExample(true);
    } catch (error) {
      console.error('Error saving consent:', error);
      alert('Failed to save consent. Please try again.');
    }
  };

  const handleDecline = () => {
    console.log('User logged out');
    // Clear authentication session
    authService.clearSession();
    // Reset to authentication screen
    setSelectedParty(null);
    setPartyType(null);
    setShowMySLTExample(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getDisplayName = () => {
    if (!selectedParty) return 'SLT Mobitel';
    return partyService.formatPartyDisplayName(selectedParty);
  };

  const getPartyDetails = () => {
    if (!selectedParty) return '';
    return partyService.getPartyDetails(selectedParty);
  };

  // Show MySLT Portal Example if consent is complete
  if (showMySLTExample) {
    return <MySLTPortalExample />;
  }

  // Show authentication if no party is selected
  if (!selectedParty || !partyType) {
    return (
      <Authentication
        onAuthenticated={handleAuthenticated}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  // Show consent review page
  return (
    <ConsentReviewPage
      userName={getDisplayName()}
      userDetails={getPartyDetails()}
      partyData={selectedParty}
      partyType={partyType}
      onAgree={handleAgree}
      onDecline={handleDecline}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );
}

export default App;