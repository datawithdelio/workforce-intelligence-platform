CREATE TYPE user_role AS ENUM ('employee', 'manager', 'admin');
CREATE TYPE change_request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE engagement_risk_level AS ENUM ('low', 'medium', 'high');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE employee_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  job_title VARCHAR(150) NOT NULL,
  department VARCHAR(100) NOT NULL,
  hire_date DATE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  bio TEXT,
  avatar_url TEXT,
  completion_score REAL NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE profile_change_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  status change_request_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE kpi_snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  total_employees INTEGER NOT NULL,
  active_employees INTEGER NOT NULL,
  avg_completion_score REAL NOT NULL,
  pending_approvals INTEGER NOT NULL,
  avg_approval_days REAL NOT NULL,
  department_headcount JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE engagement_scores (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employee_profiles(id) ON DELETE CASCADE,
  score REAL NOT NULL,
  risk_level engagement_risk_level NOT NULL,
  explanation TEXT NOT NULL,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
