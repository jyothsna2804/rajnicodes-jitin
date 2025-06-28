/*
  # Create leads table for RajniCodes landing page

  1. New Tables
    - `leads`
      - `id` (uuid, primary key, auto-generated)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `organization_name` (text, optional)
      - `interest_tags` (text array, optional)
      - `source` (text, default 'landing_page')
      - `status` (text, default 'new', enum: new, invited, installed)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `leads` table
    - Add policy for service_role/admin users to select and insert data
    - Restrict access to authenticated service accounts only

  3. Constraints
    - Email validation
    - Status enum constraint
    - Unique email constraint to prevent duplicates
*/

-- Create enum type for lead status
DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'invited', 'installed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization_name text,
  interest_tags text[],
  source text DEFAULT 'landing_page',
  status lead_status DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT leads_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT leads_email_unique UNIQUE (email),
  CONSTRAINT leads_full_name_not_empty CHECK (length(trim(full_name)) > 0)
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy for service_role and admin users
CREATE POLICY "Service role can manage leads"
  ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy for authenticated users with admin role (if you have role-based access)
CREATE POLICY "Admin users can manage leads"
  ON leads
  FOR ALL
  TO authenticated
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads (source);

-- Create a function to get lead statistics (optional utility)
CREATE OR REPLACE FUNCTION get_lead_stats()
RETURNS TABLE (
  total_leads bigint,
  new_leads bigint,
  invited_leads bigint,
  installed_leads bigint,
  leads_today bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE status = 'new') as new_leads,
    COUNT(*) FILTER (WHERE status = 'invited') as invited_leads,
    COUNT(*) FILTER (WHERE status = 'installed') as installed_leads,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as leads_today
  FROM leads;
$$;