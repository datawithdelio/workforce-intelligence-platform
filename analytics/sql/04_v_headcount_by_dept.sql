CREATE OR REPLACE VIEW v_headcount_by_dept AS
SELECT
  department,
  COUNT(*)::INTEGER AS headcount
FROM employee_profiles
WHERE is_active = TRUE
GROUP BY department;
