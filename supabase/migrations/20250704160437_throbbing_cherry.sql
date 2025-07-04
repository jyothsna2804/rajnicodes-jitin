/*
  # Safe Policy Drop and Recreation

  1. Safety Measures
    - Temporarily disable RLS during policy operations
    - Drop ALL existing policies to prevent conflicts
    - Re-enable RLS after policy recreation

  2. New Policy Structure
    - Service role: Full access for backend operations
    - Admin users: Full access for administrative tasks
    - Regular users: Access only to their own data

  3. Performance & Security
    - Add performance indexes
    - Clean up invalid enum values
    - Ensure proper RLS enforcement
*/

-- Step 1: Temporarily disable RLS to safely drop policies
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY['leads', 'budgets', 'usage_events', 'task_history', 'vendor_accounts', 'payment_methods', 'preferences', 'data_policies'];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;

-- Step 2: Drop ALL existing policies to prevent conflicts
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all policies for all our tables
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename IN ('leads', 'budgets', 'usage_events', 'task_history', 'vendor_accounts', 'payment_methods', 'preferences', 'data_policies')
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS on all tables
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

-- Step 4: Create comprehensive policies for LEADS table
CREATE POLICY "leads_service_role_access"
  ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "leads_admin_access"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

CREATE POLICY "leads_user_select"
  ON leads
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "leads_user_insert"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "leads_user_update"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Step 5: Create comprehensive policies for BUDGETS table
CREATE POLICY "budgets_service_role_access"
  ON budgets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "budgets_user_select"
  ON budgets
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "budgets_user_insert"
  ON budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "budgets_user_update"
  ON budgets
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "budgets_user_delete"
  ON budgets
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Step 6: Create comprehensive policies for USAGE_EVENTS table
CREATE POLICY "usage_events_service_role_access"
  ON usage_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "usage_events_user_select"
  ON usage_events
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "usage_events_user_insert"
  ON usage_events
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "usage_events_user_update"
  ON usage_events
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "usage_events_user_delete"
  ON usage_events
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Step 7: Create comprehensive policies for TASK_HISTORY table
CREATE POLICY "task_history_service_role_access"
  ON task_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "task_history_user_select"
  ON task_history
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "task_history_user_insert"
  ON task_history
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "task_history_user_update"
  ON task_history
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "task_history_user_delete"
  ON task_history
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Step 8: Create comprehensive policies for VENDOR_ACCOUNTS table
CREATE POLICY "vendor_accounts_service_role_access"
  ON vendor_accounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "vendor_accounts_admin_access"
  ON vendor_accounts
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

CREATE POLICY "vendor_accounts_user_select"
  ON vendor_accounts
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "vendor_accounts_user_insert"
  ON vendor_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "vendor_accounts_user_update"
  ON vendor_accounts
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "vendor_accounts_user_delete"
  ON vendor_accounts
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Step 9: Create comprehensive policies for PAYMENT_METHODS table
CREATE POLICY "payment_methods_service_role_access"
  ON payment_methods
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "payment_methods_user_select"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "payment_methods_user_insert"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "payment_methods_user_update"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "payment_methods_user_delete"
  ON payment_methods
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Step 10: Create comprehensive policies for PREFERENCES table
CREATE POLICY "preferences_service_role_access"
  ON preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "preferences_user_select"
  ON preferences
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "preferences_user_insert"
  ON preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "preferences_user_update"
  ON preferences
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "preferences_user_delete"
  ON preferences
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Step 11: Create comprehensive policies for DATA_POLICIES table
CREATE POLICY "data_policies_service_role_access"
  ON data_policies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "data_policies_user_select"
  ON data_policies
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

CREATE POLICY "data_policies_user_insert"
  ON data_policies
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "data_policies_user_update"
  ON data_policies
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

CREATE POLICY "data_policies_user_delete"
  ON data_policies
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- Step 12: Ensure all required functions exist with correct enum values
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

CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id uuid)
RETURNS TABLE (
    total_tasks bigint,
    pending_tasks bigint,
    completed_tasks bigint,
    error_tasks bigint,
    total_usage_events bigint,
    active_vendor_accounts bigint,
    total_budget numeric,
    current_spent numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM task_history WHERE lead_id = user_id) as total_tasks,
        (SELECT COUNT(*) FROM task_history WHERE lead_id = user_id AND status = 'pending') as pending_tasks,
        (SELECT COUNT(*) FROM task_history WHERE lead_id = user_id AND status = 'done') as completed_tasks,
        (SELECT COUNT(*) FROM task_history WHERE lead_id = user_id AND status = 'error') as error_tasks,
        (SELECT COUNT(*) FROM usage_events WHERE lead_id = user_id) as total_usage_events,
        (SELECT COUNT(*) FROM vendor_accounts WHERE lead_id = user_id) as active_vendor_accounts,
        (SELECT COALESCE(monthly_limit, 0) FROM budgets WHERE lead_id = user_id) as total_budget,
        (SELECT COALESCE(current_spent, 0) FROM budgets WHERE lead_id = user_id) as current_spent;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 13: Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 14: Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_lead_stats() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_dashboard_stats(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated, service_role;

-- Step 15: Add performance indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email_unique ON leads(email);
CREATE INDEX IF NOT EXISTS idx_task_history_lead_status ON task_history(lead_id, status);
CREATE INDEX IF NOT EXISTS idx_task_history_created_at ON task_history(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_lead_timestamp ON usage_events(lead_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON usage_events(event_type);
CREATE INDEX IF NOT EXISTS idx_vendor_accounts_lead_vendor ON vendor_accounts(lead_id, vendor_name);
CREATE INDEX IF NOT EXISTS idx_budgets_lead_id ON budgets(lead_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_lead_id ON payment_methods(lead_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(lead_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_preferences_lead_key ON preferences(lead_id, key);
CREATE INDEX IF NOT EXISTS idx_data_policies_lead_id ON data_policies(lead_id);

-- Step 16: Clean up any invalid enum values
UPDATE leads SET status = 'new' WHERE status NOT IN ('new', 'invited', 'installed');
UPDATE task_history SET status = 'pending' WHERE status NOT IN ('pending', 'done', 'error');

-- Step 17: Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_budgets_updated_at ON budgets;
CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_preferences_updated_at ON preferences;
CREATE TRIGGER update_preferences_updated_at
    BEFORE UPDATE ON preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_data_policies_updated_at ON data_policies;
CREATE TRIGGER update_data_policies_updated_at
    BEFORE UPDATE ON data_policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 18: Final verification that RLS is enabled
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