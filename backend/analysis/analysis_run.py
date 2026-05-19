
from pathlib import Path

from .correlation_analyser import compute_correlation, lag_correlation
from .insight_report import generate_insight
from .monthly_analyser import monthly_analysis, evaluate_prediction
from .prediction_score import evaluate_accuracy


TICKERS = ["GME", "AMC", "NOK", "BB", "PLTR", "AAL", "SPY", "QQQ", "SLV"]

BASE_DIR = Path(__file__).resolve().parents[1]
OUTPUT_DIR = BASE_DIR / "output"


def main():
    print("BASE_DIR:", BASE_DIR)
    print("OUTPUT_DIR:", OUTPUT_DIR)

    for ticker in TICKERS:
        csv_path = OUTPUT_DIR / f"{ticker.lower()}_merged.csv"
        print(f"\n=== Running correlation for {ticker} ===")
        print("Looking for:", csv_path)

        if not csv_path.exists():
            print(f"Skipping {ticker}: file not found.")
            continue

        # Daily
        df, corr = compute_correlation(csv_path)
        lag1 = lag_correlation(df, lag_days=1)
        generate_insight(corr, lag1, ticker)

        # monthly
        print(f"\n=== Running Monthly Trend Analysis for {ticker} ===")
        monthly_df, monthly_corr = monthly_analysis(csv_path)

        # 1-month ahead - indicates lag
        evaluate_prediction(monthly_df, lag=1)
        acc = evaluate_accuracy(monthly_df)
        print(f"➡ Prediction Accuracy: {acc}%")


if __name__ == "__main__":
    main()
