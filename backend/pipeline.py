import os
import logging
import pandas as pd
from pathlib import Path

# --- MODULE IMPORTS ---
from loader.data_loader import load_and_standardize, filter_by_ticker
from sentiment.roberta_engine import RobertaSentimentEngine
from sentiment.sentiment_batcher import SentimentBatcher
from aggregator.daily_aggregator import aggregate_daily
from stock.price_fetcher import get_stock_price
from merger.merge_engine import merge_sentiment_stock
from merger.signal_generator import generate_signals
from summary.summarizer_engine import build_summary_context
from summary.summary_llm import generate_summary

from aggregator.weekly_aggregator import aggregate_weekly
from merger.weekly_merge import merge_weekly
from merger.weekly_signals import generate_weekly_signals

from ml.weekly_model import train_weekly_random_forest  


# -------------------------
# Logging Configuration
# -------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
    handlers=[
        logging.FileHandler("pipeline.log", mode="a", encoding="utf-8"),
        logging.StreamHandler()
    ]
)

# Output Directory
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

# Tickers to run
TICKERS = ["GME", "AMC", "NOK", "BB", "PLTR", "AAL", "SPY", "QQQ", "SLV"]


# ================================
# MAIN PIPELINE FUNCTION
# ================================
def run_pipeline(ticker: str):
    logging.info(f"=== RUNNING PIPELINE FOR {ticker} ===")

    # ------------------------------------------
    # 1. Load & Standardize Data
    # ------------------------------------------
    df_raw = load_and_standardize()
    df_posts = filter_by_ticker(df_raw, ticker)

    if df_posts.empty:
        logging.warning(f"No Reddit posts found for {ticker}. Skipping...")
        return

    # ------------------------------------------
    # 2. Sentiment Analysis (Roberta)
    # ------------------------------------------
    engine = RobertaSentimentEngine()
    batcher = SentimentBatcher(engine, batch_size=32)

    texts = df_posts["text"].tolist()
    sentiment_results = batcher.process_texts(texts)

    # Attach sentiment output
    df_posts["sentiment_label"] = [r["label"] for r in sentiment_results]
    df_posts["sentiment_score"] = [r["score"] for r in sentiment_results]
    df_posts["magnitude"] = [r["magnitude"] for r in sentiment_results]
    df_posts["p_negative"] = [r["p_negative"] for r in sentiment_results]
    df_posts["p_neutral"] = [r["p_neutral"] for r in sentiment_results]
    df_posts["p_positive"] = [r["p_positive"] for r in sentiment_results]

    # ------------------------------------------
    # 3. Daily Aggregation
    # ------------------------------------------
    daily = aggregate_daily(df_posts)

    if daily.empty:
        logging.warning(f"No aggregated sentiment for {ticker}.")
        return

    reddit_start = daily["date"].min()
    reddit_end = daily["date"].max()

    logging.info(f"Reddit range: {reddit_start} → {reddit_end}")

    # ------------------------------------------
    # 4. Fetch Stock Price
    # ------------------------------------------
    stock_df = get_stock_price(ticker, reddit_start, reddit_end)

    if stock_df.empty:
        logging.error(f"No stock data for {ticker}. Cannot continue.")
        return

    # ------------------------------------------
    # 5. Merge (Weekend -> Monday alignment)
    # ------------------------------------------
    merged = merge_sentiment_stock(stock_df, daily)

    # ------------------------------------------
    # 6. Generate Daily Trading Signals
    # ------------------------------------------
    merged = generate_signals(merged)

    # ------------------------------------------
    # 7. WEEKLY AGGREGATION + WEEKLY SIGNALS
    # ------------------------------------------
    weekly_sent = aggregate_weekly(merged)              # weekly sentiment features
    weekly_merged = merge_weekly(stock_df, weekly_sent) # align Close prices
    weekly_with_signals = generate_weekly_signals(weekly_merged)

    # Save weekly CSV early
    weekly_with_signals.to_csv(
        OUTPUT_DIR / f"{ticker.lower()}_weekly.csv",
        index=False
    )

    # ------------------------------------------
    # 8. WEEKLY MACHINE LEARNING — RANDOM FOREST
    # ------------------------------------------
    try:
        ml_model, weekly_with_preds, features = train_weekly_random_forest(weekly_with_signals)
    except Exception as e:
        logging.error(f"Weekly ML error: {e}")
        weekly_with_preds = weekly_with_signals.copy()
        weekly_with_preds["predicted_direction"] = None

    weekly_with_preds.to_csv(
        OUTPUT_DIR / f"{ticker.lower()}_weekly_predictions.csv",
        index=False
    )

    # ------------------------------------------
    # 9. Summary (LLM with daily + weekly inputs)
    # ------------------------------------------
    try:
        prompt = build_summary_context(merged, ticker, weekly_with_preds)
        summary = generate_summary(prompt, model="llama3")
    except Exception as e:
        logging.error(f"LLM summary failed: {e}")
        summary = "Summary unavailable due to LLM failure."

    # ------------------------------------------
    # 10. Save Final Outputs
    # ------------------------------------------
    base = ticker.lower()

    merged.to_csv(OUTPUT_DIR / f"{base}_merged.csv", index=False)

    with open(OUTPUT_DIR / f"{base}_summary.txt", "w", encoding="utf-8") as f:
        f.write(summary)

    logging.info(f"Pipeline for {ticker} completed successfully.")


# ================================
# MAIN EXECUTION LOOP
# ================================
if __name__ == "__main__":
    for t in TICKERS:
        run_pipeline(t)