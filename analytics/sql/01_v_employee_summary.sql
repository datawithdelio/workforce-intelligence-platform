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
