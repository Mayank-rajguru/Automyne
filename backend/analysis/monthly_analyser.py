import pandas as pd

def monthly_analysis(path):
    df = pd.read_csv(path)

    df["Date"] = pd.to_datetime(df["Date"])
    
    monthly = df.resample("M", on="Date").agg({
        "avg_sentiment": "mean",
        "sentiment_ma": "mean",
        "Close": "last",
        "num_posts": "sum"
    }).reset_index()

    monthly["monthly_return"] = monthly["Close"].pct_change()

    print("\n=== Monthly Sentiment vs Price Return ===")
    print(monthly)

    corr = monthly[["avg_sentiment", "sentiment_ma", "monthly_return"]].corr()
    print("\n=== Monthly Correlation Result ===")
    print(corr)

    return monthly, corr


def evaluate_prediction(monthly_df, lag=1):
    monthly_df["future_return"] = monthly_df["monthly_return"].shift(-lag)

    lag_corr = monthly_df[["avg_sentiment", "sentiment_ma", "future_return"]].corr()
    print(f"\n=== Sentiment → Next {lag}-Month Return ===")
    print(lag_corr)

    return lag_corr
