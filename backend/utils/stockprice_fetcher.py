import yfinance as yf
import pandas as pd

def get_stock_price(ticker: str = "GME", start_date: str | None = None, end_date: str | None = None):
    """
    Fetch daily stock prices for a given ticker and date range.
    start_date, end_date should be strings like '2021-01-01'.
    """

    data = yf.download(
        ticker,
        start=start_date,
        end=end_date,
        auto_adjust=False
    )

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = [c[0] for c in data.columns]

    data = data.reset_index()
    data["Date"] = data["Date"].dt.date.astype(str)

    stock_df = data[["Date", "Close"]].copy()
    stock_df = stock_df.reset_index(drop=True)

    return stock_df
