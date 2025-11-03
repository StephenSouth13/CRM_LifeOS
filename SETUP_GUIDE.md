# Life OS - Setup & Testing Guide

## Quick Start: Test the System with Demo Users

You can **immediately test the RBAC system** using demo accounts. No Supabase setup required for initial testing!

### Demo Login Credentials

All demo accounts use password: **`123456`**

| Email | Role | Permissions |
|-------|------|-------------|
| `bod@demo.com` | **BOD** (Ban Điều Hành) | Full read access, salary management, approval power |
| `admin@demo.com` | **ADMIN** (Quản trị viên) | System management, user/role management, full CRUD |
| `leader@demo.com` | **LEADER** (Trưởng nhóm) | Team management, task assignment, evaluations |
| `student3@demo.com` | **STUDENT_L3** (Học viên L3) | Senior student with task management |
| `student2@demo.com` | **STUDENT_L2** (Học viên L2) | Mid-level student with task execution |
| `student1@demo.com` | **STUDENT_L1** (Học viên L1) | Junior student with limited access |
| `mentor@demo.com` | **MENTOR** (Cố vấn) | Skill evaluation and coaching |

### How to Test Different Roles

1. **Go to Login Page**: http://localhost:3000/auth/login
2. **Click any demo user button** to quickly login with that role
3. **Observe the differences**:
   - ✅ Different dashboard modules visible
   - ✅ Different navigation items based on role
   - ✅ Different stat cards visible on dashboard
   - ✅ Different permission messages when accessing restricted features

## Production Setup: Using Supabase

### Step 1: Connect Supabase

1. **Get your Supabase credentials:**
   - Project URL: `https://[project-id].supabase.co`
   - Anon Key: Found in Supabase > Settings > API Keys
   - Service Role Key: Found in Supabase > Settings > API Keys

2. **Update environment variables** in your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### Step 2: Create Database Schema

1. **Open Supabase SQL Editor**
2. **Copy the SQL from** `lib/supabase/migrations.sql`
3. **Run the migration** in Supabase
4. This creates all tables with proper RLS policies

### Step 3: Create Test Users (Production Mode)

You can create users using the `/api/auth/register` endpoint or directly in Supabase Auth:

```bash
# Example: Register a new BOD user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bod@company.com",
    "password": "SecurePassword123",
    "name": "Company BOD",
    "org_id": "your-org-id"
  }'
```

Then manually update their role to BOD in the `memberships` table.

### Step 4: Promote Users to Different Roles

Use the role management API:

```bash
curl -X PUT http://localhost:3000/api/users/[user-id]/role \
  -H "Content-Type: application/json" \
  -d '{
    "new_role": "LEADER",
    "org_id": "your-org-id",
    "assigned_by": "admin-user-id"
  }'
```

## Testing Different Features

### Test Attendance Module
1. Login as **LEADER** or **ADMIN**
2. Go to **Attendance** module
3. Should see team attendance data
4. Click "Check In" to record attendance

### Test Tasks Module
1. Login as **LEADER**
2. Go to **Tasks** module
3. Should be able to create and assign tasks to team members
4. **STUDENT_L1** should only see assigned tasks (read-only)

### Test Evaluations (ASK)
1. Login as **LEADER**
2. Go to **Evaluations** module
3. Should be able to evaluate team members
4. **BOD** should see all evaluations and can approve

### Test Access Control
1. Login as **STUDENT_L1**
2. Try accessing `/dashboard/admin` → Should be denied
3. Try accessing `/dashboard/billing` → Should be denied
4. Check API: Fetch `/api/tasks?org_id=...` → Should only return assigned tasks

### Test Role Promotion
1. Login as **ADMIN**
2. Go to **Users** module (should be visible)
3. Select a user and promote them (change role)
4. User's permissions should update on next login

## Troubleshooting

### Issue: "Login failed" with demo users
**Solution**: 
- Verify you're entering exact email and password: `123456`
- Check browser console for detailed error messages
- Try a different demo account

### Issue: Demo users work but can't create real users
**Solution**:
- Ensure Supabase is connected (check environment variables)
- Run the migrations from `lib/supabase/migrations.sql`
- Verify the `/api/auth/register` endpoint is working

### Issue: Supabase integration fails
**Solution**:
1. Verify all environment variables are correct
2. Check Supabase project is active (not paused)
3. Run migrations again - ensure all tables were created
4. Check RLS policies are enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)

### Issue: Users can see data they shouldn't
**Solution**:
- This might be demo mode (check for `isDemoMode` in API response)
- Verify RLS policies are enabled in Supabase
- Check user's role and organization assignment
- Review `lib/supabase/migrations.sql` RLS policies

## Architecture Overview

### Authentication Flow
```
1. User enters email/password in login form
2. Frontend calls POST /api/auth/login
3. API tries Supabase auth first (production)
4. If Supabase fails, falls back to demo users
5. Returns user object with role information
6. Frontend stores user in Zustand store
7. Routes check permissions via usePermission() hook
```

### Permission Check Flow
```
1. Component renders with PermissionGuard or usePermission hook
2. Hook checks user's role in Zustand store
3. Looks up role in ROLE_PERMISSIONS matrix (lib/permissions.ts)
4. Returns true/false based on permission match
5. Component conditionally renders based on result
```

### API Security Flow
```
1. API endpoint receives request
2. Extract user ID/role from header or auth token
3. Check if user has required permission
4. If denied, return 403 Forbidden
5. If allowed, query database with Supabase admin client
6. RLS policies provide additional security layer
```

## File Structure

```
app/
├── api/auth/
│   ├── login/route.ts          # Authentication with fallback
│   └── register/route.ts       # User registration
├── api/
│   ├── attendance/route.ts     # Attendance check-in/out
│   ├── tasks/route.ts          # Task management
│   ├── evaluations/route.ts    # Evaluation management
│   └── users/
│       ├── route.ts            # User management
│       └── [id]/role/route.ts  # Role management
├── (auth)/
│   ├── login/page.tsx          # Login page with demo buttons
│   └── register/page.tsx       # Registration page
└── dashboard/
    └── page.tsx                # Dashboard with permission guards

components/
├── permission-guard.tsx        # Components for access control
├── dashboard-nav.tsx           # Navigation with permission filtering
└── role-badge.tsx             # Display user role

hooks/
├── use-permissions.ts          # 13 permission checking hooks
└── use-translation.ts          # Translation hook

lib/
├── types.ts                    # Type definitions
├── permissions.ts              # Permission matrix
├── store.ts                    # Zustand store with auth
└── supabase/
    ├── supabase.ts            # Supabase client setup
    └── migrations.sql         # Database schema
```

## Next Steps

### To Go Live
1. ✅ Set up production Supabase project
2. ✅ Run migrations
3. ✅ Create admin user
4. ✅ Promote other users to appropriate roles
5. ✅ Remove demo user login (optional)
6. ✅ Enable proper authentication

### To Extend RBAC
1. Add new permissions to `lib/types.ts`
2. Update `ROLE_PERMISSIONS` in `lib/permissions.ts`
3. Add permission checks to components
4. Add API validation to routes

### To Add New Role
1. Add role to `Role` type in `lib/types.ts`
2. Add to `ROLE_PERMISSIONS` matrix
3. Add to `ROLE_HIERARCHY` object
4. Update `getRoleLabel()`, `getRoleColor()` functions
5. Document in `RBAC_IMPLEMENTATION.md`

## Support

For detailed information about:
- **RBAC System**: See `RBAC_IMPLEMENTATION.md`
- **Role Permissions**: Check the matrix in `lib/permissions.ts`
- **API Endpoints**: Review the route files in `app/api/`
- **Frontend Hooks**: See `hooks/use-permissions.ts`

Happy testing! 🚀
