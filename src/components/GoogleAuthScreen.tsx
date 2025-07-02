import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink,
  Lock,
  Eye,
  AlertCircle
} from 'lucide-react';

interface GoogleAuthScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const GoogleAuthScreen: React.FC<GoogleAuthScreenProps> = ({ onSuccess, onBack }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setIsConnecting(true);
    setAuthError(null);

    try {
      // In a real implementation, you would integrate with Google OAuth
      // For now, we'll simulate the process
      
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      onSuccess();
    } catch (error) {
      setAuthError('Failed to connect to Google. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] particle-field">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-[#F2F2F2]/70 hover:text-[#00FFAB] mb-8 btn-lift"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-body">Back to preferences</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center mx-auto mb-6 voice-calm">
              <Mail className="w-10 h-10 text-[#101010] icon-hover" strokeWidth={1.5} />
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F2F2F2] mb-6 leading-tight">
              Connect Your <span className="text-[#00FFAB]">Gmail</span>
            </h1>
            
            <p className="font-body text-xl text-[#F2F2F2]/80 mb-4 max-w-2xl mx-auto leading-relaxed">
              Let Rajni securely scan your recent purchase receipts and booking confirmations to personalize your experience.
            </p>
          </div>

          {/* Permission Details */}
          <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-[#00FFAB]" strokeWidth={1.5} />
              <h2 className="font-header text-xl font-bold text-[#F2F2F2]">
                What Rajni Will Access
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-4 p-4 bg-[#00FFAB]/5 border border-[#00FFAB]/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-[#00FFAB] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-header text-[#F2F2F2] font-semibold mb-1">
                    Purchase Receipts & Order Confirmations
                  </p>
                  <p className="font-body text-[#F2F2F2]/70 text-sm">
                    From food delivery, shopping, travel bookings, and subscription services
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-[#1F51FF]/5 border border-[#1F51FF]/20 rounded-xl">
                <Eye className="w-5 h-5 text-[#1F51FF] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-header text-[#F2F2F2] font-semibold mb-1">
                    Read-Only Access
                  </p>
                  <p className="font-body text-[#F2F2F2]/70 text-sm">
                    Rajni can only read emails, never send, delete, or modify them
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-[#FF6B35]/5 border border-[#FF6B35]/20 rounded-xl">
                <Lock className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-header text-[#F2F2F2] font-semibold mb-1">
                    Secure & Temporary
                  </p>
                  <p className="font-body text-[#F2F2F2]/70 text-sm">
                    Data is processed securely and only preferences are saved, not email content
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#2A2A2A]/50 p-4 rounded-xl">
              <p className="font-body text-[#F2F2F2]/60 text-sm text-center">
                <strong>Scope:</strong> https://www.googleapis.com/auth/gmail.readonly
              </p>
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 rounded-xl flex items-center space-x-3 bg-[#FF6B35]/10 border border-[#FF6B35]/30">
              <AlertCircle className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
              <p className="font-body text-sm text-[#FF6B35]">{authError}</p>
            </div>
          )}

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleGoogleAuth}
              disabled={isConnecting}
              className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-10 py-4 rounded-full text-lg font-header font-bold btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mx-auto"
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-[#101010]/30 border-t-[#101010] rounded-full loading-ring"></div>
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <Mail className="w-6 h-6" strokeWidth={1.5} />
                  <span>Connect Gmail</span>
                  <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
                </>
              )}
            </button>

            <p className="font-body text-[#F2F2F2]/50 text-sm mt-4 max-w-md mx-auto">
              You'll be redirected to Google's secure login page. We never see your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthScreen;