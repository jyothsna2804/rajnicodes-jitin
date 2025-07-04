# Policy Migration Guide

## What This Migration Does

This migration safely drops and recreates all Row Level Security (RLS) policies for the RajniAI database.

### Safety Measures
1. **Temporary RLS Disable**: Temporarily disables RLS during policy recreation to prevent access issues
2. **Complete Policy Drop**: Removes all existing policies that might have conflicts
3. **Comprehensive Recreation**: Creates new, consistent policies for all tables
4. **Data Integrity**: Ensures no data loss during the process

### Tables Updated
- `leads` - User profiles and lead data
- `budgets` - User budget information  
- `usage_events` - User activity tracking
- `task_history` - User task management
- `vendor_accounts` - Connected vendor accounts
- `payment_methods` - User payment information
- `preferences` - User preferences
- `data_policies` - User data policies

### New Policy Structure

Each table now has consistent policies:

#### Service Role Access
- **Full Access**: Service role can perform all operations (SELECT, INSERT, UPDATE, DELETE)
- **Purpose**: Allows backend services and admin operations

#### Admin Access (where applicable)
- **Full Access**: Users with admin role can manage all records
- **Purpose**: Administrative oversight and management

#### User Access
- **Own Data Only**: Users can only access their own records
- **Operations**: SELECT, INSERT, UPDATE, DELETE on their own data
- **Security**: Uses `auth.uid()` to ensure data isolation

### Policy Naming Convention
- `{table}_service_role_full_access` - Service role policies
- `{table}_admin_full_access` - Admin role policies  
- `{table}_users_own_data_{operation}` - User operation policies

## How to Apply

### Step 1: Run the Migration
Execute the migration in your Supabase SQL Editor:
```sql
-- Copy and paste the entire migration file content
```

### Step 2: Verify Policies
Check that policies were created correctly:
```sql
-- View all policies for a table
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

### Step 3: Test Access
1. Sign up a new user
2. Verify they can only see their own data
3. Test all CRUD operations work correctly

## Troubleshooting

### Issue: "permission denied for table"
**Solution**: The migration recreates all policies. If you see this error:
1. Ensure the migration completed successfully
2. Check that RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
3. Verify user authentication is working

### Issue: "policy already exists"
**Solution**: The migration drops all existing policies first. If you see this:
1. The migration may have been partially applied
2. Manually drop the conflicting policy and re-run the migration

### Issue: Users can see other users' data
**Solution**: Check the policy conditions:
1. Verify `auth.uid()` returns the correct user ID
2. Ensure the user is properly authenticated
3. Check that the `lead_id` column matches the user's ID

## Verification Checklist

After applying the migration:
- [ ] All tables have RLS enabled
- [ ] Service role can access all data
- [ ] Users can only access their own data
- [ ] Admin users can access all data (if applicable)
- [ ] No database errors in application logs
- [ ] Authentication flow works correctly

## Security Benefits

### Before Migration
- Inconsistent policy naming
- Potential policy conflicts
- Some tables might have had incomplete policies

### After Migration
- ✅ Consistent policy structure across all tables
- ✅ Clear separation of service, admin, and user access
- ✅ Comprehensive coverage of all CRUD operations
- ✅ Proper data isolation between users
- ✅ Enhanced security with explicit policy definitions

## Performance Improvements

The migration also adds performance indexes:
- `idx_leads_status_created` - Faster lead status queries
- `idx_task_history_lead_status` - Faster task filtering
- `idx_usage_events_lead_timestamp` - Faster event queries
- `idx_vendor_accounts_lead_vendor` - Faster vendor lookups
- Additional indexes for all foreign key relationships

This ensures optimal query performance while maintaining security.