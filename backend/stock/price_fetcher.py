import json
import logging
from pathlib import Path
import pandas as pd
import yfinance as yf
import time

from .market_calendar import align_to_business_days

CACHE_DIR = Path("cache/stock")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def _cache_path(ticker):
    return CACHE_DIR / f"{ticker.upper()}.json"


def load_cached_stock(ticker):
    path = _cache_path(ticker)
    if path.exists():
        try:
            data = json.loads(path.read_text())
            return pd.DataFrame(data)
        except Exception:
            logging.error(f"Corrupted stock cache for {ticker}, recreating…")
    return None


def save_cached_stock(ticker, df):
    path = _cache_path(ticker)
    data = df.to_dict(orient="records")
    path.write_text(json.dumps(data, indent=2))


def fetch_stock_from_api(ticker, start_date, end_date, retries=3):
    """
    Reliable yfinance downloader with retry logic.
    """
    for attempt in range(1, retries + 1):
        try:
            logging.info(f"[{ticker}] Fetching stock data attempt {attempt}/{retries}")

            data = yf.download(
                ticker,
                start=start_date,
                end=end_date,
                auto_adjust=True,
                progress=False,
                threads=True,
            )

            if not data.empty:
                return data

            logging.warning(f"[{ticker}] Empty result returned by yfinance.")

        except Exception as e:
            logging.error(f"[{ticker}] yfinance error: {e}")

        time.sleep(1.5 * attempt)  # exponential backoff

    return pd.DataFrame()


def get_stock_price(ticker: str, start_date: str, end_date: str):
    """
    Main production-grade stock price fetcher.
    Includes:
        - caching
        - retries
        - adjusted OHLC
        - business-day alignment
        - validation
    """

    # Step 1: Try cached version
    cached = load_cached_stock(ticker)
    if cached is not None:
        logging.info(f"[{ticker}] Loaded stock prices from cache.")
        return cached

    # Step 2: Download from API
    raw = fetch_stock_from_api(ticker, start_date, end_date)

    if raw.empty:
        logging.error(f"[{ticker}] No stock data fetched from API.")
        return pd.DataFrame(columns=["Date", "Close"])

    # Step 3: Normalize column structure
    if isinstance(raw.columns, pd.MultiIndex):
        raw.columns = [col[0] for col in raw.columns]

    raw = raw.reset_index()
    raw["Date"] = raw["Date"].dt.date.astype(str)

    # Keep only date + close for now
    stock_df = raw[["Date", "Close"]].copy()

    # Step 4: Business-day alignment
    stock_df = align_to_business_days(stock_df)

    # Step 5: Cache results
    save_cached_stock(ticker, stock_df)

    logging.info(f"[{ticker}] Stock prices ready: {len(stock_df)} rows.")

    return stock_df