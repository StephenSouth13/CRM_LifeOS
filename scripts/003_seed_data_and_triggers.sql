-- File: 003_seed_data_and_triggers.sql

-- 1. SEEDING DỮ LIỆU CƠ BẢN

-- Chèn 11 Roles (BẮT BUỘC)
INSERT INTO public.roles (role_key, role_name, role_level, description) VALUES
('bod', 'Ban Điều Hành', 11, 'Quyền giám sát tối cao'),
('admin', 'Quản trị viên Hệ thống', 10, 'Quản lý kỹ thuật toàn hệ thống'),
('leader', 'Trưởng nhóm/Dự án', 9, 'Quản lý trực tiếp Team'),
('mentor_coach', 'Giảng viên/Chuyên gia', 7, 'Đánh giá chất lượng công việc'),
('student_l3', 'Sinh viên Level 3', 8, 'Cấp độ Thực chiến'),
('student_l2', 'Sinh viên Level 2', 6, 'Thực thi công việc'),
('employee', 'Nhân sự Dự án', 5, 'Nhân sự chính thức'),
('collaborator', 'Cộng tác viên', 5, 'Tương đương Employee'),
('student_l1', 'Sinh viên Level 1', 4, 'Cấp độ làm quen'),
('customer_stakeholder', 'Khách hàng/Cổ đông', 3, 'Quyền đọc tối thiểu'),
('pending_approval', 'Chờ Phê Duyệt', 1, 'Không có quyền truy cập')
ON CONFLICT (role_key) DO NOTHING;

-- Tạo Tổ chức mẫu & Project mẫu
INSERT INTO public.organizations (name)
VALUES ('MSC Center')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.projects (project_name, project_code, allowed_latitude, allowed_longitude, allowed_radius_meters)
VALUES ('HCM Office', 'HCM-OFFICE', 10.772500, 106.697500, 50) -- Tọa độ mẫu cho Geolocation
ON CONFLICT (project_name) DO NOTHING;

-- 2. HÀM VÀ TRIGGER: Tự động tạo Profile PENDING (Manual Vetting Workflow)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    pending_role_id BIGINT;
    org_id_val UUID;
BEGIN
    SELECT id INTO pending_role_id FROM public.roles WHERE role_key = 'pending_approval';
    SELECT id INTO org_id_val FROM public.organizations WHERE name = 'MSC Center' LIMIT 1;

    -- 1. Insert vào bảng user_profiles
    INSERT INTO public.user_profiles (id, email, name, org_id, role_id, account_status)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'name',
        org_id_val, 
        pending_role_id, 
        'PENDING_APPROVAL' 
    );
    
    -- 2. Insert vào bảng memberships
    INSERT INTO public.memberships (user_id, org_id, role_id)
    VALUES (NEW.id, org_id_val, pending_role_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


-- 3. HÀM VÀ TRIGGER: Tự động tính Total Hours (Attendance)
CREATE OR REPLACE FUNCTION public.calculate_total_hours_log()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_in_time IS NOT NULL AND NEW.check_out_time IS NOT NULL THEN
        NEW.total_hours = ROUND(
            EXTRACT(EPOCH FROM (NEW.check_out_time - NEW.check_in_time)) / 3600, 2
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER attendance_calc_trigger
BEFORE INSERT OR UPDATE OF check_in_time, check_out_time ON public.attendance_logs
FOR EACH ROW EXECUTE FUNCTION public.calculate_total_hours_log();