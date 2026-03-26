CREATE OR REPLACE VIEW v_employee_summary AS
SELECT
  u.id AS user_id,
  ep.id AS employee_id,
  u.email,
  u.role,
  ep.first_name,
  ep.last_name,
  ep.job_title,
  ep.department,
  ep.completion_score,
  ep.is_active,
  d.manager_id
FROM users u
JOIN employee_profiles ep ON ep.user_id = u.id
LEFT JOIN departments d ON d.name = ep.department;

CREATE OR REPLACE VIEW v_completion_rates AS
SELECT
  department,
  AVG(completion_score)::REAL AS avg_completion_score
FROM employee_profiles
GROUP BY department;

CREATE OR REPLACE VIEW v_approval_metrics AS
SELECT
  ep.department,
  AVG(EXTRACT(EPOCH FROM (pcr.reviewed_at - pcr.requested_at)) / 86400)::REAL AS avg_approval_days
FROM profile_change_requests pcr
JOIN employee_profiles ep ON ep.id = pcr.employee_id
WHERE pcr.reviewed_at IS NOT NULL
GROUP BY ep.department;

CREATE OR REPLACE VIEW v_headcount_by_dept AS
SELECT
  department,
  COUNT(*)::INTEGER AS headcount
FROM employee_profiles
WHERE is_active = TRUE
GROUP BY department;

CREATE OR REPLACE VIEW v_recent_activity AS
SELECT
  al.id AS audit_id,
  al.actor_id,
  COALESCE(ep.first_name || ' ' || ep.last_name, u.email) AS actor_name,
  al.action,
  al.entity_type,
  al.entity_id,
  al.created_at
FROM audit_logs al
LEFT JOIN users u ON u.id = al.actor_id
LEFT JOIN employee_profiles ep ON ep.user_id = u.id
WHERE al.created_at >= NOW() - INTERVAL '30 days'
ORDER BY al.created_at DESC;
