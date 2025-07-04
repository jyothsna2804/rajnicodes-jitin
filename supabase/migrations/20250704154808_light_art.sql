/*
  # Comprehensive Database Fix

  This migration fixes all enum-related issues and ensures proper function definitions.

  ## Changes Made:
  1. Drop and recreate problematic functions with correct enum values
  2. Add missing utility functions
  3. Ensure all enum references are correct
  4. Add proper indexes and constraints
*/

-- Drop existing problematic functions
DROP FUNCTION IF EXISTS get_lead_stats();
DROP FUNCTION IF EXISTS get_dashboard_stats();
DROP FUNCTION IF EXISTS get_user_analytics();

-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create get_lead_stats function with correct enum values
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

-- Create dashboard stats function
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

-- Create user analytics function
CREATE OR REPLACE FUNCTION get_user_analytics(user_id uuid, days_back integer DEFAULT 30)
RETURNS TABLE (
    date_created date,
    tasks_count bigint,
    events_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(th.created_at) as date_created,
        COUNT(th.id) as tasks_count,
        COUNT(ue.id) as events_count
    FROM generate_series(
        CURRENT_DATE - (days_back || ' days')::interval,
        CURRENT_DATE,
        '1 day'::interval
    ) AS date_series(date_created)
    LEFT JOIN task_history th ON DATE(th.created_at) = date_series.date_created AND th.lead_id = user_id
    LEFT JOIN usage_events ue ON DATE(ue.timestamp) = date_series.date_created AND ue.lead_id = user_id
    GROUP BY date_series.date_created
    ORDER BY date_series.date_created;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure all tables have proper RLS policies
-- Update leads table policies if needed
DO $$
BEGIN
    -- Check if the policy exists and update it
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'leads' 
        AND policyname = 'Users can read own lead data'
    ) THEN
        DROP POLICY "Users can read own lead data" ON leads;
    END IF;
    
    CREATE POLICY "Users can read own lead data"
        ON leads FOR SELECT
        TO authenticated
        USING (id = auth.uid());
END $$;

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_history_lead_status ON task_history(lead_id, status);
CREATE INDEX IF NOT EXISTS idx_usage_events_lead_timestamp ON usage_events(lead_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_accounts_lead_vendor ON vendor_accounts(lead_id, vendor_name);

-- Ensure all enum values are consistent
-- Update any existing records that might have invalid status values
UPDATE leads SET status = 'new' WHERE status NOT IN ('new', 'invited', 'installed');
UPDATE task_history SET status = 'pending' WHERE status NOT IN ('pending', 'done', 'error');

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_lead_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_analytics(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;