# backend/analysis/correlation_analyser.py
import pandas as pd

def compute_correlation(path):
    # path can be a Path object or string
    df = pd.read_csv(str(path))

    # Ensure numeric
    df["Close"] = pd.to_numeric(df["Close"], errors="coerce")
    df["avg_sentiment"] = pd.to_numeric(df["avg_sentiment"], errors="coerce")
    df["sentiment_ma"] = pd.to_numeric(df["sentiment_ma"], errors="coerce")

    # Price return vs sentiment change
    df["price_change"] = df["Close"].pct_change()
    df["sentiment_change"] = df["avg_sentiment"].diff()

    correlation_matrix = df[["price_change", "avg_sentiment", "sentiment_ma", "sentiment_change"]].corr()

    print("\n=== Correlation Report ===")
    print(correlation_matrix)

    return df, correlation_matrix


def lag_correlation(df, lag_days=1):
    df = df.copy()
    df["future_price"] = df["Close"].shift(-lag_days)
    df["future_return"] = df["future_price"].pct_change(fill_method=None)

    lag_corr = df[["avg_sentiment", "sentiment_ma", "future_return"]].corr()
    print(f"\n=== Lag-{lag_days} Day Predictive Correlation ===")
    print(lag_corr)

    return lag_corr

