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
