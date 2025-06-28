import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// More graceful error handling to prevent build cancellation
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
  
  // Provide fallback values to prevent build from failing
  const fallbackUrl = 'https://placeholder.supabase.co'
  const fallbackKey = 'placeholder-key'
  
  console.warn('Using fallback values for development. Please configure proper Supabase credentials.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email: string, password: string, fullName: string) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    
    try {
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (authError) {
        return { data: null, error: authError }
      }

      // Step 2: If user creation was successful and we have a user ID, create corresponding lead record
      if (authData.user && authData.user.id) {
        // Insert into leads table with the same ID as the auth user
        const { error: leadError } = await supabase
          .from('leads')
          .insert({
            id: authData.user.id, // Use the same ID as auth.users.id
            full_name: fullName,
            email: email,
            source: 'landing_page',
            status: 'new'
          })

        if (leadError) {
          console.error('Error creating lead record:', leadError)
          // Note: The auth user was already created, but we couldn't create the lead record
          // In a production app, you might want to handle this more gracefully
          return { 
            data: authData, 
            error: { 
              message: 'Account created but profile setup incomplete. Please contact support.' 
            } 
          }
        }

        // Step 3: Create default data policies record for the user
        const { error: policyError } = await supabase
          .from('data_policies')
          .insert({
            lead_id: authData.user.id,
            auto_purge_days: 30,
            incognito_mode_enabled: false,
            data_export_requested: false
          })

        if (policyError) {
          console.error('Error creating data policies:', policyError)
          // This is less critical, so we don't fail the signup
        }
      }

      return { data: authData, error: null }
    } catch (error) {
      console.error('Unexpected error during signup:', error)
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during signup' } 
      }
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: { message: 'Supabase not configured' } }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { user: null, error: { message: 'Supabase not configured' } }
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { session: null, error: { message: 'Supabase not configured' } }
    }
    
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get user's lead profile
  getUserProfile: async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { profile: null, error: { message: 'Supabase not configured' } }
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { profile: null, error: { message: 'Not authenticated' } }
    }

    const { data: profile, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', user.id)
      .single()

    return { profile, error }
  }
}