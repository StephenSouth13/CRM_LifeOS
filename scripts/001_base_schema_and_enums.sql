-- File: 001_base_schema_and_enums.sql

-- Kích hoạt extension pgcrypto (Cần thiết cho hashing mật khẩu)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. ENUMS (Các kiểu dữ liệu trạng thái tùy chỉnh)
CREATE TYPE public.account_status_enum AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'blocked');
CREATE TYPE public.leave_type_enum AS ENUM ('sick', 'annual', 'personal', 'unpaid', 'other');
CREATE TYPE public.leave_request_status_enum AS ENUM ('pending', 'approved', 'rejected');

-- 2. BẢNG ORGANIZATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG ROLES (11 Cấp độ)
CREATE TABLE IF NOT EXISTS public.roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Khóa chính BIGINT
    role_key VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(100) NOT NULL,
    role_level INTEGER NOT NULL,
    description TEXT
);

-- 4. BẢNG USER PROFILES (FIX: Liên kết trực tiếp Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Khóa chính = Khóa ngoại tới auth.users
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    manager_id UUID REFERENCES public.user_profiles(id),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES public.roles(id), 
    account_status public.account_status_enum DEFAULT 'PENDING_APPROVAL' NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG MEMBERSHIPS (Liên kết User-Role-Org)
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES public.roles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, org_id)
);