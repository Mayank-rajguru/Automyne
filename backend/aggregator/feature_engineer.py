import numpy as np
import pandas as pd

def compute_feature_stats(series: pd.Series) -> dict:
    """
    Compute higher-level statistical features on daily sentiment.
    """
    s = series.dropna()

    if len(s) == 0:
        return {
            "sentiment_min": 0,
            "sentiment_max": 0,
            "sentiment_range": 0,
            "sentiment_skew": 0,
            "sentiment_kurtosis": 0,
        }

    return {
        "sentiment_min": s.min(),
        "sentiment_max": s.max(),
        "sentiment_range": s.max() - s.min(),
        "sentiment_skew": s.skew(),
        "sentiment_kurtosis": s.kurtosis(),
    }