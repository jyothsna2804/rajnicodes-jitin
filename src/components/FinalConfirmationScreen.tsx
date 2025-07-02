import React, { useState } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  Brain, 
  ArrowRight, 
  Star,
  Zap,
  Heart
} from 'lucide-react';

interface FinalConfirmationScreenProps {
  preferences: any;
  onComplete: () => void;
}

const FinalConfirmationScreen: React.FC<FinalConfirmationScreenProps> = ({ 
  preferences, 
  onComplete 
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartUsingRajni = async () => {
    setIsStarting(true);
    
    // Simulate saving preferences and setup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#101010] particle-field">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Celebration Animation */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-full flex items-center justify-center voice-excited success-sparkle">
                <CheckCircle className="w-10 h-10 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <div className="text-6xl">🎉</div>
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#00FFAB] rounded-full flex items-center justify-center voice-excited success-sparkle" style={{ animationDelay: '0.2s' }}>
                <Brain className="w-10 h-10 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#F2F2F2] mb-6 leading-tight">
              🎉 <span className="text-[#00FFAB]">You're All Set</span>
            </h1>
            
            <p className="font-body text-2xl md:text-3xl text-[#F2F2F2]/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Rajni's ready to make life <span className="text-[#FF6B35] font-semibold">smoother</span>, 
              <span className="text-[#1F51FF] font-semibold"> faster</span>, and 
              <span className="text-[#00FFAB] font-semibold"> way more you</span>.
            </p>
          </div>

          {/* What's Next Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50 btn-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-calm">
                <Zap className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
              </div>
              <h3 className="font-header text-xl font-bold text-[#F2F2F2] mb-3">
                Instant Actions
              </h3>
              <p className="font-body text-[#F2F2F2]/70">
                Just say "Order my usual" or "Book a cab" and Rajni handles the rest
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50 btn-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1F51FF] to-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-thinking">
                <Brain className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
              </div>
              <h3 className="font-header text-xl font-bold text-[#F2F2F2] mb-3">
                Smart Learning
              </h3>
              <p className="font-body text-[#F2F2F2]/70">
                Rajni learns your patterns and suggests things before you even ask
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50 btn-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#00FFAB] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-excited">
                <Heart className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
              </div>
              <h3 className="font-header text-xl font-bold text-[#F2F2F2] mb-3">
                Personal Touch
              </h3>
              <p className="font-body text-[#F2F2F2]/70">
                Every interaction feels natural, like talking to your personal assistant
              </p>
            </div>
          </div>

          {/* Preferences Summary */}
          <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50 mb-12">
            <h2 className="font-header text-2xl font-bold text-[#F2F2F2] mb-6 flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-[#00FFAB]" strokeWidth={1.5} />
              Your Rajni Profile
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {preferences?.vendors && preferences.vendors.length > 0 && (
                <div>
                  <h3 className="font-header text-[#00FFAB] font-semibold mb-2">Favorite Vendors</h3>
                  <div className="space-y-1">
                    {preferences.vendors.slice(0, 3).map((vendor: string, index: number) => (
                      <p key={index} className="font-body text-[#F2F2F2]/70 text-sm">{vendor}</p>
                    ))}
                    {preferences.vendors.length > 3 && (
                      <p className="font-body text-[#F2F2F2]/50 text-xs">+{preferences.vendors.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}

              {preferences?.foodPreferences && preferences.foodPreferences.length > 0 && (
                <div>
                  <h3 className="font-header text-[#FF6B35] font-semibold mb-2">Food Preferences</h3>
                  <div className="space-y-1">
                    {preferences.foodPreferences.slice(0, 3).map((food: string, index: number) => (
                      <p key={index} className="font-body text-[#F2F2F2]/70 text-sm">{food}</p>
                    ))}
                    {preferences.foodPreferences.length > 3 && (
                      <p className="font-body text-[#F2F2F2]/50 text-xs">+{preferences.foodPreferences.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}

              {preferences?.addresses && preferences.addresses.length > 0 && (
                <div>
                  <h3 className="font-header text-[#1F51FF] font-semibold mb-2">Saved Addresses</h3>
                  <div className="space-y-1">
                    {preferences.addresses.slice(0, 2).map((address: any, index: number) => (
                      <p key={index} className="font-body text-[#F2F2F2]/70 text-sm">{address.label}</p>
                    ))}
                    {preferences.addresses.length > 2 && (
                      <p className="font-body text-[#F2F2F2]/50 text-xs">+{preferences.addresses.length - 2} more</p>
                    )}
                  </div>
                </div>
              )}

              {preferences?.services && preferences.services.length > 0 && (
                <div>
                  <h3 className="font-header text-[#00FFAB] font-semibold mb-2">Services</h3>
                  <div className="space-y-1">
                    {preferences.services.slice(0, 3).map((service: string, index: number) => (
                      <p key={index} className="font-body text-[#F2F2F2]/70 text-sm">{service}</p>
                    ))}
                    {preferences.services.length > 3 && (
                      <p className="font-body text-[#F2F2F2]/50 text-xs">+{preferences.services.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sample Commands */}
          <div className="mb-12">
            <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6">
              Try saying these to get started:
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "Order my usual lunch",
                "Book a cab to work",
                "Plan my weekend",
                "Find a good restaurant nearby"
              ].map((command, index) => (
                <div key={index} className="glass-panel p-4 rounded-xl border border-[#2A2A2A]/50">
                  <p className="font-body text-[#F2F2F2]/80 italic">"{command}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleStartUsingRajni}
              disabled={isStarting}
              className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-12 py-5 rounded-full text-xl font-header font-bold btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-4 mx-auto"
            >
              {isStarting ? (
                <>
                  <div className="w-6 h-6 border-2 border-[#101010]/30 border-t-[#101010] rounded-full loading-ring"></div>
                  <span>Setting up your Rajni...</span>
                </>
              ) : (
                <>
                  <Star className="w-6 h-6" strokeWidth={1.5} />
                  <span>Start Using Rajni</span>
                  <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
                </>
              )}
            </button>

            <p className="font-body text-[#F2F2F2]/60 text-sm mt-6 max-w-md mx-auto">
              Welcome to the future of personal assistance. Let's make your life easier, one task at a time.
            </p>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute top-32 right-16 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>🚀</div>
          <div className="absolute bottom-32 left-20 text-2xl animate-bounce" style={{ animationDelay: '2s' }}>🎯</div>
          <div className="absolute bottom-20 right-12 text-2xl animate-bounce" style={{ animationDelay: '2.5s' }}>💫</div>
        </div>
      </div>
    </div>
  );
};

export default FinalConfirmationScreen;