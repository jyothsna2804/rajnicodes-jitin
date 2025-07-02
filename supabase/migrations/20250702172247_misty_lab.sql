/*
  # Complete RajniAI Database Schema Migration

  1. New Tables
    - `vendor_accounts` - Connected services (Swiggy, Uber, etc.)
    - `payment_methods` - Payment preferences with secure token storage
    - `preferences` - Personal AI settings and learned behaviors
    - `task_history` - Command execution tracking
    - `budgets` - Smart spending controls
    - `usage_events` - Learning and analytics data
    - `data_policies` - Privacy and retention settings

  2. Enhanced Existing Tables
    - Update `leads` table with profile picture support
    - Add additional indexes for performance

  3. Security
    - Enable RLS on all new tables
    - Add policies for service role and admin access (only if they don't exist)
    - Comprehensive constraints and validation

  4. Utility Functions
    - Analytics and management functions
    - Privacy compliance helpers
*/

-- 0) Utilities and Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types (check if they exist first)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE lead_status AS ENUM ('new', 'invited', 'installed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('pending', 'done', 'error');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_type') THEN
    CREATE TYPE payment_method_type AS ENUM ('upi', 'card', 'wallet');
  END IF;
END $$;

-- 1) Core Leads Table (only create if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.leads (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           text        NOT NULL,
  email               text        NOT NULL,
  phone               text,
  organization_name   text,
  interest_tags       text[]      DEFAULT '{}',
  source              text        DEFAULT 'landing_page',
  status              lead_status DEFAULT 'new',
  created_at          timestamptz DEFAULT now()
);

-- Add constraints only if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leads_email_valid' AND table_name = 'leads'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_email_valid 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leads_email_unique' AND table_name = 'leads'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_email_unique UNIQUE (email);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leads_full_name_not_empty' AND table_name = 'leads'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_full_name_not_empty 
    CHECK (length(trim(full_name)) > 0);
  END IF;
END $$;

-- Add profile picture support to existing leads table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN profile_picture_url text;
  END IF;
END $$;

-- 2) Vendor Accounts (Swiggy, Uber, etc.)
CREATE TABLE IF NOT EXISTS public.vendor_accounts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  vendor_name         text        NOT NULL,
  account_username    text,
  linked_at           timestamptz DEFAULT now(),
  is_default          boolean     DEFAULT false,
  auth_data           jsonb,
  
  -- Constraints
  CONSTRAINT vendor_accounts_vendor_name_not_empty CHECK (length(trim(vendor_name)) > 0)
);

-- 3) Payment Methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  method_type         payment_method_type,
  provider            text,
  token_reference     text,
  is_default          boolean DEFAULT false,
  linked_at           timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT payment_methods_provider_not_empty CHECK (length(trim(provider)) > 0)
);

-- 4) Personal Preferences (K-V store)
CREATE TABLE IF NOT EXISTS public.preferences (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  key                 text        NOT NULL,
  value               text,
  source              text        DEFAULT 'user',
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT preferences_key_not_empty CHECK (length(trim(key)) > 0),
  CONSTRAINT preferences_unique_key_per_lead UNIQUE (lead_id, key)
);

-- 5) Task History (commands + outcome)
CREATE TABLE IF NOT EXISTS public.task_history (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  raw_command         text        NOT NULL,
  intent              text,
  status              task_status DEFAULT 'pending',
  result_data         jsonb,
  error_message       text,
  created_at          timestamptz DEFAULT now(),
  completed_at        timestamptz,
  
  -- Constraints
  CONSTRAINT task_history_raw_command_not_empty CHECK (length(trim(raw_command)) > 0)
);

-- 6) Budgets (Smart Spend Control)
CREATE TABLE IF NOT EXISTS public.budgets (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  monthly_limit       numeric     CHECK (monthly_limit > 0),
  currency            text        DEFAULT 'INR',
  alert_threshold_percent int     DEFAULT 80 CHECK (alert_threshold_percent BETWEEN 1 AND 100),
  current_spent       numeric     DEFAULT 0 CHECK (current_spent >= 0),
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- 7) Usage Events (learning stream)
CREATE TABLE IF NOT EXISTS public.usage_events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type          text        NOT NULL,
  raw_input           text,
  intent              text,
  metadata            jsonb,
  timestamp           timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT usage_events_event_type_not_empty CHECK (length(trim(event_type)) > 0)
);

-- 8) Data-Retention / Privacy Policies
CREATE TABLE IF NOT EXISTS public.data_policies (
  lead_id             uuid PRIMARY KEY REFERENCES public.leads(id) ON DELETE CASCADE,
  auto_purge_days     int         DEFAULT 30 CHECK (auto_purge_days > 0),
  incognito_mode_enabled boolean  DEFAULT false,
  data_export_requested boolean  DEFAULT false,
  data_export_requested_at timestamptz,
  updated_at          timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- Row-Level Security (RLS)
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_policies ENABLE ROW LEVEL SECURITY;

-- Service role policies (full access for backend operations)
-- Only create policies that don't already exist

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Service role full access on leads'
  ) THEN
    CREATE POLICY "Service role full access on leads"
      ON public.leads FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vendor_accounts' 
    AND policyname = 'Service role full access on vendor_accounts'
  ) THEN
    CREATE POLICY "Service role full access on vendor_accounts"
      ON public.vendor_accounts FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_methods' 
    AND policyname = 'Service role full access on payment_methods'
  ) THEN
    CREATE POLICY "Service role full access on payment_methods"
      ON public.payment_methods FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'preferences' 
    AND policyname = 'Service role full access on preferences'
  ) THEN
    CREATE POLICY "Service role full access on preferences"
      ON public.preferences FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_history' 
    AND policyname = 'Service role full access on task_history'
  ) THEN
    CREATE POLICY "Service role full access on task_history"
      ON public.task_history FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'budgets' 
    AND policyname = 'Service role full access on budgets'
  ) THEN
    CREATE POLICY "Service role full access on budgets"
      ON public.budgets FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'usage_events' 
    AND policyname = 'Service role full access on usage_events'
  ) THEN
    CREATE POLICY "Service role full access on usage_events"
      ON public.usage_events FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'data_policies' 
    AND policyname = 'Service role full access on data_policies'
  ) THEN
    CREATE POLICY "Service role full access on data_policies"
      ON public.data_policies FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Admin user policies (for authenticated admin users)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Admin users can manage leads'
  ) THEN
    CREATE POLICY "Admin users can manage leads"
      ON public.leads FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM auth.users 
          WHERE auth.users.id = auth.uid() 
          AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM auth.users 
          WHERE auth.users.id = auth.uid() 
          AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
      );
  END IF;
END $$;

-- User policies for accessing their own data
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Users can read own lead data'
  ) THEN
    CREATE POLICY "Users can read own lead data"
      ON public.leads FOR SELECT TO authenticated
      USING (id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Users can update own lead data'
  ) THEN
    CREATE POLICY "Users can update own lead data"
      ON public.leads FOR UPDATE TO authenticated
      USING (id = auth.uid()) WITH CHECK (id = auth.uid());
  END IF;
END $$;

-- User policies for vendor accounts
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vendor_accounts' 
    AND policyname = 'Users can read own vendor accounts'
  ) THEN
    CREATE POLICY "Users can read own vendor accounts"
      ON public.vendor_accounts FOR SELECT TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vendor_accounts' 
    AND policyname = 'Users can insert own vendor accounts'
  ) THEN
    CREATE POLICY "Users can insert own vendor accounts"
      ON public.vendor_accounts FOR INSERT TO authenticated
      WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vendor_accounts' 
    AND policyname = 'Users can update own vendor accounts'
  ) THEN
    CREATE POLICY "Users can update own vendor accounts"
      ON public.vendor_accounts FOR UPDATE TO authenticated
      USING (lead_id = auth.uid()) WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vendor_accounts' 
    AND policyname = 'Users can delete own vendor accounts'
  ) THEN
    CREATE POLICY "Users can delete own vendor accounts"
      ON public.vendor_accounts FOR DELETE TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

-- User policies for payment methods
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_methods' 
    AND policyname = 'Users can read own payment methods'
  ) THEN
    CREATE POLICY "Users can read own payment methods"
      ON public.payment_methods FOR SELECT TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_methods' 
    AND policyname = 'Users can insert own payment methods'
  ) THEN
    CREATE POLICY "Users can insert own payment methods"
      ON public.payment_methods FOR INSERT TO authenticated
      WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_methods' 
    AND policyname = 'Users can update own payment methods'
  ) THEN
    CREATE POLICY "Users can update own payment methods"
      ON public.payment_methods FOR UPDATE TO authenticated
      USING (lead_id = auth.uid()) WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_methods' 
    AND policyname = 'Users can delete own payment methods'
  ) THEN
    CREATE POLICY "Users can delete own payment methods"
      ON public.payment_methods FOR DELETE TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

-- User policies for preferences
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'preferences' 
    AND policyname = 'Users can read own preferences'
  ) THEN
    CREATE POLICY "Users can read own preferences"
      ON public.preferences FOR SELECT TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'preferences' 
    AND policyname = 'Users can insert own preferences'
  ) THEN
    CREATE POLICY "Users can insert own preferences"
      ON public.preferences FOR INSERT TO authenticated
      WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'preferences' 
    AND policyname = 'Users can update own preferences'
  ) THEN
    CREATE POLICY "Users can update own preferences"
      ON public.preferences FOR UPDATE TO authenticated
      USING (lead_id = auth.uid()) WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'preferences' 
    AND policyname = 'Users can delete own preferences'
  ) THEN
    CREATE POLICY "Users can delete own preferences"
      ON public.preferences FOR DELETE TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

-- User policies for task history
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_history' 
    AND policyname = 'Users can read own task history'
  ) THEN
    CREATE POLICY "Users can read own task history"
      ON public.task_history FOR SELECT TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_history' 
    AND policyname = 'Users can insert own task history'
  ) THEN
    CREATE POLICY "Users can insert own task history"
      ON public.task_history FOR INSERT TO authenticated
      WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_history' 
    AND policyname = 'Users can update own task history'
  ) THEN
    CREATE POLICY "Users can update own task history"
      ON public.task_history FOR UPDATE TO authenticated
      USING (lead_id = auth.uid()) WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_history' 
    AND policyname = 'Users can delete own task history'
  ) THEN
    CREATE POLICY "Users can delete own task history"
      ON public.task_history FOR DELETE TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

-- User policies for budgets
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'budgets' 
    AND policyname = 'Users can read own budget'
  ) THEN
    CREATE POLICY "Users can read own budget"
      ON public.budgets FOR SELECT TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'budgets' 
    AND policyname = 'Users can insert own budget'
  ) THEN
    CREATE POLICY "Users can insert own budget"
      ON public.budgets FOR INSERT TO authenticated
      WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'budgets' 
    AND policyname = 'Users can update own budget'
  ) THEN
    CREATE POLICY "Users can update own budget"
      ON public.budgets FOR UPDATE TO authenticated
      USING (lead_id = auth.uid()) WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'budgets' 
    AND policyname = 'Users can delete own budget'
  ) THEN
    CREATE POLICY "Users can delete own budget"
      ON public.budgets FOR DELETE TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

-- User policies for usage events
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'usage_events' 
    AND policyname = 'Users can read own usage events'
  ) THEN
    CREATE POLICY "Users can read own usage events"
      ON public.usage_events FOR SELECT TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'usage_events' 
    AND policyname = 'Users can insert own usage events'
  ) THEN
    CREATE POLICY "Users can insert own usage events"
      ON public.usage_events FOR INSERT TO authenticated
      WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'usage_events' 
    AND policyname = 'Users can update own usage events'
  ) THEN
    CREATE POLICY "Users can update own usage events"
      ON public.usage_events FOR UPDATE TO authenticated
      USING (lead_id = auth.uid()) WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'usage_events' 
    AND policyname = 'Users can delete own usage events'
  ) THEN
    CREATE POLICY "Users can delete own usage events"
      ON public.usage_events FOR DELETE TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

-- User policies for data policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'data_policies' 
    AND policyname = 'Users can read own data policies'
  ) THEN
    CREATE POLICY "Users can read own data policies"
      ON public.data_policies FOR SELECT TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'data_policies' 
    AND policyname = 'Users can insert own data policies'
  ) THEN
    CREATE POLICY "Users can insert own data policies"
      ON public.data_policies FOR INSERT TO authenticated
      WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'data_policies' 
    AND policyname = 'Users can update own data policies'
  ) THEN
    CREATE POLICY "Users can update own data policies"
      ON public.data_policies FOR UPDATE TO authenticated
      USING (lead_id = auth.uid()) WITH CHECK (lead_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'data_policies' 
    AND policyname = 'Users can delete own data policies'
  ) THEN
    CREATE POLICY "Users can delete own data policies"
      ON public.data_policies FOR DELETE TO authenticated
      USING (lead_id = auth.uid());
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- Performance Indexes
-- ─────────────────────────────────────────────────────────────

-- Leads table indexes
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads (source);

-- Related tables indexes
CREATE INDEX IF NOT EXISTS vendor_accounts_lead_id_idx ON public.vendor_accounts (lead_id);
CREATE INDEX IF NOT EXISTS vendor_accounts_vendor_name_idx ON public.vendor_accounts (vendor_name);

CREATE INDEX IF NOT EXISTS payment_methods_lead_id_idx ON public.payment_methods (lead_id);
CREATE INDEX IF NOT EXISTS payment_methods_is_default_idx ON public.payment_methods (lead_id, is_default) WHERE is_default = true;

CREATE INDEX IF NOT EXISTS preferences_lead_id_key_idx ON public.preferences (lead_id, key);

CREATE INDEX IF NOT EXISTS task_history_lead_id_idx ON public.task_history (lead_id);
CREATE INDEX IF NOT EXISTS task_history_created_at_idx ON public.task_history (lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS task_history_status_idx ON public.task_history (status);

CREATE INDEX IF NOT EXISTS budgets_lead_id_idx ON public.budgets (lead_id);

CREATE INDEX IF NOT EXISTS usage_events_lead_id_idx ON public.usage_events (lead_id);
CREATE INDEX IF NOT EXISTS usage_events_timestamp_idx ON public.usage_events (lead_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS usage_events_event_type_idx ON public.usage_events (event_type);

-- ─────────────────────────────────────────────────────────────
-- Utility Functions (Drop and recreate to avoid conflicts)
-- ─────────────────────────────────────────────────────────────

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_lead_stats();
DROP FUNCTION IF EXISTS get_budget_status(uuid);
DROP FUNCTION IF EXISTS upsert_preference(uuid, text, text, text);
DROP FUNCTION IF EXISTS cleanup_old_usage_events();

-- Get comprehensive lead statistics (matches current schema)
CREATE OR REPLACE FUNCTION get_lead_stats()
RETURNS TABLE (
  total_leads bigint,
  new_leads bigint,
  invited_leads bigint,
  installed_leads bigint,
  leads_today bigint,
  leads_this_week bigint,
  leads_this_month bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE status = 'new') as new_leads,
    COUNT(*) FILTER (WHERE status = 'invited') as invited_leads,
    COUNT(*) FILTER (WHERE status = 'installed') as installed_leads,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as leads_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as leads_this_week,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as leads_this_month
  FROM public.leads;
$$;

-- Get user's budget status
CREATE OR REPLACE FUNCTION get_budget_status(user_lead_id uuid)
RETURNS TABLE (
  monthly_limit numeric,
  current_spent numeric,
  remaining_budget numeric,
  percentage_used numeric,
  alert_threshold_reached boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    b.monthly_limit,
    b.current_spent,
    (b.monthly_limit - b.current_spent) as remaining_budget,
    ROUND((b.current_spent / b.monthly_limit * 100), 2) as percentage_used,
    (b.current_spent / b.monthly_limit * 100) >= b.alert_threshold_percent as alert_threshold_reached
  FROM public.budgets b
  WHERE b.lead_id = user_lead_id;
$$;

-- Update preference with timestamp
CREATE OR REPLACE FUNCTION upsert_preference(
  user_lead_id uuid,
  pref_key text,
  pref_value text,
  pref_source text DEFAULT 'user'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_id uuid;
BEGIN
  INSERT INTO public.preferences (lead_id, key, value, source, updated_at)
  VALUES (user_lead_id, pref_key, pref_value, pref_source, now())
  ON CONFLICT (lead_id, key)
  DO UPDATE SET 
    value = EXCLUDED.value,
    source = EXCLUDED.source,
    updated_at = now()
  RETURNING id INTO result_id;
  
  RETURN result_id;
END;
$$;

-- Clean up old usage events (for privacy compliance)
CREATE OR REPLACE FUNCTION cleanup_old_usage_events()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count int;
BEGIN
  DELETE FROM public.usage_events 
  WHERE timestamp < (now() - INTERVAL '90 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Add trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at timestamps
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_preferences_updated_at'
  ) THEN
    CREATE TRIGGER update_preferences_updated_at
      BEFORE UPDATE ON public.preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_budgets_updated_at'
  ) THEN
    CREATE TRIGGER update_budgets_updated_at
      BEFORE UPDATE ON public.budgets
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_data_policies_updated_at'
  ) THEN
    CREATE TRIGGER update_data_policies_updated_at
      BEFORE UPDATE ON public.data_policies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;