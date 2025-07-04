import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Shield, 
  Eye, 
  Trash2, 
  CheckCircle, 
  X, 
  ArrowRight,
  Brain,
  Zap,
  Lock
} from 'lucide-react';
import GoogleAuthScreen from './GoogleAuthScreen';
import FetchingPreferencesScreen from './FetchingPreferencesScreen';
import ReviewCustomizeScreen from './ReviewCustomizeScreen';
import ManualEntryScreen from './ManualEntryScreen';
import FinalConfirmationScreen from './FinalConfirmationScreen';
import VendorsNotFoundScreen from './VendorsNotFoundScreen';

interface PersonalizationOnboardingProps {
  onComplete: (method: 'auto' | 'manual', preferences?: any) => void;
  onSkip: () => void;
}

type OnboardingStep = 'choice' | 'google-auth' | 'fetching' | 'review' | 'manual-setup' | 'vendors-not-found' | 'final';

const PersonalizationOnboarding: React.FC<PersonalizationOnboardingProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('choice');
  const [preferences, setPreferences] = useState<any>(null);
  const [onboardingMethod, setOnboardingMethod] = useState<'auto' | 'manual' | null>(null);
  const [missingVendors, setMissingVendors] = useState<string[]>([]);
  const [availableVendors, setAvailableVendors] = useState<string[]>([]);

  // Mock function to check vendor availability
  const checkVendorAvailability = (userVendors: string[]) => {
    const supportedVendors = ['Swiggy', 'Zomato', 'Amazon', 'Flipkart', 'Ola', 'Uber', 'Blinkit'];
    const missing = userVendors.filter(vendor => !supportedVendors.includes(vendor));
    const available = userVendors.filter(vendor => supportedVendors.includes(vendor));
    
    return { missing, available };
  };

  const handleAutoFetch = () => {
    setOnboardingMethod('auto');
    setCurrentStep('google-auth');
  };

  const handleManualSetup = () => {
    setOnboardingMethod('manual');
    setCurrentStep('manual-setup');
  };

  const handleGoogleAuthSuccess = () => {
    setCurrentStep('fetching');
  };

  const handleGoogleAuthBack = () => {
    setCurrentStep('choice');
  };

  const handleFetchingComplete = (fetchedPreferences: any) => {
    setPreferences(fetchedPreferences);
    setCurrentStep('review');
  };

  const handleReviewComplete = (updatedPreferences: any) => {
    setPreferences(updatedPreferences);
    
    // Check if any vendors are not supported
    if (updatedPreferences.vendors && updatedPreferences.vendors.length > 0) {
      const { missing, available } = checkVendorAvailability(updatedPreferences.vendors);
      
      if (missing.length > 0) {
        setMissingVendors(missing);
        setAvailableVendors(available);
        setCurrentStep('vendors-not-found');
        return;
      }
    }
    
    setCurrentStep('final');
  };

  const handleReviewReset = () => {
    setCurrentStep('manual-setup');
  };

  const handleManualComplete = (manualPreferences: any) => {
    setPreferences(manualPreferences);
    
    // Check if any vendors are not supported
    if (manualPreferences.vendors && manualPreferences.vendors.length > 0) {
      const { missing, available } = checkVendorAvailability(manualPreferences.vendors);
      
      if (missing.length > 0) {
        setMissingVendors(missing);
        setAvailableVendors(available);
        setCurrentStep('vendors-not-found');
        return;
      }
    }
    
    setCurrentStep('final');
  };

  const handleVendorsNotFoundContinue = () => {
    setCurrentStep('final');
  };

  const handleVendorsNotFoundGoBack = () => {
    if (onboardingMethod === 'auto') {
      setCurrentStep('review');
    } else {
      setCurrentStep('manual-setup');
    }
  };

  const handleFinalComplete = () => {
    onComplete(onboardingMethod || 'manual', preferences);
  };

  // Render different screens based on current step
  switch (currentStep) {
    case 'google-auth':
      return (
        <GoogleAuthScreen 
          onSuccess={handleGoogleAuthSuccess}
          onBack={handleGoogleAuthBack}
        />
      );

    case 'fetching':
      return (
        <FetchingPreferencesScreen 
          onComplete={handleFetchingComplete}
        />
      );

    case 'review':
      return (
        <ReviewCustomizeScreen 
          preferences={preferences}
          onComplete={handleReviewComplete}
          onReset={handleReviewReset}
        />
      );

    case 'manual-setup':
      return (
        <ManualEntryScreen 
          onComplete={handleManualComplete}
        />
      );

    case 'vendors-not-found':
      return (
        <VendorsNotFoundScreen 
          missingVendors={missingVendors}
          availableVendors={availableVendors}
          onContinue={handleVendorsNotFoundContinue}
          onGoBack={handleVendorsNotFoundGoBack}
        />
      );

    case 'final':
      return (
        <FinalConfirmationScreen 
          preferences={preferences}
          onComplete={handleFinalComplete}
        />
      );

    default:
      // Default choice screen
      return (
        <div className="min-h-screen bg-[#101010] particle-field">
          <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center voice-excited">
                    <Sparkles className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1F51FF] to-[#FF6B35] rounded-2xl flex items-center justify-center voice-calm">
                    <Brain className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
                  </div>
                </div>
                
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-[#F2F2F2] mb-6 leading-tight">
                  <span className="text-[#00FFAB]">Rajni's Got You</span> — 
                  <br />
                  Let's Personalize This
                </h1>
                
                <p className="font-body text-xl md:text-2xl text-[#F2F2F2]/80 mb-4 max-w-3xl mx-auto leading-relaxed">
                  Want me to personalize your experience — <span className="text-[#00FFAB] font-semibold">the smart way?</span>
                </p>
                
                <p className="font-body text-lg text-[#F2F2F2]/70 max-w-3xl mx-auto">
                  Rajni can auto-fetch your favorite vendors, food, and services by quickly scanning your recent Gmail purchases and bookings.
                </p>
                
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <Zap className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
                  <span className="font-header text-[#FF6B35] font-semibold">No typing. No guessing. Just a smoother start.</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid lg:grid-cols-2 gap-12 mb-12">
                {/* Privacy First Section */}
                <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-xl flex items-center justify-center voice-calm">
                      <Lock className="w-6 h-6 text-[#101010]" strokeWidth={1.5} />
                    </div>
                    <h2 className="font-header text-2xl font-bold text-[#F2F2F2]">
                      🔒 <span className="text-[#00FFAB]">Privacy First</span>
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-[#00FFAB] mt-1 flex-shrink-0 icon-pulse" strokeWidth={1.5} />
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold mb-1">
                          Only looks at transactional emails
                        </p>
                        <p className="font-body text-[#F2F2F2]/70 text-sm">
                          Like orders & bookings from vendors you use
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <X className="w-6 h-6 text-[#FF6B35] mt-1 flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold mb-1">
                          Never reads personal conversations
                        </p>
                        <p className="font-body text-[#F2F2F2]/70 text-sm">
                          Your private messages stay completely private
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Eye className="w-6 h-6 text-[#1F51FF] mt-1 flex-shrink-0 icon-hover" strokeWidth={1.5} />
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold mb-1">
                          You'll review and edit everything
                        </p>
                        <p className="font-body text-[#F2F2F2]/70 text-sm">
                          Before anything is saved to your profile
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Trash2 className="w-6 h-6 text-[#FF6B35] mt-1 flex-shrink-0 icon-hover" strokeWidth={1.5} />
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold mb-1">
                          Delete or update anytime
                        </p>
                        <p className="font-body text-[#F2F2F2]/70 text-sm">
                          Full control over your data, always
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result Section */}
                <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50 bg-gradient-to-br from-[#1F51FF]/10 to-[#00FFAB]/10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#00FFAB] rounded-xl flex items-center justify-center voice-excited">
                      <Sparkles className="w-6 h-6 text-[#101010]" strokeWidth={1.5} />
                    </div>
                    <h2 className="font-header text-2xl font-bold text-[#F2F2F2]">
                      ✨ <span className="text-[#FF6B35]">Result</span>
                    </h2>
                  </div>

                  <div className="text-center">
                    <p className="font-body text-xl text-[#F2F2F2] mb-6 leading-relaxed">
                      A concierge tuned to your style — <span className="text-[#00FFAB] font-semibold">instantly.</span>
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-[#2A2A2A]/50 rounded-xl">
                        <Mail className="w-5 h-5 text-[#00FFAB]" strokeWidth={1.5} />
                        <span className="font-body text-[#F2F2F2]/80">Favorite restaurants & cuisines</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-[#2A2A2A]/50 rounded-xl">
                        <Shield className="w-5 h-5 text-[#1F51FF]" strokeWidth={1.5} />
                        <span className="font-body text-[#F2F2F2]/80">Preferred payment methods</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 bg-[#2A2A2A]/50 rounded-xl">
                        <Zap className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
                        <span className="font-body text-[#F2F2F2]/80">Regular service providers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="text-center space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                  <button
                    onClick={handleAutoFetch}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-8 py-4 rounded-full text-lg font-header font-bold btn-lift btn-ripple flex items-center justify-center space-x-3"
                  >
                    <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                    <span>🪄 Yes, Let Rajni Fetch My Preferences</span>
                  </button>

                  <button
                    onClick={handleManualSetup}
                    className="w-full sm:w-auto glass-panel text-[#F2F2F2] px-8 py-4 rounded-full text-lg font-header font-semibold btn-lift btn-ripple border border-[#2A2A2A] flex items-center justify-center space-x-3"
                  >
                    <span>I'll Do It Myself</span>
                    <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <button
                  onClick={onSkip}
                  className="text-[#F2F2F2]/60 hover:text-[#F2F2F2] font-body text-sm underline"
                >
                  Skip for now
                </button>
              </div>

              {/* Bottom Note */}
              <div className="text-center mt-12">
                <p className="font-body text-[#F2F2F2]/50 text-sm max-w-2xl mx-auto">
                  This is a one-time setup. You can always change these preferences later in your profile settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default PersonalizationOnboarding;