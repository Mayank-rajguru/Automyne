import pandas as pd
import numpy as np


def aggregate_weekly(df: pd.DataFrame) -> pd.DataFrame:
    """
    Weekly sentiment + price aggregation.
    df must contain:
    - Date (datetime)
    - Close (price)
    - avg_sentiment
    - median_sentiment
    - sentiment_std
    - magnitude_mean, magnitude_std
    - pos_ratio, neg_ratio, neu_ratio
    - sentiment_min, sentiment_max, sentiment_range, sentiment_skew, sentiment_kurtosis
    - num_posts
    - divergence_signal
    """

    df = df.copy()
    df["Date"] = pd.to_datetime(df["Date"])

    # -----------------------------------------
    # 1. WEEKLY AGGREGATIONS
    # -----------------------------------------
    weekly = df.resample("W", on="Date").agg({
        "Close": "last",                        # Weekly close price
        "avg_sentiment": "mean",
        "median_sentiment": "median",
        "sentiment_std": "mean",
        "magnitude_mean": "mean",
        "magnitude_std": "mean",
        "pos_ratio": "mean",
        "neg_ratio": "mean",
        "neu_ratio": "mean",
        "sentiment_min": "min",
        "sentiment_max": "max",
        "sentiment_range": "mean",
        "sentiment_skew": "mean",
        "sentiment_kurtosis": "mean",
        "num_posts": "sum",
    })

    # -----------------------------------------
    # 2. WEEKLY MOMENTUM (sentiment)
    # -----------------------------------------
    weekly["weekly_sentiment_mom"] = weekly["avg_sentiment"].diff()

    # -----------------------------------------
    # 3. WEEKLY Z-SCORE (4-week rolling)
    # -----------------------------------------
    roll_mean = weekly["avg_sentiment"].rolling(4).mean()
    roll_std  = weekly["avg_sentiment"].rolling(4).std().replace(0, np.nan)

    weekly["weekly_zscore"] = (weekly["avg_sentiment"] - roll_mean) / roll_std

    # -----------------------------------------
    # 4. WEEKLY DIVERGENCE COUNTS
    # -----------------------------------------
    div_counts = df.groupby(pd.Grouper(key="Date", freq="W"))["divergence_signal"].value_counts().unstack(fill_value=0)

    # Ensure presence of all divergence categories
    for key in ["Bullish Divergence", "Bearish Divergence", "None"]:
        if key not in div_counts.columns:
            div_counts[key] = 0

    div_counts = div_counts[["Bearish Divergence", "Bullish Divergence", "None"]]

    weekly = weekly.merge(div_counts, left_index=True, right_index=True)

    # -----------------------------------------
    # 5. TARGET: NEXT WEEK RETURN (CORRECT METHOD)
    # -----------------------------------------
    weekly["next_week_close"] = weekly["Close"].shift(-1)
    weekly["next_week_return"] = (weekly["next_week_close"] - weekly["Close"]) / weekly["Close"]
    weekly["target"] = (weekly["next_week_return"] > 0).astype(int)

    # -----------------------------------------
    # 6. Additional signals (optional, keeps your system working)
    # -----------------------------------------
    weekly["sentiment_trend"] = np.where(weekly["weekly_sentiment_mom"] > 0, "Up",
                                 np.where(weekly["weekly_sentiment_mom"] < 0, "Down", "Flat"))

    weekly["z_signal"] = np.where(weekly["weekly_zscore"] > 1, "Extreme Bullish",
                          np.where(weekly["weekly_zscore"] < -1, "Extreme Bearish", "Neutral"))

    weekly["div_signal"] = np.where(weekly["Bullish Divergence"] > weekly["Bearish Divergence"], "Bullish Divergence",
                            np.where(weekly["Bearish Divergence"] > weekly["Bullish Divergence"], "Bearish Divergence",
                                     "None"))

    # Composite weekly signal
    def weekly_sig(row):
        score = 0
        if row["weekly_sentiment_mom"] > 0: score += 1
        if row["weekly_zscore"] > 1: score += 1
        if row["Bullish Divergence"] > row["Bearish Divergence"]: score += 1
        if row["weekly_sentiment_mom"] < 0: score -= 1
        if row["weekly_zscore"] < -1: score -= 1
        if row["Bearish Divergence"] > row["Bullish Divergence"]: score -= 1

        if score > 0: return "Bullish"
        if score < 0: return "Bearish"
        return "Neutral"

    weekly["weekly_signal"] = weekly.apply(weekly_sig, axis=1)

    return weekly.reset_index()