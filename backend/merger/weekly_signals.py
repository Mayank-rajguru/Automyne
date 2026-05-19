import numpy as np
import pandas as pd

def generate_weekly_signals(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Sentiment trend
    df["sentiment_trend"] = np.where(df["weekly_sentiment_mom"] > 0, "Up",
                               np.where(df["weekly_sentiment_mom"] < 0, "Down", "Flat"))

    # Z-score based extremes
    df["z_signal"] = np.where(df["weekly_zscore"] > 1, "Extreme Bullish",
                        np.where(df["weekly_zscore"] < -1, "Extreme Bearish", "Neutral"))

    # Divergence decision
    df["div_signal"] = np.where(df["Bullish Divergence"] > df["Bearish Divergence"],
                            "Bullish Divergence",
                            np.where(df["Bearish Divergence"] > df["Bullish Divergence"],
                                    "Bearish Divergence", "None"))

    # Final signal combining 3 indicators
    df["weekly_signal"] = df.apply(_combine_weekly_signals, axis=1)

    return df


def _combine_weekly_signals(row):
    votes = {
        "Bullish": 0,
        "Bearish": 0
    }

    # Momentum trend
    if row["sentiment_trend"] == "Up":
        votes["Bullish"] += 1
    elif row["sentiment_trend"] == "Down":
        votes["Bearish"] += 1

    # Z-score
    if row["z_signal"] == "Extreme Bullish":
        votes["Bullish"] += 1
    elif row["z_signal"] == "Extreme Bearish":
        votes["Bearish"] += 1

    # Divergence
    if row["div_signal"] == "Bullish Divergence":
        votes["Bullish"] += 1
    elif row["div_signal"] == "Bearish Divergence":
        votes["Bearish"] += 1

    # Winner
    if votes["Bullish"] > votes["Bearish"]:
        return "Bullish"
    elif votes["Bearish"] > votes["Bullish"]:
        return "Bearish"
    else:
        return "Neutral"