CREATE OR REPLACE VIEW v_approval_metrics AS
SELECT
  ep.department,
  AVG(EXTRACT(EPOCH FROM (pcr.reviewed_at - pcr.requested_at)) / 86400)::REAL AS avg_approval_days
FROM profile_change_requests pcr
JOIN employee_profiles ep ON ep.id = pcr.employee_id
WHERE pcr.reviewed_at IS NOT NULL
GROUP BY ep.department;
