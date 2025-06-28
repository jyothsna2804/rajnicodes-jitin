import { supabase } from './supabase'

// Database helper functions for user data management
export const databaseHelpers = {
  // Get user's preferences
  getUserPreferences: async () => {
    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Set a user preference
  setUserPreference: async (key: string, value: string, source: string = 'user') => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('preferences')
      .upsert({
        lead_id: user.id,
        key,
        value,
        source,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'lead_id,key'
      })
      .select()

    return { data, error }
  },

  // Get user's vendor accounts
  getUserVendorAccounts: async () => {
    const { data, error } = await supabase
      .from('vendor_accounts')
      .select('*')
      .order('linked_at', { ascending: false })

    return { data, error }
  },

  // Add vendor account
  addVendorAccount: async (vendorName: string, accountUsername?: string, authData?: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('vendor_accounts')
      .insert({
        lead_id: user.id,
        vendor_name: vendorName,
        account_username: accountUsername,
        auth_data: authData
      })
      .select()

    return { data, error }
  },

  // Get user's payment methods
  getUserPaymentMethods: async () => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('linked_at', { ascending: false })

    return { data, error }
  },

  // Add payment method
  addPaymentMethod: async (methodType: string, provider: string, tokenReference?: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        lead_id: user.id,
        method_type: methodType,
        provider,
        token_reference: tokenReference
      })
      .select()

    return { data, error }
  },

  // Get user's budget
  getUserBudget: async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .single()

    return { data, error }
  },

  // Set user budget
  setUserBudget: async (monthlyLimit: number, currency: string = 'INR', alertThreshold: number = 80) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('budgets')
      .upsert({
        lead_id: user.id,
        monthly_limit: monthlyLimit,
        currency,
        alert_threshold_percent: alertThreshold,
        updated_at: new Date().toISOString()
      })
      .select()

    return { data, error }
  },

  // Get user's task history
  getUserTaskHistory: async (limit: number = 50) => {
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  // Add task to history
  addTaskToHistory: async (rawCommand: string, intent?: string, status: string = 'pending') => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('task_history')
      .insert({
        lead_id: user.id,
        raw_command: rawCommand,
        intent,
        status
      })
      .select()

    return { data, error }
  },

  // Log usage event
  logUsageEvent: async (eventType: string, rawInput?: string, intent?: string, metadata?: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('usage_events')
      .insert({
        lead_id: user.id,
        event_type: eventType,
        raw_input: rawInput,
        intent,
        metadata
      })
      .select()

    return { data, error }
  },

  // Get user's data policies
  getUserDataPolicies: async () => {
    const { data, error } = await supabase
      .from('data_policies')
      .select('*')
      .single()

    return { data, error }
  },

  // Update data policies
  updateDataPolicies: async (policies: {
    auto_purge_days?: number
    incognito_mode_enabled?: boolean
    data_export_requested?: boolean
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('data_policies')
      .upsert({
        lead_id: user.id,
        ...policies,
        updated_at: new Date().toISOString()
      })
      .select()

    return { data, error }
  }
}