import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Camera, 
  Upload, 
  Save, 
  Edit3, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { databaseHelpers } from '../lib/database';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  organization_name?: string;
  profile_picture_url?: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    organization_name: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } else {
        setProfile(data);
        setEditForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          organization_name: data.organization_name || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile in database
      const { error: updateError } = await supabase
        .from('leads')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, profile_picture_url: publicUrl } : null);
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload profile picture' });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          full_name: editForm.full_name.trim(),
          phone: editForm.phone.trim() || null,
          organization_name: editForm.organization_name.trim() || null
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        full_name: editForm.full_name.trim(),
        phone: editForm.phone.trim() || undefined,
        organization_name: editForm.organization_name.trim() || undefined
      } : null);

      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      organization_name: profile?.organization_name || ''
    });
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
          </div>
          <div className="w-8 h-8 border-2 border-[#00FFAB]/30 border-t-[#00FFAB] rounded-full loading-ring mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-[#101010]" strokeWidth={1.5} />
            </div>
            <h1 className="font-header text-3xl font-bold text-[#F2F2F2]">
              Your <span className="text-[#00FFAB]">Profile</span>
            </h1>
          </div>
          <p className="font-body text-[#F2F2F2]/70 max-w-2xl mx-auto">
            Manage your personal information and preferences
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
              <h2 className="font-header text-xl font-semibold text-[#F2F2F2] mb-6 flex items-center">
                <Camera className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Profile Picture
              </h2>
              
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#2A2A2A] flex items-center justify-center">
                      {profile?.profile_picture_url ? (
                        <img
                          src={profile.profile_picture_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-[#F2F2F2]/40" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                  
                  {uploading && (
                    <div className="absolute inset-0 bg-[#101010]/80 rounded-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-[#00FFAB] animate-spin" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-6 py-3 rounded-xl font-header font-semibold btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" strokeWidth={1.5} />
                      <span>Upload Profile Picture</span>
                    </>
                  )}
                </button>

                <p className="font-body text-[#F2F2F2]/60 text-xs mt-3">
                  Max file size: 5MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-header text-xl font-semibold text-[#F2F2F2] flex items-center">
                  <Settings className="w-5 h-5 mr-2" strokeWidth={1.5} />
                  Personal Information
                </h2>
                
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-[#00FFAB] hover:text-[#00FFAB]/80 btn-lift flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-header text-sm">Edit</span>
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-header font-medium text-[#F2F2F2] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-header font-medium text-[#F2F2F2] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organization_name" className="block text-sm font-header font-medium text-[#F2F2F2] mb-2">
                      Organization
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F2F2F2]/40" strokeWidth={1.5} />
                      <input
                        type="text"
                        id="organization_name"
                        name="organization_name"
                        value={editForm.organization_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                        placeholder="Enter your organization"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-6 py-3 rounded-xl font-header font-semibold btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" strokeWidth={1.5} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="glass-panel text-[#F2F2F2] px-6 py-3 rounded-xl btn-lift btn-ripple border border-[#2A2A2A] font-header flex items-center space-x-2"
                    >
                      <X className="w-5 h-5" strokeWidth={1.5} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-[#00FFAB]" strokeWidth={1.5} />
                    <div>
                      <p className="font-body text-[#F2F2F2]/60 text-sm">Full Name</p>
                      <p className="font-header text-[#F2F2F2] font-semibold">{profile?.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#1F51FF]" strokeWidth={1.5} />
                    <div>
                      <p className="font-body text-[#F2F2F2]/60 text-sm">Email</p>
                      <p className="font-header text-[#F2F2F2] font-semibold">{profile?.email}</p>
                    </div>
                  </div>

                  {profile?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
                      <div>
                        <p className="font-body text-[#F2F2F2]/60 text-sm">Phone</p>
                        <p className="font-header text-[#F2F2F2] font-semibold">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile?.organization_name && (
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-[#00FFAB]" strokeWidth={1.5} />
                      <div>
                        <p className="font-body text-[#F2F2F2]/60 text-sm">Organization</p>
                        <p className="font-header text-[#F2F2F2] font-semibold">{profile.organization_name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[#1F51FF]" strokeWidth={1.5} />
                    <div>
                      <p className="font-body text-[#F2F2F2]/60 text-sm">Member Since</p>
                      <p className="font-header text-[#F2F2F2] font-semibold">
                        {new Date(profile?.created_at || '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy & Security Section */}
            <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50 mt-6">
              <h3 className="font-header text-lg font-semibold text-[#F2F2F2] mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Privacy & Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-header text-[#F2F2F2] font-medium">Data Export</p>
                    <p className="font-body text-[#F2F2F2]/60 text-sm">Download all your data</p>
                  </div>
                  <button className="text-[#00FFAB] hover:text-[#00FFAB]/80 font-header text-sm btn-lift">
                    Request Export
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-header text-[#F2F2F2] font-medium">Delete Account</p>
                    <p className="font-body text-[#F2F2F2]/60 text-sm">Permanently delete your account</p>
                  </div>
                  <button className="text-[#FF6B35] hover:text-[#FF6B35]/80 font-header text-sm btn-lift">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;