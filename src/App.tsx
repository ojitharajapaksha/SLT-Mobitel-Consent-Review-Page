import React, { useState } from 'react';
import ConsentReviewPage from './components/ConsentReviewPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleAgree = (consents: any) => {
    console.log('User consents:', consents);
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

export default App;