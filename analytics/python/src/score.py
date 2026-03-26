from __future__ import annotations

from pathlib import Path
import os
import pickle

import psycopg2
from dotenv import load_dotenv

from features import build_training_matrices

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT.parents[1] / ".env")
MODEL_PATH = ROOT / "models" / "completion_risk.pkl"
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://workforce:workforce@localhost:5433/workforce_intelligence",
)


def classify_risk(score: float) -> str:
    if score >= 0.66:
        return "high"
    if score >= 0.33:
        return "medium"
    return "low"


def build_explanation(row) -> str:
    reasons = []
    if row["days_since_last_update"] > 30:
        reasons.append(f"profile not updated in {int(row['days_since_last_update'])} days")
    if row["completion_score"] < 80:
        reasons.append(f"profile completion is {row['completion_score']:.0f}%")
    if row["login_count_last_30d"] < 3:
        reasons.append("low login activity in the last 30 days")

    if not reasons:
        return "Profile is being maintained consistently."

    return " and ".join(reasons).capitalize() + "."


def main() -> None:
    with MODEL_PATH.open("rb") as model_file:
        model = pickle.load(model_file)

    features, _target, dataframe = build_training_matrices()
    probabilities = model.predict_proba(features)[:, 1]
    dataframe["score"] = probabilities
    dataframe["risk_level"] = dataframe["score"].apply(classify_risk)
    dataframe["explanation"] = dataframe.apply(build_explanation, axis=1)

    with psycopg2.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM engagement_scores;")
            for _, row in dataframe.iterrows():
                cursor.execute(
                    """
                    INSERT INTO engagement_scores (employee_id, score, risk_level, explanation)
                    VALUES (%s, %s, %s, %s);
                    """,
                    (
                        int(row["employee_id"]),
                        float(row["score"]),
                        row["risk_level"],
                        row["explanation"],
                    ),
                )
        connection.commit()

    output_path = ROOT / "data" / "predictions" / "completion_risk_scores.csv"
    dataframe.to_csv(output_path, index=False)
    print(f"Scores written to DB and {output_path}")


if __name__ == "__main__":
    main()
