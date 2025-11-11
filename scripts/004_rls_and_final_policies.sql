-- File: 004_rls_and_final_policies.sql

-- 1. KÍCH HOẠT RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY; -- Mặc dù chỉ là SELECT, nên bật

-- 2. CHÍNH SÁCH CỐT LÕI

-- USER PROFILES (Xem/Sửa hồ sơ cá nhân và Team)
CREATE POLICY "user_profiles_view_self_team" ON user_profiles FOR SELECT 
USING (id = auth.uid() OR manager_id = auth.uid());
CREATE POLICY "user_profiles_update_self" ON user_profiles FOR UPDATE 
USING (id = auth.uid());


-- ATTENDANCE (LEADER/TEAM)
CREATE POLICY "attendance_manage_self" ON attendance_logs FOR ALL 
USING (user_id = auth.uid());
CREATE POLICY "attendance_view_team" ON attendance_logs FOR SELECT 
USING (
    user_id IN (SELECT id FROM user_profiles WHERE manager_id = auth.uid())
);


-- LEAVE REQUESTS (LEADER/TEAM APPROVAL)
CREATE POLICY "leaves_manage_self" ON leave_requests FOR ALL 
USING (user_id = auth.uid());
CREATE POLICY "leaves_manage_team" ON leave_requests FOR ALL 
USING (
    user_id IN (SELECT id FROM user_profiles WHERE manager_id = auth.uid())
);

-- SALARIES (CHỈ ADMIN/BOD)
CREATE POLICY "salaries_restrict_access" ON salaries FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN roles r ON up.role_id = r.id
        WHERE up.id = auth.uid() AND r.role_key IN ('admin', 'bod')
    )
);

-- ROLES (Cho phép mọi người xem danh sách Roles để Frontend hoạt động)
CREATE POLICY "roles_read_all" ON roles FOR SELECT 
TO anon, authenticated USING (TRUE);