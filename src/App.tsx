import { useState } from 'react';
import ConsentReviewPage from './components/ConsentReviewPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';

type AppPage = 'consent' | 'signin' | 'signup' | 'forgot-password';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('consent');

  const handleAgree = (consents: any) => {
    console.log('User consents:', consents);
    // Navigate to sign in page after consent is given
    setCurrentPage('signin');
  };

  const handleDecline = () => {
    console.log('User declined');
    // Here you would typically log out the user
    alert('You have been logged out');
  };

  const handleSignIn = (credentials: any) => {
    console.log('User signed in:', credentials);
    // Here you would typically authenticate the user
    // The redirect to SLT website is handled in the SignInPage component
  };

  const handleSignUp = (userData: any) => {
    console.log('User signed up:', userData);
    // Here you would typically create the user account
    setCurrentPage('signin'); // Redirect to sign in after successful signup
  };

  const handleForgotPassword = (email: string) => {
    console.log('Password reset requested for:', email);
    // Here you would typically send a password reset email
  };

  const handleBackToConsent = () => {
    setCurrentPage('consent');
  };

  const handleGoToSignUp = () => {
    setCurrentPage('signup');
  };

  const handleGoToForgotPassword = () => {
    setCurrentPage('forgot-password');
  };

  const handleBackToSignIn = () => {
    setCurrentPage('signin');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'consent':
        return (
          <ConsentReviewPage
            userName="SLT Mobitel"
            onAgree={handleAgree}
            onDecline={handleDecline}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      case 'signin':
        return (
          <SignInPage
            onSignIn={handleSignIn}
            onBack={handleBackToConsent}
            onForgotPassword={handleGoToForgotPassword}
            onSignUp={handleGoToSignUp}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      case 'signup':
        return (
          <SignUpPage
            onSignUp={handleSignUp}
            onBack={handleBackToSignIn}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onResetRequest={handleForgotPassword}
            onBack={handleBackToSignIn}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;