/*
  # Safe Policy Recreation Migration

  1. Security
    - Safely drop all existing policies
    - Recreate policies with proper permissions
    - Ensure data integrity during transition

  2. Tables Updated
    - leads
    - budgets  
    - usage_events
    - task_history
    - vendor_accounts
    - payment_methods
    - preferences
    - data_policies

  3. Changes
    - Drop all existing RLS policies safely
    - Create new comprehensive policies
    - Add admin and service role access
    - Ensure proper user isolation
*/

-- Temporarily disable RLS to safely drop policies
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE task_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE data_policies DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for leads table
DROP POLICY IF EXISTS "Admin users can manage leads" ON leads;
DROP POLICY IF EXISTS "Service role can manage leads" ON leads;
DROP POLICY IF EXISTS "Service role full access on leads" ON leads;
DROP POLICY IF EXISTS "Users can insert own lead data" ON leads;
DROP POLICY IF EXISTS "Users can read own lead data" ON leads;
DROP POLICY IF EXISTS "Users can update own lead data" ON leads;

-- Drop all existing policies for budgets table
DROP POLICY IF EXISTS "Service role full access on budgets" ON budgets;
DROP POLICY IF EXISTS "Users can delete own budget" ON budgets;
DROP POLICY IF EXISTS "Users can insert own budget" ON budgets;
DROP POLICY IF EXISTS "Users can read own budget" ON budgets;
DROP POLICY IF EXISTS "Users can update own budget" ON budgets;

-- Drop all existing policies for usage_events table
DROP POLICY IF EXISTS "Service role full access on usage_events" ON usage_events;
DROP POLICY IF EXISTS "Users can delete own usage events" ON usage_events;
DROP POLICY IF EXISTS "Users can insert own usage events" ON usage_events;
DROP POLICY IF EXISTS "Users can read own usage events" ON usage_events;
DROP POLICY IF EXISTS "Users can update own usage events" ON usage_events;

-- Drop all existing policies for task_history table
DROP POLICY IF EXISTS "Service role full access on task_history" ON task_history;
DROP POLICY IF EXISTS "Users can delete own task history" ON task_history;
DROP POLICY IF EXISTS "Users can insert own task history" ON task_history;
DROP POLICY IF EXISTS "Users can read own task history" ON task_history;
DROP POLICY IF EXISTS "Users can update own task history" ON task_history;

-- Drop all existing policies for vendor_accounts table
DROP POLICY IF EXISTS "Admin users can manage vendor_accounts" ON vendor_accounts;
DROP POLICY IF EXISTS "Service role full access on vendor_accounts" ON vendor_accounts;
DROP POLICY IF EXISTS "Users can delete own vendor accounts" ON vendor_accounts;
DROP POLICY IF EXISTS "Users can insert own vendor accounts" ON vendor_accounts;
DROP POLICY IF EXISTS "Users can read own vendor accounts" ON vendor_accounts;
DROP POLICY IF EXISTS "Users can update own vendor accounts" ON vendor_accounts;

-- Drop all existing policies for payment_methods table
DROP POLICY IF EXISTS "Service role full access on payment_methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can delete own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can insert own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can read own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can update own payment methods" ON payment_methods;

-- Drop all existing policies for preferences table
DROP POLICY IF EXISTS "Service role full access on preferences" ON preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON preferences;
DROP POLICY IF EXISTS "Users can read own preferences" ON preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON preferences;

-- Drop all existing policies for data_policies table
DROP POLICY IF EXISTS "Service role full access on data_policies" ON data_policies;
DROP POLICY IF EXISTS "Users can delete own data policies" ON data_policies;
DROP POLICY IF EXISTS "Users can insert own data policies" ON data_policies;
DROP POLICY IF EXISTS "Users can read own data policies" ON data_policies;
DROP POLICY IF EXISTS "Users can update own data policies" ON data_policies;

-- Re-enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_policies ENABLE ROW LEVEL SECURITY;

-- Create new comprehensive policies for LEADS table
CREATE POLICY "leads_service_role_full_access"
  ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "leads_admin_full_access"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

CREATE POLICY "leads_users_own_data_select"
  ON leads
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "leads_users_own_data_insert"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "leads_users_own_data_update"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Create new comprehensive policies for BUDGETS table
CREATE POLICY "budgets_service_role_full_access"
  ON budgets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "budgets_users_own_data_select"
  ON budgets
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "budgets_users_own_data_insert"
  ON budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "budgets_users_own_data_update"
  ON budgets
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "budgets_users_own_data_delete"
  ON budgets
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Create new comprehensive policies for USAGE_EVENTS table
CREATE POLICY "usage_events_service_role_full_access"
  ON usage_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "usage_events_users_own_data_select"
  ON usage_events
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "usage_events_users_own_data_insert"
  ON usage_events
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "usage_events_users_own_data_update"
  ON usage_events
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "usage_events_users_own_data_delete"
  ON usage_events
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Create new comprehensive policies for TASK_HISTORY table
CREATE POLICY "task_history_service_role_full_access"
  ON task_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "task_history_users_own_data_select"
  ON task_history
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "task_history_users_own_data_insert"
  ON task_history
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "task_history_users_own_data_update"
  ON task_history
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "task_history_users_own_data_delete"
  ON task_history
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Create new comprehensive policies for VENDOR_ACCOUNTS table
CREATE POLICY "vendor_accounts_service_role_full_access"
  ON vendor_accounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "vendor_accounts_admin_full_access"
  ON vendor_accounts
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

CREATE POLICY "vendor_accounts_users_own_data_select"
  ON vendor_accounts
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "vendor_accounts_users_own_data_insert"
  ON vendor_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "vendor_accounts_users_own_data_update"
  ON vendor_accounts
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "vendor_accounts_users_own_data_delete"
  ON vendor_accounts
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Create new comprehensive policies for PAYMENT_METHODS table
CREATE POLICY "payment_methods_service_role_full_access"
  ON payment_methods
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "payment_methods_users_own_data_select"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "payment_methods_users_own_data_insert"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "payment_methods_users_own_data_update"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "payment_methods_users_own_data_delete"
  ON payment_methods
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Create new comprehensive policies for PREFERENCES table
CREATE POLICY "preferences_service_role_full_access"
  ON preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "preferences_users_own_data_select"
  ON preferences
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "preferences_users_own_data_insert"
  ON preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "preferences_users_own_data_update"
  ON preferences
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "preferences_users_own_data_delete"
  ON preferences
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Create new comprehensive policies for DATA_POLICIES table
CREATE POLICY "data_policies_service_role_full_access"
  ON data_policies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "data_policies_users_own_data_select"
  ON data_policies
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "data_policies_users_own_data_insert"
  ON data_policies
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "data_policies_users_own_data_update"
  ON data_policies
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "data_policies_users_own_data_delete"
  ON data_policies
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Ensure all functions exist and work with correct enum values
CREATE OR REPLACE FUNCTION get_lead_stats()
RETURNS TABLE (
    total_leads bigint,
    new_leads bigint,
    invited_leads bigint,
    installed_leads bigint,
    leads_this_month bigint,
    leads_last_month bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_leads,
        COUNT(*) FILTER (WHERE status = 'new') as new_leads,
        COUNT(*) FILTER (WHERE status = 'invited') as invited_leads,
        COUNT(*) FILTER (WHERE status = 'installed') as installed_leads,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)) as leads_this_month,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - interval '1 month') 
                        AND created_at < date_trunc('month', CURRENT_DATE)) as leads_last_month
    FROM leads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_lead_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_lead_stats() TO service_role;

-- Add performance indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_history_lead_status ON task_history(lead_id, status);
CREATE INDEX IF NOT EXISTS idx_usage_events_lead_timestamp ON usage_events(lead_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_accounts_lead_vendor ON vendor_accounts(lead_id, vendor_name);
CREATE INDEX IF NOT EXISTS idx_budgets_lead_id ON budgets(lead_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_lead_id ON payment_methods(lead_id);
CREATE INDEX IF NOT EXISTS idx_preferences_lead_key ON preferences(lead_id, key);
CREATE INDEX IF NOT EXISTS idx_data_policies_lead_id ON data_policies(lead_id);

-- Clean up any invalid enum values
UPDATE leads SET status = 'new' WHERE status NOT IN ('new', 'invited', 'installed');
UPDATE task_history SET status = 'pending' WHERE status NOT IN ('pending', 'done', 'error');

-- Verify RLS is enabled on all tables
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY['leads', 'budgets', 'usage_events', 'task_history', 'vendor_accounts', 'payment_methods', 'preferences', 'data_policies'];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;