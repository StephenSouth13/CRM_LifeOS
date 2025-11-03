# Role-Based Access Control (RBAC) Implementation

## Overview

This document outlines the comprehensive RBAC system implemented for the Life OS application, supporting 8 distinct roles with hierarchical permissions across multiple modules.

## Role Hierarchy

| Rank | Role | Vietnamese | Permissions Level |
|------|------|-----------|------------------|
| 8 | **BOD** | Ban Điều Hành | Full Read + Salary Management |
| 7 | **ADMIN** | Quản trị viên | System-wide Management |
| 6 | **LEADER** | Trưởng nhóm | Team Management |
| 5 | **MENTOR** | Cố vấn/Huấn luyện viên | Evaluation & Training |
| 4 | **STUDENT_L3** | Học viên L3 | Senior Student (Leadership Support) |
| 3 | **STUDENT_L2** | Học viên L2 | Mid-level Student (Task Execution) |
| 2 | **STUDENT_L1** | Học viên L1 | Junior Student (Learning) |
| 1 | **CUSTOMER** | Khách hàng | Read-only Access |

## Role Permissions Summary

### BOD (Ban Điều Hành)
**Purpose**: Executive oversight and final approval authority

**Key Permissions**:
- ✅ Full READ access on all data
- ✅ Full CRUD on Salaries (base_salary, bonus, deductions)
- ✅ Verify attendance logs
- ✅ Approve all evaluations (ASK)
- ✅ Approve all leave requests
- ✅ View all reports and analytics
- ❌ Cannot create/assign tasks or manage operations

**Scope**: Organization-wide

### ADMIN (Quản trị Hệ thống)
**Purpose**: System administration and operational management

**Key Permissions**:
- ✅ Full CRUD on all tables
- ✅ Manage users and roles (promote/demote)
- ✅ Approve account creation
- ✅ Configure system settings
- ✅ Access admin dashboard
- ✅ Manage all organizations
- ✅ Create and assign tasks to anyone

**Scope**: Organization-wide

### LEADER (Trưởng nhóm)
**Purpose**: Team/project management and workflow oversight

**Key Permissions**:
- ✅ View team member data (attendance, tasks, evaluations)
- ✅ Create and assign tasks to team
- ✅ Verify team attendance
- ✅ Create evaluations for team members
- ✅ Approve team member evaluations
- ✅ Approve team leave requests
- ✅ Manage team calendar and bookings
- ❌ Cannot view/manage other teams
- ❌ Cannot change salaries

**Scope**: Assigned team only (determined by manager_id or team_id)

### MENTOR (Cố vấn/Huấn luyện viên)
**Purpose**: Specialized skill assessment and coaching

**Key Permissions**:
- ✅ Create evaluations for assigned students
- ✅ View personal evaluations
- ✅ Create and update own tasks
- ✅ Check-in/out for attendance
- ✅ Create leave requests
- ✅ Use AI tools

**Scope**: Assigned evaluatees only

### STUDENT_L3 (Học viên L3)
**Purpose**: Advanced learner with leadership support responsibilities

**Key Permissions**:
- ✅ Full task management (CRU) for team/assigned tasks
- ✅ Create evaluations for L1/CTV subordinates
- ✅ Check-in/out attendance
- ✅ View team information
- ✅ Create and manage calendar events
- ✅ Create leave requests
- ❌ Cannot approve evaluations
- ❌ Cannot view other team's tasks

**Scope**: Team tasks and assigned items

### STUDENT_L2 (Học viên L2)
**Purpose**: Mid-level learner focused on task execution

**Key Permissions**:
- ✅ View assigned tasks (R)
- ✅ Update status of assigned tasks (U)
- ✅ Create own tasks
- ✅ Check-in/out attendance
- ✅ View personal evaluations
- ✅ Create leave requests
- ❌ Cannot assign tasks
- ❌ Cannot view other's evaluations

**Scope**: Personal and assigned tasks only

### STUDENT_L1 & CTV (Học viên L1 / Cộng tác viên)
**Purpose**: Entry-level with supervised learning focus

**Key Permissions**:
- ✅ View assigned tasks (R)
- ✅ Check-in/out attendance
- ✅ View personal evaluations
- ✅ Create leave requests
- ❌ Cannot update tasks
- ❌ Cannot create tasks
- ❌ Cannot manage others

**Scope**: Personal data and assigned items only

### CUSTOMER / STAKEHOLDER
**Purpose**: External stakeholders with minimal access

**Key Permissions**:
- ✅ View public reports
- ✅ View calendar (read-only)
- ✅ View room availability
- ❌ Cannot access employee data
- ❌ Cannot manage any resources

**Scope**: Public and shared data only

## Module Access Matrix

| Module | BOD | ADMIN | LEADER | MENTOR | L3 | L2 | L1 | CUSTOMER |
|--------|-----|-------|--------|--------|----|----|----|----|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin Panel | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Attendance | READ | CRUD | TEAM | SELF | TEAM | SELF | SELF | ❌ |
| Tasks | READ | CRUD | TEAM | OWN | TEAM | SELF | READ | ❌ |
| Evaluations | APPROVE | CRUD | TEAM | TEAM | TEAM | SELF | SELF | ❌ |
| Salary | VIEW | CRUD | TEAM | ❌ | ❌ | SELF | SELF | ❌ |
| Leave Requests | APPROVE | CRUD | TEAM | SELF | SELF | SELF | SELF | ❌ |
| Calendar | VIEW | CRUD | TEAM | SELF | TEAM | SELF | SELF | READ |
| Users | VIEW | CRUD | TEAM | ❌ | ❌ | ❌ | ❌ | ❌ |
| Billing | VIEW | CRUD | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reports | VIEW | VIEW | TEAM | ❌ | ❌ | SELF | SELF | PUBLIC |

## Permission Types

### View Scopes
- `view_all`: Access to organization-wide data
- `view_team`: Access to team-specific data
- `view_self`: Access only to own data

### Action Types
- `create` (C): Create new resources
- `read` (R): View resources
- `update` (U): Modify existing resources
- `delete` (D): Remove resources

## Implementation Files

### Core Files
1. **`lib/types.ts`** - Type definitions for all roles and entities
2. **`lib/permissions.ts`** - Permission matrix and helper functions
3. **`hooks/use-permissions.ts`** - React hooks for permission checks
4. **`components/permission-guard.tsx`** - Components for access control
5. **`lib/supabase/migrations.sql`** - Database schema with RLS policies

### API Routes
1. **`app/api/auth/login/route.ts`** - User authentication
2. **`app/api/auth/register/route.ts`** - User registration
3. **`app/api/users/route.ts`** - User management
4. **`app/api/users/[id]/role/route.ts`** - Role management
5. **`app/api/attendance/route.ts`** - Attendance management
6. **`app/api/tasks/route.ts`** - Task management
7. **`app/api/evaluations/route.ts`** - Evaluation (ASK) management

### Updated Files
1. **`lib/store.ts`** - Updated with Supabase authentication
2. **`app/dashboard/page.tsx`** - Replaced mock data with permission guards
3. **`components/dashboard-nav.tsx`** - Role-based navigation filtering

## Usage Examples

### Checking Permissions in Components

```typescript
import { usePermission, useCanManageUser } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/permission-guard'

// Single permission check
function AdminPanel() {
  const canManage = usePermission('admin.manage')
  
  if (!canManage) {
    return <AccessDenied />
  }
  
  return <AdminDashboard />
}

// Multiple permissions (OR logic)
function SomeFeature() {
  const hasAccess = useAnyPermission('task.create', 'task.assign_all')
  
  return hasAccess ? <Feature /> : null
}

// Multiple permissions (AND logic)
function AnotherFeature() {
  const hasAccess = useAllPermissions('task.create', 'task.assign_team')
  
  return hasAccess ? <Feature /> : null
}

// Permission Guard Component
function TaskManager() {
  return (
    <PermissionGuard 
      permission="task.assign_team"
      fallback={<div>No access</div>}
    >
      <TaskAssignPanel />
    </PermissionGuard>
  )
}
```

### Checking Role Hierarchy

```typescript
import { canManageUser, getManagedRoles } from '@/lib/permissions'

const role1 = 'ADMIN'
const role2 = 'LEADER'

// Check if role1 can manage role2
if (canManageUser(role1, role2)) {
  // ADMIN can manage LEADER
}

// Get all roles that a role can manage
const managedRoles = getManagedRoles('LEADER')
// Returns: ['MENTOR', 'STUDENT_L3', 'STUDENT_L2', 'STUDENT_L1', 'CUSTOMER']
```

### API Usage with Permissions

```typescript
// All API endpoints enforce role-based access
// Example: Creating a task as LEADER

const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Task',
    team_id: 'team-123',
    org_id: 'org-123',
    assigned_by: 'user-id',
    assignee_id: 'team-member-id'
  })
})

// Only LEADER, ADMIN, BOD can assign tasks to team members
```

## Database RLS Policies

Row-Level Security (RLS) policies are implemented in Supabase to enforce access control at the database level:

### User Profiles
- Users can view their own profile
- Users can view other profiles in the same organization

### Attendance Logs
- Users can view their own attendance
- Leaders can view team attendance (managed via application logic)

### Tasks
- Users can view assigned tasks
- Users can view tasks they created

### Evaluations
- Users can view their own evaluations
- Evaluators can view evaluations they created

### Salaries
- Users can view their own salary
- Admin/BOD can view all salaries

### Leave Requests
- Users can view their own requests
- Managers can view team requests (managed via application logic)

## Development Workflow

### Adding a New Permission

1. Add to `Permission` type in `lib/types.ts`
2. Add to `ROLE_PERMISSIONS` in `lib/permissions.ts`
3. Use in components with `usePermission()` hook
4. Document in this file

### Adding a New Role

1. Add to `Role` type in `lib/types.ts`
2. Add to `ROLE_PERMISSIONS` in `lib/permissions.ts`
3. Add to `ROLE_HIERARCHY` in `lib/permissions.ts`
4. Add labels in `getRoleLabel()` function
5. Add colors in `getRoleColor()` and `getRoleBgColor()` functions

### Creating Role-Protected Pages

```typescript
// app/dashboard/admin/page.tsx
'use client'

import { PermissionGuard } from '@/components/permission-guard'

export default function AdminPage() {
  return (
    <PermissionGuard permission="admin.manage">
      <AdminContent />
    </PermissionGuard>
  )
}
```

## Security Considerations

1. **Frontend Only**: Permission checks in components are for UX only
2. **Backend Enforcement**: All API endpoints must validate permissions server-side
3. **RLS Policies**: Database-level access control via RLS ensures data security
4. **Session Management**: User session includes role information for fast checks
5. **Audit Logging**: All privilege-escalating actions are logged in `audit_logs` table

## Testing Access Control

### Manual Testing Steps

1. **Log in as BOD**
   - Should see all dashboards
   - Should be able to view salaries
   - Should NOT see admin panel

2. **Log in as ADMIN**
   - Should access admin panel
   - Should manage users and roles
   - Should create/modify all records

3. **Log in as LEADER**
   - Should only see team members
   - Should be able to assign tasks to team
   - Should NOT be able to manage other teams

4. **Log in as STUDENT_L1**
   - Should only see own tasks
   - Should be able to check-in/out
   - Should NOT be able to create tasks

### Testing Permission Denial
- Try accessing `/dashboard/admin` as non-admin user
- Verify 403 error when calling protected API endpoints with insufficient permissions
- Check RLS policies prevent direct database access

## Future Enhancements

1. **Custom Roles**: Allow organizations to create custom role templates
2. **Time-based Permissions**: Roles with expiration dates
3. **Conditional Access**: Multi-factor authentication for sensitive operations
4. **Delegation**: Temporary permission delegation for specific tasks
5. **Audit Dashboard**: Real-time view of all privilege changes
6. **Permission Conflicts**: Detect and warn about conflicting permissions

## Troubleshooting

### User Cannot Access Expected Module
1. Check user's primary membership role
2. Verify permission exists in `ROLE_PERMISSIONS`
3. Check component has `PermissionGuard` wrapper
4. Verify API endpoint checks permissions

### Permission Check Always Returns False
1. Verify user is authenticated (`useAppStore().user` is not null)
2. Check permission name matches exactly in types
3. Verify role name matches new role hierarchy
4. Check localStorage for cached permissions

### RLS Policy Blocking Legitimate Access
1. Check user's org_id matches data's org_id
2. Verify user has membership in that org
3. Check user_id/auth.uid() is properly set
4. Test with bypassing RLS using service role key

## Contact & Support

For questions about the RBAC system implementation, refer to:
- `lib/permissions.ts` - Core permission logic
- `hooks/use-permissions.ts` - Hook documentation
- Supabase documentation for RLS policies
