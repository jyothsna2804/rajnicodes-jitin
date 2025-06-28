/*
  # Update RLS Policies for Direct User-Lead Linking

  This migration updates all RLS policies to use auth.uid() directly instead of 
  looking up leads by email, since we now ensure leads.id = auth.users.id.

  1. Updated Policies
    - All user-specific tables now use lead_id = auth.uid() for RLS
    - More efficient and secure than email-based lookups
    - Prevents data leakage between users

  2. Security
    - Users can only access their own data
    - Service role maintains full access for backend operations
    - Admin role policies remain unchanged
*/

-- Drop existing user policies that might conflict
DROP POLICY IF EXISTS "Users can read own lead data" ON public.leads;
DROP POLICY IF EXISTS "Users can update own lead data" ON public.leads;
DROP POLICY IF EXISTS "Users can read own vendor accounts" ON public.vendor_accounts;
DROP POLICY IF EXISTS "Users can manage own vendor accounts" ON public.vendor_accounts;
DROP POLICY IF EXISTS "Users can read own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can manage own payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can read own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.preferences;
DROP POLICY IF EXISTS "Users can read own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can manage own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can read own budget" ON public.budgets;
DROP POLICY IF EXISTS "Users can manage own budget" ON public.budgets;
DROP POLICY IF EXISTS "Users can read own usage events" ON public.usage_events;
DROP POLICY IF EXISTS "Users can manage own usage events" ON public.usage_events;
DROP POLICY IF EXISTS "Users can read own data policies" ON public.data_policies;
DROP POLICY IF EXISTS "Users can manage own data policies" ON public.data_policies;

-- ═══════════════════════════════════════════════════════════════════════════════
-- LEADS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own lead data
CREATE POLICY "Users can read own lead data"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Users can update their own lead data
CREATE POLICY "Users can update own lead data"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- VENDOR ACCOUNTS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own vendor accounts
CREATE POLICY "Users can read own vendor accounts"
  ON public.vendor_accounts
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

-- Users can insert their own vendor accounts
CREATE POLICY "Users can insert own vendor accounts"
  ON public.vendor_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

-- Users can update their own vendor accounts
CREATE POLICY "Users can update own vendor accounts"
  ON public.vendor_accounts
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

-- Users can delete their own vendor accounts
CREATE POLICY "Users can delete own vendor accounts"
  ON public.vendor_accounts
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- PAYMENT METHODS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own payment methods
CREATE POLICY "Users can read own payment methods"
  ON public.payment_methods
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

-- Users can insert their own payment methods
CREATE POLICY "Users can insert own payment methods"
  ON public.payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

-- Users can update their own payment methods
CREATE POLICY "Users can update own payment methods"
  ON public.payment_methods
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

-- Users can delete their own payment methods
CREATE POLICY "Users can delete own payment methods"
  ON public.payment_methods
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- PREFERENCES POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own preferences
CREATE POLICY "Users can read own preferences"
  ON public.preferences
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON public.preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON public.preferences
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
  ON public.preferences
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- TASK HISTORY POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own task history
CREATE POLICY "Users can read own task history"
  ON public.task_history
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

-- Users can insert their own task history
CREATE POLICY "Users can insert own task history"
  ON public.task_history
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

-- Users can update their own task history
CREATE POLICY "Users can update own task history"
  ON public.task_history
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

-- Users can delete their own task history
CREATE POLICY "Users can delete own task history"
  ON public.task_history
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- BUDGETS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own budget
CREATE POLICY "Users can read own budget"
  ON public.budgets
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

-- Users can insert their own budget
CREATE POLICY "Users can insert own budget"
  ON public.budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

-- Users can update their own budget
CREATE POLICY "Users can update own budget"
  ON public.budgets
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

-- Users can delete their own budget
CREATE POLICY "Users can delete own budget"
  ON public.budgets
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- USAGE EVENTS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own usage events
CREATE POLICY "Users can read own usage events"
  ON public.usage_events
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

-- Users can insert their own usage events
CREATE POLICY "Users can insert own usage events"
  ON public.usage_events
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

-- Users can update their own usage events
CREATE POLICY "Users can update own usage events"
  ON public.usage_events
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

-- Users can delete their own usage events
CREATE POLICY "Users can delete own usage events"
  ON public.usage_events
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- DATA POLICIES POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own data policies
CREATE POLICY "Users can read own data policies"
  ON public.data_policies
  FOR SELECT
  TO authenticated
  USING (lead_id = auth.uid());

-- Users can insert their own data policies
CREATE POLICY "Users can insert own data policies"
  ON public.data_policies
  FOR INSERT
  TO authenticated
  WITH CHECK (lead_id = auth.uid());

-- Users can update their own data policies
CREATE POLICY "Users can update own data policies"
  ON public.data_policies
  FOR UPDATE
  TO authenticated
  USING (lead_id = auth.uid())
  WITH CHECK (lead_id = auth.uid());

-- Users can delete their own data policies
CREATE POLICY "Users can delete own data policies"
  ON public.data_policies
  FOR DELETE
  TO authenticated
  USING (lead_id = auth.uid());