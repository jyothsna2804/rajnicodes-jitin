import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Search, 
  Mail, 
  ShoppingBag, 
  Car, 
  Coffee,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface FetchingPreferencesScreenProps {
  onComplete: (preferences: any) => void;
}

const FetchingPreferencesScreen: React.FC<FetchingPreferencesScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [foundItems, setFoundItems] = useState<string[]>([]);

  const steps = [
    { 
      icon: Mail, 
      text: "Scanning your recent emails...", 
      color: "from-[#00FFAB] to-[#1F51FF]",
      items: ["Order confirmations", "Booking receipts", "Subscription emails"]
    },
    { 
      icon: Search, 
      text: "Identifying your favorite vendors...", 
      color: "from-[#1F51FF] to-[#FF6B35]",
      items: ["Swiggy orders", "Zomato preferences", "Amazon purchases"]
    },
    { 
      icon: Coffee, 
      text: "Learning your cuisine preferences...", 
      color: "from-[#FF6B35] to-[#00FFAB]",
      items: ["Italian cuisine", "South Indian", "Chinese takeout"]
    },
    { 
      icon: Car, 
      text: "Finding your service patterns...", 
      color: "from-[#00FFAB] to-[#1F51FF]",
      items: ["Uber rides", "Ola bookings", "Metro routes"]
    }
  ];

  const rajniQuotes = [
    "Just tuning in to your vibes...",
    "Reading between the lines of your lifestyle...",
    "Connecting the dots of your preferences...",
    "Almost got your style figured out...",
    "Putting the final touches on your profile..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update current step based on progress
        const stepIndex = Math.floor(newProgress / 25);
        if (stepIndex !== currentStep && stepIndex < steps.length) {
          setCurrentStep(stepIndex);
          
          // Add found items for this step
          setTimeout(() => {
            setFoundItems(prev => [...prev, ...steps[stepIndex].items]);
          }, 500);
        }
        
        // Complete when progress reaches 100%
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete({
              vendors: ["Swiggy", "Zomato", "Amazon", "Uber", "Ola"],
              cuisines: ["Italian", "South Indian", "Chinese"],
              services: ["Food Delivery", "Ride Sharing", "E-commerce"],
              paymentMethods: ["UPI", "Credit Card"],
              preferences: {
                preferredDeliveryTime: "evening",
                budgetRange: "moderate",
                dietaryRestrictions: []
              }
            });
          }, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, onComplete]);

  const currentQuote = rajniQuotes[Math.floor((progress / 100) * rajniQuotes.length)] || rajniQuotes[0];

  return (
    <div className="min-h-screen bg-[#101010] particle-field">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center voice-thinking">
                <Brain className="w-10 h-10 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <div className="text-4xl">🕵️‍♂️</div>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F2F2F2] mb-6 leading-tight">
              <span className="text-[#00FFAB]">Rajni's Reading</span> the Signals…
            </h1>
            
            <p className="font-body text-xl text-[#F2F2F2]/80 mb-8 max-w-2xl mx-auto">
              Finding your favorite vendors, cuisines, service types… Give me a sec.
            </p>

            {/* Rajni Voice Line */}
            <div className="glass-panel p-4 rounded-xl border border-[#2A2A2A]/50 max-w-md mx-auto mb-8">
              <p className="font-body text-[#00FFAB] italic">
                "{currentQuote}"
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="w-full bg-[#2A2A2A] rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="font-header text-[#F2F2F2]/60 text-sm">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Current Step */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Processing Steps */}
            <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6">
                Processing Steps
              </h2>
              
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#00FFAB]/10 to-[#1F51FF]/10 border border-[#00FFAB]/30' 
                          : isCompleted
                          ? 'bg-[#00FFAB]/5 border border-[#00FFAB]/20'
                          : 'bg-[#2A2A2A]/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-[#00FFAB] text-[#101010]'
                          : isActive
                          ? `bg-gradient-to-br ${step.color}`
                          : 'bg-[#2A2A2A] text-[#F2F2F2]/40'
                      } ${isActive ? 'voice-thinking' : ''}`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" strokeWidth={1.5} />
                        ) : (
                          <StepIcon className="w-5 h-5 text-[#101010]" strokeWidth={1.5} />
                        )}
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className={`font-header font-semibold ${
                          isActive || isCompleted ? 'text-[#F2F2F2]' : 'text-[#F2F2F2]/40'
                        }`}>
                          {step.text}
                        </p>
                      </div>
                      
                      {isActive && (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#00FFAB] rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-[#1F51FF] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Found Items */}
            <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#00FFAB]" strokeWidth={1.5} />
                Discovered Preferences
              </h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {foundItems.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-[#2A2A2A]/50 rounded-lg success-sparkle"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-4 h-4 text-[#00FFAB] flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-body text-[#F2F2F2]/80 text-sm">{item}</span>
                  </div>
                ))}
                
                {foundItems.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[#2A2A2A] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-[#F2F2F2]/40" strokeWidth={1.5} />
                    </div>
                    <p className="font-body text-[#F2F2F2]/40 text-sm">
                      Scanning for your preferences...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[#00FFAB] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#1F51FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetchingPreferencesScreen;