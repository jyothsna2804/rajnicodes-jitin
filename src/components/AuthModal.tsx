import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authHelpers } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess?: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
}

type AuthMode = 'login' | 'signup' | 'reset';

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSignupSuccess,
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setMessage({ type: 'error', text: 'Full name is required' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return false;
      }
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }
    
    if (mode !== 'reset' && !formData.password.trim()) {
      setMessage({ type: 'error', text: 'Password is required' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await authHelpers.signUp(
          formData.email,
          formData.password,
          formData.name
        );

        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Account created successfully! Welcome to RajniAI!' 
          });
          // Call the signup success callback after a short delay
          setTimeout(() => {
            onClose();
            resetForm();
            if (onSignupSuccess) {
              onSignupSuccess();
            }
          }, 1500);
        }
      } else if (mode === 'login') {
        const { data, error } = await authHelpers.signIn(
          formData.email,
          formData.password
        );

        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ type: 'success', text: 'Welcome back!' });
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1500);
        }
      } else if (mode === 'reset') {
        const { error } = await authHelpers.resetPassword(formData.email);

        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Password reset email sent! Check your inbox.' 
          });
          setTimeout(() => {
            setMode('login');
            resetForm();
          }, 3000);
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMessage(null);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 modal-glass flex items-center justify-center p-4">
      <div className="modal-content rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F2F2F2]/60 hover:text-[#F2F2F2] btn-lift"
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-calm">
            <User className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
          </div>
          <h2 className="font-header text-2xl font-bold text-[#F2F2F2] mb-2">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Join RajniAI'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <p className="font-body text-[#F2F2F2]/70">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your superstar account'}
            {mode === 'reset' && 'Enter your email to reset password'}
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-[#00FFAB]/10 border border-[#00FFAB]/30' 
              : 'bg-[#FF6B35]/10 border border-[#FF6B35]/30'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-[#00FFAB]" strokeWidth={1.5} />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
            )}
            <p className={`font-body text-sm ${
              message.type === 'success' ? 'text-[#00FFAB]' : 'text-[#FF6B35]'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-header font-medium text-[#F2F2F2] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-header font-medium text-[#F2F2F2] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-header font-medium text-[#F2F2F2] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F2F2F2]/40 hover:text-[#F2F2F2]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-header font-medium text-[#F2F2F2] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F2F2F2]/40 hover:text-[#F2F2F2]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#00FFAB] bg-[#2A2A2A] border-[#2A2A2A] rounded focus:ring-[#00FFAB] focus:ring-2"
                />
                <span className="ml-2 text-sm font-body text-[#F2F2F2]/70">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="text-sm font-body text-[#00FFAB] hover:text-[#00FFAB]/80"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] py-3 rounded-xl font-header font-semibold btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-[#101010]/30 border-t-[#101010] rounded-full loading-ring"></div>
                <span>
                  {mode === 'login' && 'Signing In...'}
                  {mode === 'signup' && 'Creating Account...'}
                  {mode === 'reset' && 'Sending Reset Link...'}
                </span>
              </div>
            ) : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Link'}
              </>
            )}
          </button>
        </form>

        {mode === 'reset' ? (
          <div className="mt-6 text-center">
            <button
              onClick={() => switchMode('login')}
              className="inline-flex items-center space-x-2 text-[#00FFAB] hover:text-[#00FFAB]/80 font-body"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              <span>Back to Sign In</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p className="font-body text-[#F2F2F2]/70">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-1 text-[#00FFAB] hover:text-[#00FFAB]/80 font-semibold"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        )}

        {mode === 'signup' && (
          <div className="mt-6 text-center">
            <p className="text-xs font-body text-[#F2F2F2]/60">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-[#00FFAB] hover:text-[#00FFAB]/80">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#00FFAB] hover:text-[#00FFAB]/80">Privacy Policy</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;