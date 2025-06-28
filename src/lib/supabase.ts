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
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    return { data, error }
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
  }
}