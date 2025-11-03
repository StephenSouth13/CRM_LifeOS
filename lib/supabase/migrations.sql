-- ===== ORGANIZATIONS =====
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo TEXT,
  website VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== TEAMS =====
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID,
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, name)
);

-- ===== USER PROFILES =====
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  manager_id UUID REFERENCES user_profiles(id),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== MEMBERSHIPS =====
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL,
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, org_id)
);

-- ===== ATTENDANCE LOGS =====
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  check_in_lat FLOAT,
  check_in_lon FLOAT,
  check_out_lat FLOAT,
  check_out_lon FLOAT,
  check_in_wifi_ssid VARCHAR(255),
  check_out_wifi_ssid VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  verified_by UUID REFERENCES user_profiles(id),
  verified_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== TASKS =====
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(50) DEFAULT 'medium',
  assignee_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  assigned_by UUID NOT NULL REFERENCES user_profiles(id),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  due_date DATE,
  completed_date TIMESTAMP,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== EVALUATIONS =====
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluator_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  evaluatee_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  technical_skills INT,
  soft_skills INT,
  knowledge INT,
  attitude INT,
  overall_score INT,
  comments TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMP,
  impact_on_promotion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== SALARIES =====
CREATE TABLE IF NOT EXISTS salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  base_salary DECIMAL(12, 2) NOT NULL,
  bonus DECIMAL(12, 2),
  deductions DECIMAL(12, 2),
  total_salary DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'VND',
  payment_method VARCHAR(100),
  effective_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMP,
  paid_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== LEAVE REQUESTS =====
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INT NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== ROOMS =====
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(255),
  floor VARCHAR(50),
  amenities TEXT[],
  equipment TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, name)
);

-- ===== ROOM BOOKINGS =====
CREATE TABLE IF NOT EXISTS room_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  attendees UUID[] NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  meeting_link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== CALENDAR EVENTS =====
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location VARCHAR(255),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  attendees UUID[] NOT NULL,
  type VARCHAR(50) NOT NULL,
  color VARCHAR(50),
  is_all_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== NOTES =====
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  visibility VARCHAR(50) DEFAULT 'private',
  pinned BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== AUDIT LOGS =====
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_org_id ON memberships(org_id);
CREATE INDEX idx_memberships_team_id ON memberships(team_id);
CREATE INDEX idx_attendance_logs_user_id ON attendance_logs(user_id);
CREATE INDEX idx_attendance_logs_org_id ON attendance_logs(org_id);
CREATE INDEX idx_attendance_logs_check_in_time ON attendance_logs(check_in_time);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_team_id ON tasks(team_id);
CREATE INDEX idx_evaluations_evaluator_id ON evaluations(evaluator_id);
CREATE INDEX idx_evaluations_evaluatee_id ON evaluations(evaluatee_id);
CREATE INDEX idx_salaries_user_id ON salaries(user_id);
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_calendar_events_creator_id ON calendar_events(creator_id);
CREATE INDEX idx_notes_author_id ON notes(author_id);

-- ===== ROW LEVEL SECURITY (RLS) POLICIES =====

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles - Users can view their own profile and team members
CREATE POLICY "user_profiles_view_self" ON user_profiles
  FOR SELECT USING (auth.uid()::TEXT = id::TEXT);

CREATE POLICY "user_profiles_view_org" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()::UUID
      AND memberships.org_id = user_profiles.org_id
    )
  );

-- Attendance - Users can view their own, leaders can view team
CREATE POLICY "attendance_view_self" ON attendance_logs
  FOR SELECT USING (user_id = auth.uid()::UUID);

-- Tasks - Users can view assigned tasks and own tasks
CREATE POLICY "tasks_view_assigned" ON tasks
  FOR SELECT USING (
    assignee_id = auth.uid()::UUID OR assigned_by = auth.uid()::UUID
  );

-- Evaluations - Users can view their own evaluations
CREATE POLICY "evaluations_view_self" ON evaluations
  FOR SELECT USING (
    evaluatee_id = auth.uid()::UUID OR evaluator_id = auth.uid()::UUID
  );

-- Salaries - Users can view their own salary
CREATE POLICY "salaries_view_self" ON salaries
  FOR SELECT USING (user_id = auth.uid()::UUID);

-- Leave Requests - Users can view their own requests
CREATE POLICY "leave_requests_view_self" ON leave_requests
  FOR SELECT USING (user_id = auth.uid()::UUID);

-- Calendar Events - Users can view org events
CREATE POLICY "calendar_events_view" ON calendar_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()::UUID
      AND memberships.org_id = calendar_events.org_id
    )
  );

-- Notes - Users can view own and team notes based on visibility
CREATE POLICY "notes_view_own" ON notes
  FOR SELECT USING (author_id = auth.uid()::UUID);

CREATE POLICY "notes_view_team" ON notes
  FOR SELECT USING (
    visibility IN ('team', 'org') AND
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()::UUID
      AND memberships.org_id = notes.org_id
    )
  );

-- Audit Logs - Users can only view their own org's audit logs
CREATE POLICY "audit_logs_view" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()::UUID
      AND memberships.org_id = audit_logs.org_id
    )
  );
