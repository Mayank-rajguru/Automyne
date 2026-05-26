import pandas as pd
import logging
from .cleaner import clean_text, build_ticker_regex
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

CSV_PATH = BASE_DIR / "data" / "reddit_wsb.csv"


def load_and_standardize(path: str = CSV_PATH) -> pd.DataFrame:
    logging.info(f"Loading CSV: {path}")
    df = pd.read_csv(path)

    # Normalize case for detection
    cols = {c.lower(): c for c in df.columns}

    # ---------------------------------------
    # 1. Detect correct timestamp column
    # ---------------------------------------
    if "timestamp" in cols:
        # Already a proper datetime string
        df["Created"] = pd.to_datetime(df[cols["timestamp"]], errors="coerce")
    elif "created" in cols:
        # Fallback: UNIX timestamp
        df["Created"] = pd.to_datetime(df[cols["created"]], unit="s", errors="coerce")
    else:
        raise ValueError("No valid timestamp column found (expected 'timestamp' or 'created').")

    # ---------------------------------------
    # 2. Standard renaming
    # ---------------------------------------
    df = df.rename(columns={
        cols.get("title"): "Title",
        cols.get("post text") or cols.get("body"): "Post Text",
        cols.get("id"): "ID",
        cols.get("post url") or cols.get("url"): "Post URL",
    })

    # ---------------------------------------
    # 3. Drop ONLY raw timestamp columns
    #    but KEEP the final 'Created' column
    # ---------------------------------------
    for col in ["timestamp", "created"]:
        if col in df.columns:
            df = df.drop(columns=[col])

    # ---------------------------------------
    # 4. Drop invalid rows
    # ---------------------------------------
    df = df.dropna(subset=["Title", "Created"])

    # ---------------------------------------
    # 5. Clean text fields
    # ---------------------------------------
    df["Title"] = df["Title"].apply(clean_text)
    df["Post Text"] = df["Post Text"].fillna("").apply(clean_text)

    return df

def filter_by_ticker(df: pd.DataFrame, ticker: str) -> pd.DataFrame:
    pattern = build_ticker_regex(ticker)

    def has_ticker(text: str) -> bool:
        return bool(pattern.search(text))

    title_mask = df["Title"].apply(has_ticker)
    body_mask = df["Post Text"].apply(has_ticker)

    filtered = df[title_mask | body_mask].copy()

    logging.info(
        f"Ticker {ticker}: {len(filtered)} posts out of {len(df)} total"
    )

    # Add combined text for sentiment analysis
    filtered["text"] = (
        filtered["Title"] + " " + filtered["Post Text"].fillna("")
    ).apply(lambda t: t.strip())

    return filtered