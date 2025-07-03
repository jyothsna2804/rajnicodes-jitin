/*
  # Fix RLS policies for leads table

  1. Security Updates
    - Remove policies that reference non-existent users table
    - Update admin policies to use proper role checking
    - Ensure all policies work with Supabase auth system

  2. Changes
    - Fix admin user policies to use auth.jwt() instead of users table
    - Maintain existing user access patterns
    - Keep service role access intact
*/

-- Drop existing admin policies that reference users table
DROP POLICY IF EXISTS "Admin users can manage leads" ON leads;
DROP POLICY IF EXISTS "Admin users can manage vendor_accounts" ON vendor_accounts;

-- Create new admin policy for leads using proper auth metadata
CREATE POLICY "Admin users can manage leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Create new admin policy for vendor_accounts using proper auth metadata
CREATE POLICY "Admin users can manage vendor_accounts"
  ON vendor_accounts
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );