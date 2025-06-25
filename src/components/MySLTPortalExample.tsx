import React, { useState, useEffect } from 'react';
import MySLTConsentMiddleware from './MySLTConsentMiddleware';

// Example MySLT Portal Integration
const MySLTPortalExample: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [consentComplete, setConsentComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate MySLT authentication check
  useEffect(() => {
    // In a real implementation, this would check your existing MySLT authentication
    const checkMySLTAuth = async () => {
      try {
        // Example: Check if user is logged in to MySLT
        const mySLTSession = localStorage.getItem('myslt_session');
        
        if (mySLTSession) {
          const sessionData = JSON.parse(mySLTSession);
          
          // Example MySLT user data structure
          const mySLTUser = {
            customerId: sessionData.customerId,
            email: sessionData.email,
            mobileNumber: sessionData.phone,
            customerType: sessionData.accountType, // 'INDIVIDUAL' or 'CORPORATE'
            firstName: sessionData.firstName,
            lastName: sessionData.lastName,
            companyName: sessionData.companyName
          };

          // Map to consent middleware format
          const mappedUser = mapMySLTUserToConsentFormat(mySLTUser);
          setUser(mappedUser);
          setShowConsent(true);
        }
      } catch (error) {
        console.error('MySLT authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkMySLTAuth();
  }, []);

  // Map MySLT user data to consent middleware format
  const mapMySLTUserToConsentFormat = (mySLTUser: any) => ({
    id: mySLTUser.customerId,
    email: mySLTUser.email,
    phone: mySLTUser.mobileNumber,
    accountType: mySLTUser.customerType === 'CORPORATE' ? 'organization' : 'individual',
    name: mySLTUser.customerType === 'CORPORATE' 
      ? mySLTUser.companyName 
      : `${mySLTUser.firstName} ${mySLTUser.lastName}`
  });

  const handleConsentComplete = (consentData: any) => {
    console.log('TMF632 Consent collected:', consentData);
    setConsentComplete(true);
    setShowConsent(false);
    
    // Optional: Store consent completion in MySLT session
    const existingSession = JSON.parse(localStorage.getItem('myslt_session') || '{}');
    localStorage.setItem('myslt_session', JSON.stringify({
      ...existingSession,
      tmf632ConsentComplete: true,
      consentTimestamp: consentData.timestamp
    }));

    // Redirect to MySLT dashboard or continue portal flow
    redirectToMySLTDashboard();
  };

  const handleConsentSkip = () => {
    // Optional: Allow users to skip consent for now
    // This might be used for existing users during migration period
    setShowConsent(false);
    setConsentComplete(true);
    
    console.log('User skipped TMF632 consent (migration period)');
    redirectToMySLTDashboard();
  };

  const redirectToMySLTDashboard = () => {
    // In a real implementation, this would redirect to the main MySLT portal
    // For demo purposes, we'll just show a success message
    console.log('Redirecting to MySLT Dashboard...');
    
    // Example redirect:
    // window.location.href = '/myslt/dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading MySLT Portal</h2>
          <p className="text-gray-600">Checking your authentication status...</p>
        </div>
      </div>
    );
  }

  // Show consent middleware if user needs to provide consent
  if (showConsent && user && !consentComplete) {
    return (
      <MySLTConsentMiddleware
        mySLTUser={user}
        onConsentComplete={handleConsentComplete}
        onSkip={handleConsentSkip} // Optional skip during migration
        darkMode={false}
      />
    );
  }

  // Main MySLT Portal (this would be your existing portal components)
  return (
    <MySLTDashboard user={user} />
  );
};

// Example MySLT Dashboard Component (placeholder)
const MySLTDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* MySLT Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/SLTMobitel_Logo.svg.png" alt="SLT Mobitel" className="h-8" />
            <h1 className="text-xl font-bold">MySLT Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.name}</span>
            <button className="bg-red-700 px-4 py-2 rounded text-sm hover:bg-red-800">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to MySLT Portal</h2>
          <p className="text-gray-600">Your enhanced MySLT experience with TMF632 compliant data processing.</p>
        </div>
      </div>
    </div>
  );
};

export default MySLTPortalExample;
