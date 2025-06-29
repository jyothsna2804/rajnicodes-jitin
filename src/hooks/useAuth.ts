import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to ensure lead record exists for authenticated user
  const ensureLeadRecord = async (user: User) => {
    try {
      // Check if lead record already exists
      const { data: existingLead, error: checkError } = await supabase
        .from('leads')
        .select('id')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if no lead exists
        console.error('Error checking for existing lead:', checkError)
        return
      }

      // If lead doesn't exist, create one
      if (!existingLead) {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        
        const { error: insertError } = await supabase
          .from('leads')
          .insert({
            id: user.id,
            full_name: fullName,
            email: user.email || '',
            source: 'auth_session',
            status: 'new'
          })

        if (insertError) {
          console.error('Error creating lead record:', insertError)
        } else {
          console.log('Lead record created successfully for user:', user.id)
          
          // Also create default data policies record
          const { error: policyError } = await supabase
            .from('data_policies')
            .insert({
              lead_id: user.id,
              auto_purge_days: 30,
              incognito_mode_enabled: false,
              data_export_requested: false
            })

          if (policyError) {
            console.error('Error creating data policies:', policyError)
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error ensuring lead record:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      // Ensure lead record exists if user is authenticated
      if (session?.user) {
        await ensureLeadRecord(session.user)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Ensure lead record exists if user is authenticated
        if (session?.user && event === 'SIGNED_IN') {
          await ensureLeadRecord(session.user)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user
  }
}