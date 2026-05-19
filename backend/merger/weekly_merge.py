import pandas as pd

def merge_weekly(stock_df: pd.DataFrame, weekly_sent: pd.DataFrame):
    """
    Merges weekly sentiment with weekly stock prices.
    Uses the last close of each week for stock price.
    """

    stock_df["Date"] = pd.to_datetime(stock_df["Date"])
    weekly_sent["Date"] = pd.to_datetime(weekly_sent["Date"])

    # weekly OHLC → last close represents weekly close
    stock_weekly = stock_df.resample("W", on="Date").last().reset_index()

    merged = stock_weekly.merge(weekly_sent, on="Date", how="left")

    return merged