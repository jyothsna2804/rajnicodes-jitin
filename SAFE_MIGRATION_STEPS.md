# Safe Policy Migration Steps

## Overview
This migration safely drops all existing RLS policies and recreates them with a consistent structure to prevent conflicts and ensure proper security.

## What This Migration Does

### 1. Safety First
- **Temporarily disables RLS** during policy operations to prevent access issues
- **Drops ALL existing policies** to eliminate conflicts
- **Re-enables RLS** after policy recreation

### 2. Comprehensive Policy Recreation
- **Service Role Access**: Full access for backend operations
- **Admin Access**: Full access for administrative users
- **User Access**: Users can only access their own data

### 3. Performance & Security Enhancements
- Adds performance indexes for faster queries
- Cleans up invalid enum values
- Ensures proper RLS enforcement

## How to Apply the Migration

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query

### Step 2: Execute the Migration
1. Copy the entire content of `20250704161500_safe_policy_drop_recreation.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute

### Step 3: Verify Success
Check that the migration completed successfully:
```sql
-- Verify policies exist
SELECT tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename IN ('leads', 'budgets', 'usage_events', 'task_history', 'vendor_accounts', 'payment_methods', 'preferences', 'data_policies')
ORDER BY tablename, policyname;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('leads', 'budgets', 'usage_events', 'task_history', 'vendor_accounts', 'payment_methods', 'preferences', 'data_policies');
```

## New Policy Structure

### Naming Convention
- `{table}_service_role_access` - Service role full access
- `{table}_admin_access` - Admin role full access (where applicable)
- `{table}_user_{operation}` - User operation policies (select, insert, update, delete)

### Security Model
1. **Service Role**: Can perform all operations on all data
2. **Admin Users**: Can manage all data (where applicable)
3. **Regular Users**: Can only access their own data using `auth.uid()`

## Tables Covered
- ✅ `leads` - User profiles and lead data
- ✅ `budgets` - User budget information
- ✅ `usage_events` - User activity tracking
- ✅ `task_history` - User task management
- ✅ `vendor_accounts` - Connected vendor accounts
- ✅ `payment_methods` - User payment information
- ✅ `preferences` - User preferences
- ✅ `data_policies` - User data policies

## Functions Updated
- ✅ `get_lead_stats()` - Fixed enum values
- ✅ `get_dashboard_stats(uuid)` - User dashboard data
- ✅ `update_updated_at_column()` - Trigger function

## Performance Improvements
- Added indexes for faster queries
- Optimized foreign key lookups
- Enhanced filtering performance

## Testing After Migration

### 1. Test User Authentication
```javascript
// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
})
```

### 2. Test Data Access
```javascript
// User should only see their own data
const { data: tasks } = await supabase
  .from('task_history')
  .select('*')
```

### 3. Test Admin Access (if applicable)
```javascript
// Admin users should see all data
const { data: allLeads } = await supabase
  .from('leads')
  .select('*')
```

## Troubleshooting

### Issue: "permission denied for table"
**Solution**: 
1. Verify the migration completed successfully
2. Check that the user is properly authenticated
3. Ensure RLS is enabled on the table

### Issue: "policy does not exist"
**Solution**:
1. Re-run the migration
2. Check for any syntax errors in the SQL

### Issue: Users can see other users' data
**Solution**:
1. Verify `auth.uid()` returns the correct user ID
2. Check that the `lead_id` column matches the user's ID
3. Ensure the user is properly authenticated

## Verification Checklist

After applying the migration:
- [ ] All tables have RLS enabled
- [ ] Service role can access all data
- [ ] Users can only access their own data
- [ ] No database errors in application logs
- [ ] Authentication flow works correctly
- [ ] Dashboard loads without errors
- [ ] Task creation and management works
- [ ] Profile page loads user data correctly

## Benefits of This Migration

### Before
- ❌ Inconsistent policy naming
- ❌ Potential policy conflicts
- ❌ Some tables had incomplete policies
- ❌ Functions using invalid enum values

### After
- ✅ Consistent policy structure across all tables
- ✅ Clear separation of service, admin, and user access
- ✅ Comprehensive coverage of all CRUD operations
- ✅ Proper data isolation between users
- ✅ Enhanced security with explicit policy definitions
- ✅ Fixed enum value issues
- ✅ Improved performance with proper indexes

This migration ensures your RajniAI database has robust, secure, and performant access controls.