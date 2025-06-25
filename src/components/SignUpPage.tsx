import React, { useState } from 'react';
import { Eye, EyeOff, Moon, Sun, ArrowLeft, Check } from 'lucide-react';

interface SignUpPageProps {
  onSignUp?: (userData: SignUpData) => void;
  onBack?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

const SignUpPage: React.FC<SignUpPageProps> = ({
  onSignUp,
  onBack,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [userData, setUserData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToNewsletter: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof SignUpData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!userData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!userData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!userData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(userData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!userData.password) {
      newErrors.password = 'Password is required';
    } else if (userData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!userData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSignUp?.(userData);
      // You can add success message or redirect logic here
    }, 2000);
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
              Create Account
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join the SLT Mobitel family today
            </p>
          </div>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="px-8 pb-8 space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label 
                htmlFor="firstName"
                className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={userData.firstName}
                onChange={handleInputChange('firstName')}
                className={`w-full px-3 py-2.5 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
                placeholder="First name"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="lastName"
                className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={userData.lastName}
                onChange={handleInputChange('lastName')}
                className={`w-full px-3 py-2.5 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
                placeholder="Last name"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

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
              value={userData.email}
              onChange={handleInputChange('email')}
              className={`w-full px-3 py-2.5 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label 
              htmlFor="phone"
              className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={userData.phone}
              onChange={handleInputChange('phone')}
              className={`w-full px-3 py-2.5 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
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
                value={userData.password}
                onChange={handleInputChange('password')}
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
                placeholder="Create a password"
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
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label 
              htmlFor="confirmPassword"
              className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={userData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClasses}`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={userData.agreeToTerms}
                  onChange={handleInputChange('agreeToTerms')}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  userData.agreeToTerms
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 border-transparent'
                    : darkMode
                      ? 'border-gray-500 hover:border-gray-400'
                      : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {userData.agreeToTerms && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </a>
                </span>
              </div>
            </label>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
            )}

            {/* Newsletter Subscription */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={userData.subscribeToNewsletter}
                  onChange={handleInputChange('subscribeToNewsletter')}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  userData.subscribeToNewsletter
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 border-transparent'
                    : darkMode
                      ? 'border-gray-500 hover:border-gray-400'
                      : 'border-gray-300 hover:border-gray-400'
                }`}>
                  {userData.subscribeToNewsletter && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Subscribe to our newsletter for updates and offers
                </span>
              </div>
            </label>
          </div>

          {/* Sign Up Button */}
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
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-2">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  onBack?.();
                }}
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
