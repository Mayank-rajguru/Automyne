import pandas as pd
import numpy as np
import logging

def generate_signals(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds advanced sentiment-based trading signals:
        - Moving average crossovers
        - Z-score signals
        - Momentum signals
        - Divergence between sentiment and price
        - Composite signal
    """

    df = df.copy()

    # Ensure numeric stability
    df["avg_sentiment"] = pd.to_numeric(df["avg_sentiment"], errors="coerce")
    df["Close"] = pd.to_numeric(df["Close"], errors="coerce")

    # ------------------------------------------
    # 1. Sentiment Moving Averages
    # ------------------------------------------
    df["sentiment_ma_fast"] = df["avg_sentiment"].rolling(3).mean()
    df["sentiment_ma_slow"] = df["avg_sentiment"].rolling(7).mean()

    df["ma_signal"] = np.where(
        df["sentiment_ma_fast"] > df["sentiment_ma_slow"], 
        "Bullish", 
        "Bearish"
    )

    # ------------------------------------------
    # 2. Z-score Signal
    # ------------------------------------------
    mean = df["avg_sentiment"].rolling(14).mean()
    std = df["avg_sentiment"].rolling(14).std().replace(0, np.nan)

    df["zscore"] = (df["avg_sentiment"] - mean) / std

    df["z_signal"] = np.where(
        df["zscore"] > 1, "Bullish",
        np.where(df["zscore"] < -1, "Bearish", "Neutral")
    )

    # ------------------------------------------
    # 3. Momentum (first derivative)
    # ------------------------------------------
    df["sentiment_mom"] = df["avg_sentiment"].diff()

    df["mom_signal"] = np.where(
        df["sentiment_mom"] > 0, "Bullish",
        np.where(df["sentiment_mom"] < 0, "Bearish", "Neutral")
    )

    # ------------------------------------------
    # 4. Divergence: sentiment ↑ + price ↓  (bullish)
    #                   sentiment ↓ + price ↑  (bearish)
    # ------------------------------------------
    df["price_mom"] = df["Close"].pct_change()

    conditions = [
        (df["sentiment_mom"] > 0) & (df["price_mom"] < 0),
        (df["sentiment_mom"] < 0) & (df["price_mom"] > 0),
    ]
    choices = ["Bullish Divergence", "Bearish Divergence"]

    df["divergence_signal"] = np.select(conditions, choices, default="None")

    # ------------------------------------------
    # 5. Composite Signal
    # Weighted voting of all signals 
    # ------------------------------------------
    df["bullish_votes"] = (
        (df["ma_signal"] == "Bullish").astype(int) +
        (df["z_signal"] == "Bullish").astype(int) +
        (df["mom_signal"] == "Bullish").astype(int) +
        (df["divergence_signal"] == "Bullish Divergence").astype(int)
    )

    df["bearish_votes"] = (
        (df["ma_signal"] == "Bearish").astype(int) +
        (df["z_signal"] == "Bearish").astype(int) +
        (df["mom_signal"] == "Bearish").astype(int) +
        (df["divergence_signal"] == "Bearish Divergence").astype(int)
    )

    df["final_signal"] = df.apply(_final_signal, axis=1)
    df["signal"] = df["final_signal"]

    logging.info("Signal generation complete.")

    return df


def _final_signal(row):
    if row["bullish_votes"] > row["bearish_votes"]:
        return "Bullish"
    elif row["bearish_votes"] > row["bullish_votes"]:
        return "Bearish"
    else:
        return "Neutral"