import pandas as pd
import numpy as np

def aggregate_daily(df: pd.DataFrame) -> pd.DataFrame:

    df = df.copy()
    df["date"] = df["Created"].dt.date.astype(str)

    groups = df.groupby("date", sort=True)

    # -----------------------------------------
    # PRIMARY AGGREGATION
    # -----------------------------------------
    daily = groups.agg(
        num_posts=("sentiment_score", "count"),
        avg_sentiment=("sentiment_score", "mean"),
        median_sentiment=("sentiment_score", "median"),
        sentiment_std=("sentiment_score", lambda s: s.std() if len(s) > 1 else 0),
        magnitude_mean=("magnitude", "mean"),
        magnitude_std=("magnitude", lambda s: s.std() if len(s) > 1 else 0),
        p_negative_mean=("p_negative", "mean"),
        p_neutral_mean=("p_neutral", "mean"),
        p_positive_mean=("p_positive", "mean")
    ).reset_index()

    # -----------------------------------------
    # LABEL COUNTS
    # -----------------------------------------
    label_counts = (
        df.groupby(["date", "sentiment_label"])
          .size()
          .unstack(fill_value=0)
    )

    # Ensure missing columns exist
    for lbl in ["positive", "negative", "neutral"]:
        if lbl not in label_counts.columns:
            label_counts[lbl] = 0

    label_counts = label_counts[["positive", "negative", "neutral"]]
    label_counts.columns = ["positive_count", "negative_count", "neutral_count"]

    daily = daily.merge(label_counts, on="date", how="left")

    # -----------------------------------------
    # RATIOS
    # -----------------------------------------
    daily["pos_ratio"] = daily["positive_count"] / daily["num_posts"]
    daily["neg_ratio"] = daily["negative_count"] / daily["num_posts"]
    daily["neu_ratio"] = daily["neutral_count"] / daily["num_posts"]

    # -----------------------------------------
    # FEATURE STATS
    # -----------------------------------------
    stats = groups["sentiment_score"].agg(
    sentiment_min="min",
    sentiment_max="max",
    sentiment_range=lambda s: s.max() - s.min(),
    sentiment_skew=lambda s: s.skew(skipna=True),
    sentiment_kurtosis=lambda s: s.kurtosis(skipna=True),
)

    daily = daily.merge(stats, on="date", how="left")

    # -----------------------------------------
    # CLEAN TYPES
    # -----------------------------------------
    daily["date"] = daily["date"].astype(str)
    daily = daily.sort_values("date").reset_index(drop=True)

    return daily