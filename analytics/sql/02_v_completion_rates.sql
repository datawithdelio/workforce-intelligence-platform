CREATE OR REPLACE VIEW v_completion_rates AS
SELECT
  department,
  AVG(completion_score)::REAL AS avg_completion_score
FROM employee_profiles
GROUP BY department;
