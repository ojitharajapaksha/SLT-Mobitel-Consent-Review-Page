import React, { useState } from 'react';
import { Eye, EyeOff, Moon, Sun, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

interface SignInPageProps {
  onSignIn?: (credentials: SignInData) => void;
  onBack?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface SignInData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignInPage: React.FC<SignInPageProps> = ({
  onSignIn,
  onBack,
  onForgotPassword,
  onSignUp,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [credentials, setCredentials] = useState<SignInData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; submit?: string}>({});

  const handleInputChange = (field: keyof Pick<SignInData, 'email' | 'password'>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleRememberMeChange = () => {
    setCredentials(prev => ({
      ...prev,
      rememberMe: !prev.rememberMe
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Use the authentication service to sign in
      const response = await authService.signIn({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
      });

      if (response.success && response.user) {
        // Store user session
        authService.storeUserSession(response.user);
        
        // Call the onSignIn callback
        onSignIn?.(credentials);
        
        // Redirect to MySLT website after successful sign in
        window.location.href = 'https://myslt.lk/';
      } else {
        // Show error message
        setErrors({ submit: response.error || 'Sign in failed. Please try again.' });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
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
              Welcome Back
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sign in to your SLT Mobitel account
            </p>
          </div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="px-8 pb-8 space-y-6">
          {/* Global Error Message */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

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
              value={credentials.email}
              onChange={handleInputChange('email')}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label 
              htmlFor="password"
              className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleInputChange('password')}
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={handleRememberMeChange}
                className="sr-only"
                disabled={isLoading}
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                credentials.rememberMe
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 border-transparent'
                  : darkMode
                    ? 'border-gray-500 hover:border-gray-400'
                    : 'border-gray-300 hover:border-gray-400'
              }`}>
                {credentials.rememberMe && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Remember me
              </span>
            </label>
            
            <a 
              href="#" 
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                onForgotPassword?.();
              }}
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
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
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  onSignUp?.();
                }}
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
