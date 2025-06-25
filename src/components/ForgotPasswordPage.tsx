import React, { useState } from 'react';
import { Moon, Sun, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

interface ForgotPasswordPageProps {
  onResetRequest?: (email: string) => void;
  onBack?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onResetRequest,
  onBack,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
      onResetRequest?.(email);
    }, 1500);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500';

  if (isEmailSent) {
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

        <div className={`w-full max-w-md mx-auto border rounded-2xl shadow-2xl transition-colors duration-300 ${cardClasses}`}>
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="flex justify-center mb-6">
              <img 
                src="/SLTMobitel_Logo.svg.png" 
                alt="SLT Mobitel" 
                className="h-16 w-auto"
              />
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Check Your Email
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We've sent a password reset link to
              </p>
              <p className="text-blue-600 font-medium break-all">
                {email}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="px-8 pb-8 space-y-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
              <div className="flex items-start space-x-3">
                <Mail className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div className="space-y-2">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    What's next?
                  </p>
                  <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Check your email inbox</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Create a new password</li>
                    <li>• Sign in with your new password</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  try again
                </button>
              </p>

              <button
                onClick={onBack}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <div className={`w-full max-w-md mx-auto border rounded-2xl shadow-2xl transition-colors duration-300 ${cardClasses}`}>
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
              Forgot Password?
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No worries! Enter your email and we'll send you a reset link
            </p>
          </div>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleResetRequest} className="px-8 pb-8 space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label 
              htmlFor="email"
              className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending reset link...</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>

          {/* Back to Sign In */}
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className={`text-sm font-medium transition-colors duration-200 ${
                darkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ← Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
