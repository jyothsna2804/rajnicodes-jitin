# RajniAI Database Configuration Steps

## Issue Analysis
The main issues identified:
1. **Enum Value Mismatch**: Functions using 'active' status which doesn't exist in lead_status enum
2. **Missing Database Functions**: Required utility functions not properly created
3. **Incomplete Migrations**: Some database objects not properly initialized

## Step-by-Step Configuration

### 1. Environment Setup
Ensure your `.env` file has the correct Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Apply Database Migrations
The comprehensive migration will fix all issues. Run it through Supabase Dashboard:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the migration file: `20250703090000_comprehensive_fix.sql`

### 3. Verify Database Schema
After migration, verify these components exist:

#### Functions:
- `get_lead_stats()` - Returns lead statistics with correct enum values
- `get_dashboard_stats(uuid)` - Returns user dashboard data
- `get_user_analytics(uuid, integer)` - Returns user analytics
- `update_updated_at_column()` - Trigger function for timestamp updates

#### Tables with RLS:
- `leads` - User profiles and lead data
- `budgets` - User budget information
- `usage_events` - User activity tracking
- `task_history` - User task management
- `vendor_accounts` - Connected vendor accounts
- `payment_methods` - User payment information
- `preferences` - User preferences
- `data_policies` - User data policies

### 4. Test Database Connection
Run the development server to test:
```bash
npm run dev
```

### 5. Verify Authentication Flow
1. Try signing up a new user
2. Check if lead record is created automatically
3. Verify dashboard loads without errors

## Common Issues and Solutions

### Issue: "invalid input value for enum"
**Solution**: The migration fixes all enum references. If you still see this:
1. Check for any custom queries in your code using invalid enum values
2. Ensure all migrations have been applied in order

### Issue: "function does not exist"
**Solution**: The migration recreates all required functions. If missing:
1. Manually run the function creation parts of the migration
2. Check function permissions with `GRANT EXECUTE`

### Issue: RLS Policy Errors
**Solution**: The migration updates RLS policies. If issues persist:
1. Verify user authentication is working
2. Check that `auth.uid()` returns the correct user ID

### Issue: Missing Tables
**Solution**: If any tables are missing, check that all previous migrations ran successfully:
1. Review migration history in Supabase Dashboard
2. Run missing migrations in chronological order

## Verification Checklist

After configuration, verify:
- [ ] User can sign up successfully
- [ ] Lead record is created automatically
- [ ] Dashboard loads without database errors
- [ ] Task creation works
- [ ] Profile page loads user data
- [ ] No console errors related to database

## Database Schema Summary

### Enums:
- `lead_status`: 'new', 'invited', 'installed'
- `task_status`: 'pending', 'done', 'error'  
- `payment_method_type`: 'upi', 'card', 'wallet'

### Key Relationships:
- `leads.id` = `auth.users.id` (1:1)
- `leads.id` → `budgets.lead_id` (1:1)
- `leads.id` → `task_history.lead_id` (1:many)
- `leads.id` → `usage_events.lead_id` (1:many)
- `leads.id` → `vendor_accounts.lead_id` (1:many)
- `leads.id` → `payment_methods.lead_id` (1:many)
- `leads.id` → `preferences.lead_id` (1:many)
- `leads.id` → `data_policies.lead_id` (1:1)

## Support
If issues persist after following these steps:
1. Check Supabase Dashboard logs for detailed error messages
2. Verify all environment variables are correctly set
3. Ensure your Supabase project has the latest updates applied