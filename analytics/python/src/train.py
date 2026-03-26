from __future__ import annotations

from pathlib import Path
import pickle

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split

from features import build_training_matrices

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "models" / "completion_risk.pkl"


def main() -> None:
    features, target, _ = build_training_matrices()
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.3, random_state=42, stratify=target
    )

    model = RandomForestClassifier(
        n_estimators=50,
        max_depth=4,
        random_state=42,
    )
    model.fit(x_train, y_train)

    predictions = model.predict(x_test)
    print(classification_report(y_test, predictions, zero_division=0))

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with MODEL_PATH.open("wb") as model_file:
      pickle.dump(model, model_file)

    print(f"Model saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()
