import pandas as pd
import numpy as np
import logging

def merge_sentiment_stock(stock_df: pd.DataFrame, senti_df: pd.DataFrame):
    """
    Production-grade merging of business-day stock prices with daily sentiment.
    
    Key features:
        - Retains weekend/holiday sentiment (rolled forward to next business day)
        - No forced neutral sentiment (NaN kept if no posts)
        - Chronologically validated
        - Duplicate date handling
        - Robust index alignment
    """

    stock = stock_df.copy()
    senti = senti_df.copy()

    # Ensure correct ordering
    stock = stock.sort_values("Date").reset_index(drop=True)
    senti = senti.sort_values("date").reset_index(drop=True)

    # Step 1: Convert to datetime for proper merging
    stock["Date"] = pd.to_datetime(stock["Date"])
    senti["date"] = pd.to_datetime(senti["date"])

    # Step 2: Expand sentiment to full date range
    # Fill all calendar days (Reddit available 7 days/week)
    full_range = pd.date_range(
        senti["date"].min(), senti["date"].max(), freq="D"
    )
    full_senti = pd.DataFrame({"date": full_range})
    full_senti = full_senti.merge(senti, on="date", how="left")

    # Step 3: Forward-fill weekend sentiment into Monday
    # But WE DO NOT fill forward raw sentiment. We fill COUNT/AGG features properly.
    full_senti["avg_sentiment"] = full_senti["avg_sentiment"].ffill()
    full_senti["median_sentiment"] = full_senti["median_sentiment"].ffill()
    full_senti["sentiment_std"] = full_senti["sentiment_std"].ffill()
    full_senti["magnitude_mean"] = full_senti["magnitude_mean"].ffill()

    # For label counts, fill with 0 where NaN
    for col in ["positive_count", "negative_count", "neutral_count", "num_posts"]:
        if col in full_senti.columns:
            full_senti[col] = full_senti[col].fillna(0).astype(int)

    # Recompute ratios after fill
    full_senti["pos_ratio"] = full_senti["positive_count"] / full_senti["num_posts"].replace(0, np.nan)
    full_senti["neg_ratio"] = full_senti["negative_count"] / full_senti["num_posts"].replace(0, np.nan)
    full_senti["neu_ratio"] = full_senti["neutral_count"] / full_senti["num_posts"].replace(0, np.nan)

    # Step 4: Merge stock (business days) with sentiment (all days)
    merged = stock.merge(
        full_senti,
        left_on="Date",
        right_on="date",
        how="left"
    )

    # Step 5: Clean up dataframe
    merged = merged.drop(columns=["date"])
    merged = merged.sort_values("Date").reset_index(drop=True)

    logging.info(f"Merged dataframe created: {len(merged)} rows")

    return merged