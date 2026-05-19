import pandas as pd
import numpy as np
import logging
from pandas.tseries.holiday import USFederalHolidayCalendar
from pandas.tseries.offsets import CustomBusinessDay

# NYSE business day calendar
nyse_bd = CustomBusinessDay(calendar=USFederalHolidayCalendar())

def align_to_business_days(df):
    """
    Ensures the stock dataframe covers all business days 
    from min(date) to max(date). Missing days are forward-filled.
    """

    df = df.copy()

    # Build business-day index from min to max
    start = df["Date"].min()
    end = df["Date"].max()

    idx = pd.date_range(start, end, freq=nyse_bd)
    idx = idx.astype(str)

    aligned = pd.DataFrame({"Date": idx})
    merged = aligned.merge(df, on="Date", how="left")

    # Forward-fill closing prices
    merged["Close"] = merged["Close"].ffill()

    # If first values are NaN, fill with nearest non-NaN
    merged["Close"] = merged["Close"].bfill()

    logging.info(f"[ALIGN] Stock aligned to {len(merged)} business days.")

    return merged