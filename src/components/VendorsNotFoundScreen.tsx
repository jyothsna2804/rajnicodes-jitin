import React from 'react';
import { 
  Brain, 
  Sparkles, 
  Bell, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Zap,
  Heart
} from 'lucide-react';

interface VendorsNotFoundScreenProps {
  missingVendors: string[];
  availableVendors: string[];
  onContinue: () => void;
  onGoBack?: () => void;
}

const VendorsNotFoundScreen: React.FC<VendorsNotFoundScreenProps> = ({ 
  missingVendors, 
  availableVendors,
  onContinue,
  onGoBack 
}) => {
  return (
    <div className="min-h-screen bg-[#101010] particle-field">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#00FFAB] rounded-2xl flex items-center justify-center voice-thinking">
                <Brain className="w-10 h-10 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <div className="text-5xl">🧠</div>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F2F2F2] mb-6 leading-tight">
              Some of your favorites <span className="text-[#FF6B35]">aren't here yet</span> — 
              <br />
              but <span className="text-[#00FFAB]">Rajni's just getting started</span>.
            </h1>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Missing Vendors */}
            <div className="glass-panel p-8 rounded-2xl border border-[#FF6B35]/30">
              <h2 className="font-header text-2xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-[#FF6B35]" strokeWidth={1.5} />
                Coming Soon
              </h2>
              
              <div className="space-y-4 mb-6">
                {missingVendors.map((vendor, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-xl">
                    <Clock className="w-5 h-5 text-[#FF6B35] flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-header text-[#F2F2F2] font-semibold">{vendor}</span>
                    <span className="ml-auto text-xs bg-[#FF6B35]/20 text-[#FF6B35] px-2 py-1 rounded-full font-header">
                      In Progress
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#2A2A2A]/50 p-4 rounded-xl">
                <p className="font-body text-[#F2F2F2]/70 text-sm text-center">
                  Don't worry — we're working on adding these to the platform!
                </p>
              </div>
            </div>

            {/* Right Column - Available Vendors */}
            <div className="glass-panel p-8 rounded-2xl border border-[#00FFAB]/30">
              <h2 className="font-header text-2xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-[#00FFAB]" strokeWidth={1.5} />
                Ready to Go
              </h2>
              
              <div className="space-y-4 mb-6">
                {availableVendors.map((vendor, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-[#00FFAB]/10 border border-[#00FFAB]/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-[#00FFAB] flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-header text-[#F2F2F2] font-semibold">{vendor}</span>
                    <span className="ml-auto text-xs bg-[#00FFAB]/20 text-[#00FFAB] px-2 py-1 rounded-full font-header">
                      Active
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#2A2A2A]/50 p-4 rounded-xl">
                <p className="font-body text-[#F2F2F2]/70 text-sm text-center">
                  These vendors are fully integrated and ready for your commands!
                </p>
              </div>
            </div>
          </div>

          {/* Rajni's Promise Section */}
          <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50 mb-12 bg-gradient-to-br from-[#1F51FF]/10 to-[#00FFAB]/10">
            <div className="text-center mb-8">
              <h2 className="font-header text-2xl font-bold text-[#F2F2F2] mb-4">
                💬 Rajni AI is like the legend it's named after — 
                <span className="text-[#00FFAB]"> always learning, always evolving</span>.
              </h2>
              
              <p className="font-body text-lg text-[#F2F2F2]/80 max-w-3xl mx-auto leading-relaxed">
                If your go-to brands or services aren't on the platform today, don't worry:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-excited">
                  <Zap className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
                </div>
                <h3 className="font-header text-[#F2F2F2] font-semibold mb-2">🚀 New vendors every week</h3>
                <p className="font-body text-[#F2F2F2]/70 text-sm">
                  We're constantly expanding our network
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1F51FF] to-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-calm">
                  <Bell className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
                </div>
                <h3 className="font-header text-[#F2F2F2] font-semibold mb-2">🔔 Instant updates</h3>
                <p className="font-body text-[#F2F2F2]/70 text-sm">
                  Get notified as soon as they're available
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#00FFAB] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-thinking">
                  <Brain className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
                </div>
                <h3 className="font-header text-[#F2F2F2] font-semibold mb-2">🧠 Smart matching</h3>
                <p className="font-body text-[#F2F2F2]/70 text-sm">
                  Rajni remembers and matches when possible
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center mx-auto mb-4 voice-excited">
                  <Sparkles className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
                </div>
                <h3 className="font-header text-[#F2F2F2] font-semibold mb-2">✨ A-game performance</h3>
                <p className="font-body text-[#F2F2F2]/70 text-sm">
                  Full power with what we've got
                </p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50 mb-12">
            <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6 text-center">
              What Happens Next?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#00FFAB] text-[#101010] rounded-full flex items-center justify-center mx-auto mb-3 font-header font-bold">
                  1
                </div>
                <h3 className="font-header text-[#F2F2F2] font-semibold mb-2">We Track Your Requests</h3>
                <p className="font-body text-[#F2F2F2]/70 text-sm">
                  Every time you ask for a missing vendor, we note it down
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#1F51FF] text-[#F2F2F2] rounded-full flex items-center justify-center mx-auto mb-3 font-header font-bold">
                  2
                </div>
                <h3 className="font-header text-[#F2F2F2] font-semibold mb-2">We Prioritize Integration</h3>
                <p className="font-body text-[#F2F2F2]/70 text-sm">
                  Most requested vendors get added first
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#FF6B35] text-[#F2F2F2] rounded-full flex items-center justify-center mx-auto mb-3 font-header font-bold">
                  3
                </div>
                <h3 className="font-header text-[#F2F2F2] font-semibold mb-2">You Get Notified</h3>
                <p className="font-body text-[#F2F2F2]/70 text-sm">
                  Instant notification when your favorites go live
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="text-center mb-8">
            <div className="glass-panel p-6 rounded-xl border border-[#2A2A2A]/50 max-w-2xl mx-auto">
              <p className="font-body text-lg text-[#F2F2F2]/80 mb-4">
                <span className="text-[#00FFAB] font-semibold">Until then</span>, I'll still work with what we've got — and bring my A-game.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
                <span className="font-header text-[#FF6B35] font-semibold">Ready to make your life easier</span>
                <Heart className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onContinue}
              className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-10 py-4 rounded-full text-lg font-header font-bold btn-lift btn-ripple flex items-center space-x-3"
            >
              <Sparkles className="w-6 h-6" strokeWidth={1.5} />
              <span>Let's Start with What We Have</span>
              <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {onGoBack && (
              <button
                onClick={onGoBack}
                className="glass-panel text-[#F2F2F2] px-8 py-4 rounded-full text-lg font-header font-semibold btn-lift btn-ripple border border-[#2A2A2A] flex items-center space-x-3"
              >
                <RefreshCw className="w-5 h-5" strokeWidth={1.5} />
                <span>Update My Preferences</span>
              </button>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="font-body text-[#F2F2F2]/50 text-sm max-w-2xl mx-auto">
              Your missing vendors will be automatically added to your profile once they become available. 
              No need to set up again!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsNotFoundScreen;