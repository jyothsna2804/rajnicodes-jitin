import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  CreditCard, 
  Save, 
  Coffee, 
  ShoppingBag, 
  Car, 
  Scissors, 
  Dumbbell, 
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface ManualEntryScreenProps {
  onComplete: (preferences: any) => void;
}

const ManualEntryScreen: React.FC<ManualEntryScreenProps> = ({ onComplete }) => {
  const [vendors, setVendors] = useState<string[]>([]);
  const [newVendor, setNewVendor] = useState('');
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<{ label: string; address: string }[]>([]);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [services, setServices] = useState<string[]>([]);

  const vendorSuggestions = [
    'Swiggy', 'Zomato', 'Amazon', 'Flipkart', 'Blinkit', 'Zepto', 
    'Ola', 'Uber', 'Rapido', 'BigBasket', 'Grofers', 'Myntra'
  ];

  const foodOptions = [
    { name: 'Biryani', emoji: '🍛' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Thai', emoji: '🍜' },
    { name: 'Chinese', emoji: '🥡' },
    { name: 'South Indian', emoji: '🥥' },
    { name: 'North Indian', emoji: '🍛' },
    { name: 'Italian', emoji: '🍝' },
    { name: 'Mexican', emoji: '🌮' },
    { name: 'Japanese', emoji: '🍣' },
    { name: 'Continental', emoji: '🍽️' },
    { name: 'Fast Food', emoji: '🍔' },
    { name: 'Healthy', emoji: '🥗' }
  ];

  const serviceOptions = [
    { name: 'Salon', icon: Scissors },
    { name: 'Gym', icon: Dumbbell },
    { name: 'Cleaning', icon: Sparkles },
    { name: 'Spa', icon: Coffee },
    { name: 'Laundry', icon: ShoppingBag },
    { name: 'Repair', icon: Car },
    { name: 'Pet Care', icon: Coffee },
    { name: 'Healthcare', icon: Plus }
  ];

  const addVendor = () => {
    if (newVendor.trim() && !vendors.includes(newVendor.trim())) {
      setVendors([...vendors, newVendor.trim()]);
      setNewVendor('');
    }
  };

  const removeVendor = (vendor: string) => {
    setVendors(vendors.filter(v => v !== vendor));
  };

  const toggleFoodPreference = (food: string) => {
    setFoodPreferences(prev => 
      prev.includes(food) 
        ? prev.filter(f => f !== food)
        : [...prev, food]
    );
  };

  const addAddress = () => {
    if (newAddress.label.trim() && newAddress.address.trim()) {
      setAddresses([...addresses, { ...newAddress }]);
      setNewAddress({ label: '', address: '' });
    }
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleComplete = () => {
    const preferences = {
      vendors,
      foodPreferences,
      addresses,
      services,
      method: 'manual'
    };
    onComplete(preferences);
  };

  const isFormValid = vendors.length > 0 || foodPreferences.length > 0 || addresses.length > 0 || services.length > 0;

  return (
    <div className="min-h-screen bg-[#101010] particle-field">
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#00FFAB] rounded-2xl flex items-center justify-center mx-auto mb-6 voice-calm">
              <Search className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F2F2F2] mb-6 leading-tight">
              📝 Let's Do This <span className="text-[#00FFAB]">Your Way</span>
            </h1>
            
            <p className="font-body text-xl text-[#F2F2F2]/80 mb-8 max-w-2xl mx-auto">
              Help Rajni help you — just a few quick preferences.
            </p>
          </div>

          <div className="space-y-8 mb-12">
            {/* Favorite Vendors */}
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-[#00FFAB]" strokeWidth={1.5} />
                Favorite vendors?
              </h2>
              
              <div className="flex space-x-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addVendor()}
                    placeholder="Search or type vendor name..."
                    className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                  />
                </div>
                <button
                  onClick={addVendor}
                  className="bg-[#00FFAB] text-[#101010] px-6 py-3 rounded-xl font-header font-semibold btn-lift btn-ripple"
                >
                  <Plus className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Vendor Suggestions */}
              <div className="mb-4">
                <p className="font-body text-[#F2F2F2]/60 text-sm mb-3">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {vendorSuggestions.filter(v => !vendors.includes(v)).slice(0, 8).map((vendor) => (
                    <button
                      key={vendor}
                      onClick={() => {
                        setVendors([...vendors, vendor]);
                      }}
                      className="px-3 py-1 bg-[#2A2A2A]/50 text-[#F2F2F2]/70 rounded-full text-sm font-header hover:bg-[#00FFAB] hover:text-[#101010] btn-lift"
                    >
                      {vendor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Vendors */}
              {vendors.length > 0 && (
                <div>
                  <p className="font-body text-[#F2F2F2]/60 text-sm mb-3">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {vendors.map((vendor) => (
                      <div key={vendor} className="flex items-center space-x-2 px-3 py-1 bg-[#00FFAB]/20 text-[#00FFAB] rounded-full text-sm font-header">
                        <span>{vendor}</span>
                        <button
                          onClick={() => removeVendor(vendor)}
                          className="text-[#00FFAB] hover:text-[#FF6B35]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Favorite Food */}
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <Coffee className="w-5 h-5 mr-2 text-[#FF6B35]" strokeWidth={1.5} />
                Favorite food?
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {foodOptions.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => toggleFoodPreference(food.name)}
                    className={`p-4 rounded-xl text-center transition-all btn-lift ${
                      foodPreferences.includes(food.name)
                        ? 'bg-[#FF6B35] text-[#F2F2F2]'
                        : 'bg-[#2A2A2A]/50 text-[#F2F2F2]/70 hover:bg-[#2A2A2A]'
                    }`}
                  >
                    <div className="text-2xl mb-2">{food.emoji}</div>
                    <div className="font-header text-sm">{food.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#1F51FF]" strokeWidth={1.5} />
                Addresses?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  placeholder="Label (e.g., Home, Work)"
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    placeholder="Full address"
                    className="flex-1 px-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                  />
                  <button
                    onClick={addAddress}
                    className="bg-[#1F51FF] text-[#F2F2F2] px-6 py-3 rounded-xl font-header font-semibold btn-lift btn-ripple"
                  >
                    <Plus className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div className="space-y-2">
                  {addresses.map((address, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#2A2A2A]/50 rounded-lg">
                      <div>
                        <p className="font-header text-[#F2F2F2] font-semibold">{address.label}</p>
                        <p className="font-body text-[#F2F2F2]/60 text-sm">{address.address}</p>
                      </div>
                      <button
                        onClick={() => removeAddress(index)}
                        className="text-[#FF6B35] hover:text-[#FF6B35]/80 btn-lift"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#FF6B35]" strokeWidth={1.5} />
                Payment?
                <span className="ml-2 text-xs bg-[#2A2A2A] px-2 py-1 rounded text-[#F2F2F2]/60">Optional</span>
              </h2>
              
              <div className="text-center py-8">
                <button className="bg-gradient-to-r from-[#FF6B35] to-[#00FFAB] text-[#101010] px-8 py-3 rounded-xl font-header font-semibold btn-lift btn-ripple">
                  Connect Bolt/Stripe
                </button>
                <p className="font-body text-[#F2F2F2]/60 text-sm mt-3">
                  Securely connect your payment methods for seamless transactions
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-bold text-[#F2F2F2] mb-6 flex items-center">
                <Scissors className="w-5 h-5 mr-2 text-[#00FFAB]" strokeWidth={1.5} />
                Services you use?
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {serviceOptions.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <button
                      key={service.name}
                      onClick={() => toggleService(service.name)}
                      className={`p-4 rounded-xl text-center transition-all btn-lift ${
                        services.includes(service.name)
                          ? 'bg-[#00FFAB] text-[#101010]'
                          : 'bg-[#2A2A2A]/50 text-[#F2F2F2]/70 hover:bg-[#2A2A2A]'
                      }`}
                    >
                      <ServiceIcon className="w-6 h-6 mx-auto mb-2" strokeWidth={1.5} />
                      <div className="font-header text-sm">{service.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleComplete}
              disabled={!isFormValid}
              className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-10 py-4 rounded-full text-lg font-header font-bold btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
            >
              <Save className="w-6 h-6" strokeWidth={1.5} />
              <span>Save Profile & Start Using Rajni</span>
            </button>

            {!isFormValid && (
              <p className="font-body text-[#F2F2F2]/60 text-sm mt-4">
                Please add at least one preference to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryScreen;