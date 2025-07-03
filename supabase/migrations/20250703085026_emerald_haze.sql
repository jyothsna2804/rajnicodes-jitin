/*
  # Fix get_lead_stats function enum reference

  This migration completely drops and recreates the get_lead_stats function
  to use the correct enum values ('installed' instead of 'active').
*/

-- Drop the function completely first
DROP FUNCTION IF EXISTS get_lead_stats();

-- Recreate the function with correct enum values
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