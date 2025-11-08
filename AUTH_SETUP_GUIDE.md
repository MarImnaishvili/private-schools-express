# Authentication Setup Guide

## What's Been Completed ✅

1. ✅ Installed Supabase packages (`@supabase/supabase-js`, `@supabase/ssr`)
2. ✅ Added Supabase credentials to `.env`
3. ✅ Created Supabase client utilities (`client.ts`, `server.ts`, `middleware.ts`)
4. ✅ Set up Next.js middleware for route protection
5. ✅ Created AuthContext provider
6. ✅ Wrapped app with AuthProvider
7. ✅ Created Login page (`/[locale]/login`)
8. ✅ Added auth translations (English & Georgian)
9. ✅ Created public Home page with school cards (`/[locale]/page.tsx`)
10. ✅ Created SchoolCard component
11. ✅ Created read-only AG-Grid page (`/[locale]/schools/page.tsx`)
12. ✅ Created protected Dashboard page (`/[locale]/dashboard/page.tsx`)
13. ✅ Updated Header navigation with auth-based links
14. ✅ Created Admin Employee Registration page (`/[locale]/admin/employees/page.tsx`)
15. ✅ Created API endpoint for employee creation (`/api/auth/create-employee`)

## What Needs to Be Done 🔧

### Step 1: Run SQL in Supabase Dashboard

Go to your Supabase dashboard → SQL Editor → New Query, and run this SQL:

```sql
-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('employee', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own role
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Only admins can insert roles
CREATE POLICY "Admins can insert roles"
  ON user_roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Only admins can update roles
CREATE POLICY "Admins can update roles"
  ON user_roles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Only admins can delete roles
CREATE POLICY "Admins can delete roles"
  ON user_roles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_roles
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Step 2: Create Your First Admin User

After running the SQL, you need to create your first admin user:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" or "Invite User"
3. Enter email and password
4. After the user is created, copy their User ID
5. Go back to SQL Editor and run:

```sql
-- Replace 'YOUR_USER_ID_HERE' with the actual user ID
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

Now you can log in with that email/password!

### Step 3: Add Service Role Key (Required for Employee Creation)

For the admin employee registration to work, you need to add the Supabase Service Role Key to `.env`:

1. Go to your Supabase Dashboard → Settings → API
2. Copy the **service_role** key (NOT the anon key)
3. Add to `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: The service_role key should NEVER be exposed to the client. It's only used server-side in the API route.

### Implementation Complete! ✅

All implementation tasks have been completed:

1. ✅ **Home Page with School Cards** - Shows school name, address (city, district), and phone number
2. ✅ **Read-Only AG-Grid Page** at `/[locale]/schools` - Public access, view-only
3. ✅ **Dashboard** at `/[locale]/dashboard` - Full CRUD functionality, auth protected
4. ✅ **Admin Employee Registration** at `/[locale]/admin/employees` - Admins can create employee/admin accounts
5. ✅ **Header Navigation** - Dynamic links based on auth state:
   - Not logged in: Home, View School Table, Login
   - Logged in (Employee/Admin): Home, View School Table, Dashboard, Logout
   - Logged in (Admin only): + Employee Management

## File Structure Created

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── create-employee/
│   │           └── route.ts      ✅ Created
│   └── [locale]/
│       ├── login/
│       │   └── page.tsx          ✅ Created
│       ├── dashboard/
│       │   └── page.tsx          ✅ Created
│       ├── schools/
│       │   ├── new/page.tsx      ✅ Exists
│       │   └── page.tsx          ✅ Created (read-only grid)
│       ├── page.tsx              ✅ Updated (school cards)
│       └── admin/
│           └── employees/
│               └── page.tsx      ✅ Created
├── components/
│   ├── Header.tsx                ✅ Updated (auth navigation)
│   ├── SchoolDataGrid.tsx        ✅ Exists (used in dashboard)
│   ├── ReadOnlySchoolDataGrid.tsx ✅ Created
│   └── SchoolCard.tsx            ✅ Created
├── contexts/
│   └── AuthContext.tsx           ✅ Created
├── lib/
│   └── supabase/
│       ├── client.ts             ✅ Created
│       ├── server.ts             ✅ Created
│       └── middleware.ts         ✅ Created
├── messages/
│   ├── en.json                   ✅ Updated (added auth translations)
│   └── ka.json                   ✅ Updated (added auth translations)
└── middleware.ts                 ✅ Created
```

## Testing Checklist

After completing all steps:

- [ ] Can access home page (public, no login)
- [ ] Can access read-only table from home page (public, no login)
- [ ] Cannot access `/dashboard` without login (redirects to login)
- [ ] Can log in with admin credentials
- [ ] After login, can access `/dashboard` with full CRUD
- [ ] Admin can access `/admin/employees` to register employees
- [ ] Can create new employee account
- [ ] Can log out
- [ ] Employee can log in and access dashboard
- [ ] Employee cannot access `/admin/employees`

## Summary

The authentication system is now fully implemented! All that's left for you to do is:

1. **Run the SQL** (Step 1) in your Supabase dashboard to create the `user_roles` table
2. **Create your first admin user** (Step 2) through Supabase dashboard
3. **Add the service role key** (Step 3) to `.env` for employee creation functionality
4. **Test the application** using the testing checklist above

Once these steps are complete, your private schools management application will have a complete authentication and authorization system with:
- Public home page with school cards
- Public read-only school table
- Protected dashboard for employees/admins
- Admin-only employee management page
- Role-based navigation in the header
