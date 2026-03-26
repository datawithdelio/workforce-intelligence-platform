from __future__ import annotations

from pathlib import Path

from score import main as score_main
from train import main as train_main

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "models" / "completion_risk.pkl"


def main() -> None:
    if not MODEL_PATH.exists():
        print("No trained model found. Training a new model first.")
        train_main()

    score_main()
    print("Pipeline complete.")


if __name__ == "__main__":
    main()
