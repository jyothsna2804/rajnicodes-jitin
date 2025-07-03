/*
  # Add INSERT policy for leads table

  1. Security Changes
    - Add RLS policy to allow authenticated users to insert their own lead records
    - This enables the signup process and ensureLeadRecord function to work properly
    
  2. Policy Details
    - Policy name: "Users can insert own lead data"
    - Allows INSERT operations for authenticated users
    - Restricts insertion to records where the id matches the authenticated user's ID (auth.uid())
*/

-- Add policy to allow authenticated users to insert their own lead records
CREATE POLICY "Users can insert own lead data"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());