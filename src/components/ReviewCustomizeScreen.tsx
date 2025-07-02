import React, { useState } from 'react';
import { 
  CheckCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Coffee, 
  Car, 
  Scissors, 
  Dumbbell, 
  Sparkles,
  Brain,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ReviewCustomizeScreenProps {
  preferences: any;
  onComplete: (updatedPreferences: any) => void;
  onReset: () => void;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
}

interface Address {
  id: string;
  label: string;
  address: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
}

const ReviewCustomizeScreen: React.FC<ReviewCustomizeScreenProps> = ({ 
  preferences, 
  onComplete, 
  onReset 
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: '1', name: 'Swiggy', category: 'Food Delivery' },
    { id: '2', name: 'Blinkit', category: 'Groceries' },
    { id: '3', name: 'Amazon', category: 'Shopping' },
    { id: '4', name: 'Ola', category: 'Transportation' }
  ]);

  const [foodPreferences, setFoodPreferences] = useState<string[]>([
    'Biryani', 'Thai', 'Pizza'
  ]);

  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Home', address: '123 Main Street, Bangalore' },
    { id: '2', label: 'Work', address: 'Tech Park, Electronic City' }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'Visa', last4: '1234' }
  ]);

  const [services, setServices] = useState<string[]>([
    'Salon', 'Gym', 'Cleaning', 'Spa'
  ]);

  const [editingSection, setEditingSection] = useState<string | null>(null);

  const foodOptions = [
    'Biryani', 'Thai', 'Pizza', 'Chinese', 'South Indian', 'North Indian',
    'Italian', 'Mexican', 'Japanese', 'Continental', 'Fast Food', 'Healthy'
  ];

  const serviceOptions = [
    'Salon', 'Gym', 'Cleaning', 'Spa', 'Laundry', 'Repair', 'Tutoring',
    'Pet Care', 'Healthcare', 'Beauty', 'Massage', 'Yoga'
  ];

  const removeVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  const removeAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
  };

  const toggleFoodPreference = (food: string) => {
    setFoodPreferences(prev => 
      prev.includes(food) 
        ? prev.filter(f => f !== food)
        : [...prev, food]
    );
  };

  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleComplete = () => {
    const updatedPreferences = {
      ...preferences,
      vendors,
      foodPreferences,
      addresses,
      paymentMethods,
      services
    };
    onComplete(updatedPreferences);
  };

  return (
    <div className="min-h-screen bg-[#101010] particle-field">
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center voice-excited">
                <CheckCircle className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F2F2F2] mb-6 leading-tight">
              ✅ Here's What I Found — <span className="text-[#00FFAB]">Tweak Away</span>
            </h1>
            
            <p className="font-body text-xl text-[#F2F2F2]/80 mb-8 max-w-3xl mx-auto">
              Review and customize your preferences. You can always change these later.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Favorite Vendors */}
              <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-header text-xl font-bold text-[#F2F2F2] flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-[#00FFAB]" strokeWidth={1.5} />
                    Your Favorite Vendors
                  </h2>
                  <button className="text-[#00FFAB] hover:text-[#00FFAB]/80 btn-lift">
                    <Plus className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-3 bg-[#2A2A2A]/50 rounded-lg">
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold">{vendor.name}</p>
                        <p className="font-body text-[#F2F2F2]/60 text-sm">{vendor.category}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-[#1F51FF] hover:text-[#1F51FF]/80 btn-lift">
                          <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button 
                          onClick={() => removeVendor(vendor.id)}
                          className="text-[#FF6B35] hover:text-[#FF6B35]/80 btn-lift"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Go-To Food */}
              <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-header text-xl font-bold text-[#F2F2F2] flex items-center">
                    <Coffee className="w-5 h-5 mr-2 text-[#FF6B35]" strokeWidth={1.5} />
                    Your Go-To Food
                  </h2>
                  <button 
                    onClick={() => setEditingSection(editingSection === 'food' ? null : 'food')}
                    className="text-[#00FFAB] hover:text-[#00FFAB]/80 btn-lift font-header text-sm"
                  >
                    Edit Preferences
                  </button>
                </div>
                
                {editingSection === 'food' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {foodOptions.map((food) => (
                      <button
                        key={food}
                        onClick={() => toggleFoodPreference(food)}
                        className={`p-2 rounded-lg text-sm font-header transition-all ${
                          foodPreferences.includes(food)
                            ? 'bg-[#00FFAB] text-[#101010]'
                            : 'bg-[#2A2A2A]/50 text-[#F2F2F2]/70 hover:bg-[#2A2A2A]'
                        }`}
                      >
                        {food}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {foodPreferences.map((food) => (
                      <span 
                        key={food}
                        className="px-3 py-1 bg-[#00FFAB]/20 text-[#00FFAB] rounded-full text-sm font-header"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Addresses */}
              <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-header text-xl font-bold text-[#F2F2F2] flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#1F51FF]" strokeWidth={1.5} />
                    Saved Addresses
                  </h2>
                  <button className="text-[#00FFAB] hover:text-[#00FFAB]/80 btn-lift">
                    <Plus className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start justify-between p-3 bg-[#2A2A2A]/50 rounded-lg">
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold">{address.label}</p>
                        <p className="font-body text-[#F2F2F2]/60 text-sm">{address.address}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-[#1F51FF] hover:text-[#1F51FF]/80 btn-lift">
                          <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button 
                          onClick={() => removeAddress(address.id)}
                          className="text-[#FF6B35] hover:text-[#FF6B35]/80 btn-lift"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Linked Payments */}
              <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-header text-xl font-bold text-[#F2F2F2] flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#FF6B35]" strokeWidth={1.5} />
                    Linked Payments
                    <span className="ml-2 text-xs bg-[#2A2A2A] px-2 py-1 rounded text-[#F2F2F2]/60">Optional</span>
                  </h2>
                  <button className="text-[#00FFAB] hover:text-[#00FFAB]/80 btn-lift font-header text-sm">
                    Add via Bolt
                  </button>
                </div>
                
                <div className="space-y-3">
                  {paymentMethods.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-[#2A2A2A]/50 rounded-lg">
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold">
                          {payment.type} ****{payment.last4}
                        </p>
                        <p className="font-body text-[#F2F2F2]/60 text-sm">From email metadata</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-[#1F51FF] hover:text-[#1F51FF]/80 btn-lift">
                          <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button 
                          onClick={() => removePaymentMethod(payment.id)}
                          className="text-[#FF6B35] hover:text-[#FF6B35]/80 btn-lift"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {paymentMethods.length === 0 && (
                    <div className="text-center py-6">
                      <CreditCard className="w-8 h-8 text-[#F2F2F2]/30 mx-auto mb-2" strokeWidth={1.5} />
                      <p className="font-body text-[#F2F2F2]/60 text-sm">No payment methods found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Types */}
              <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-header text-xl font-bold text-[#F2F2F2] flex items-center">
                    <Scissors className="w-5 h-5 mr-2 text-[#00FFAB]" strokeWidth={1.5} />
                    Service Types You Use
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {serviceOptions.map((service) => (
                    <button
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`p-3 rounded-lg text-sm font-header transition-all flex items-center justify-center ${
                        services.includes(service)
                          ? 'bg-[#00FFAB] text-[#101010]'
                          : 'bg-[#2A2A2A]/50 text-[#F2F2F2]/70 hover:bg-[#2A2A2A]'
                      }`}
                    >
                      {service === 'Salon' && <Scissors className="w-4 h-4 mr-1" strokeWidth={1.5} />}
                      {service === 'Gym' && <Dumbbell className="w-4 h-4 mr-1" strokeWidth={1.5} />}
                      {service === 'Cleaning' && <Sparkles className="w-4 h-4 mr-1" strokeWidth={1.5} />}
                      {service === 'Spa' && <Coffee className="w-4 h-4 mr-1" strokeWidth={1.5} />}
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="text-center mb-8">
            <div className="glass-panel p-4 rounded-xl border border-[#2A2A2A]/50 max-w-md mx-auto">
              <p className="font-body text-[#00FFAB] flex items-center justify-center">
                <Brain className="w-5 h-5 mr-2" strokeWidth={1.5} />
                🧠 "Rajni's learning… You can always change this later."
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleComplete}
              className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-10 py-4 rounded-full text-lg font-header font-bold btn-lift btn-ripple flex items-center space-x-3"
            >
              <CheckCircle className="w-6 h-6" strokeWidth={1.5} />
              <span>Looks Good, Let's Go</span>
              <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <button
              onClick={onReset}
              className="glass-panel text-[#F2F2F2] px-8 py-4 rounded-full text-lg font-header font-semibold btn-lift btn-ripple border border-[#2A2A2A] flex items-center space-x-3"
            >
              <RotateCcw className="w-5 h-5" strokeWidth={1.5} />
              <span>Reset & Do It Manually</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCustomizeScreen;