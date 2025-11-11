-- File: 002_create_modules_and_fks.sql

-- 1. BẢNG PROJECTS (Geolocation Setup)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL UNIQUE,
    project_code VARCHAR(50) UNIQUE,
    leader_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    allowed_latitude NUMERIC(10, 8),   
    allowed_longitude NUMERIC(11, 8),  
    allowed_radius_meters INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG ATTENDANCE LOGS (FIX: Bổ sung Geolocation & Total_Hours)
CREATE TABLE IF NOT EXISTS public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id),
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    total_hours NUMERIC(5, 2), -- Cho Trigger tính toán
    check_in_lat FLOAT,
    check_in_lon FLOAT,
    is_location_valid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG TASKS (Công việc)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id),
    title VARCHAR(255) NOT NULL,
    status public.task_status DEFAULT 'todo',
    priority public.task_priority DEFAULT 'medium',
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assigned_by UUID NOT NULL REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG EVALUATIONS (Đánh giá ASK)
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluator_id UUID NOT NULL REFERENCES public.user_profiles(id),
    evaluatee_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    evaluation_date DATE NOT NULL,
    attitude_score INTEGER NOT NULL,
    skill_score INTEGER NOT NULL,
    knowledge_score INTEGER NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG SALARIES (Lương thưởng)
CREATE TABLE IF NOT EXISTS public.salaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    base_salary DECIMAL(12, 2) NOT NULL,
    bonus DECIMAL(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG LEAVE REQUESTS (Nghỉ phép)
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    type public.leave_type_enum NOT NULL,
    status public.leave_request_status_enum DEFAULT 'pending',
    approved_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);