from __future__ import annotations

from pathlib import Path
from typing import Tuple

import pandas as pd
import psycopg2
from dotenv import load_dotenv
import os

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://workforce:workforce@localhost:5433/workforce_intelligence",
)

FEATURE_QUERY = """
SELECT
    ep.id AS employee_id,
    ep.completion_score,
    GREATEST(0, EXTRACT(DAY FROM NOW() - ep.updated_at))::INT AS days_since_last_update,
    COUNT(*) FILTER (WHERE pcr.status = 'pending')::INT AS pending_change_requests_count,
    COUNT(*) FILTER (
        WHERE pcr.status = 'approved' AND pcr.reviewed_at >= NOW() - INTERVAL '30 days'
    )::INT AS approved_changes_last_30d,
    COUNT(*) FILTER (
        WHERE al.action = 'auth.login' AND al.created_at >= NOW() - INTERVAL '30 days'
    )::INT AS login_count_last_30d
FROM employee_profiles ep
LEFT JOIN profile_change_requests pcr ON pcr.employee_id = ep.id
LEFT JOIN audit_logs al ON al.actor_id = ep.user_id
GROUP BY ep.id, ep.completion_score, ep.updated_at
ORDER BY ep.id;
"""


def load_feature_frame() -> pd.DataFrame:
    with psycopg2.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            cursor.execute(FEATURE_QUERY)
            rows = cursor.fetchall()
            columns = [description[0] for description in cursor.description]

    dataframe = pd.DataFrame(rows, columns=columns)

    dataframe["target_incomplete_risk"] = (
        (dataframe["completion_score"] < 80) | (dataframe["days_since_last_update"] > 30)
    ).astype(int)
    return dataframe


def build_training_matrices() -> Tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
    dataframe = load_feature_frame()
    feature_columns = [
        "completion_score",
        "days_since_last_update",
        "pending_change_requests_count",
        "approved_changes_last_30d",
        "login_count_last_30d",
    ]
    feature_matrix = dataframe[feature_columns]
    target = dataframe["target_incomplete_risk"]
    return feature_matrix, target, dataframe
