import React, { useState } from 'react';
import ConsentReviewPage from './components/ConsentReviewPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showConsent, setShowConsent] = useState(true);

  const handleAgree = (consents: any) => {
    console.log('User consents:', consents);
    setShowConsent(false);
    // Here you would typically save the consents and redirect to dashboard
  };

  const handleDecline = () => {
    console.log('User declined');
    // Here you would typically log out the user
    alert('You have been logged out');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (showConsent) {
    return (
      <ConsentReviewPage
        userName="SLT Mobitel"
        onAgree={handleAgree}
        onDecline={handleDecline}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to MySLT Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">You have successfully agreed to the terms and can now access your dashboard.</p>
        <button
          onClick={() => setShowConsent(true)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Consent Page Again
        </button>
      </div>
    </div>
  );
}

export default App;