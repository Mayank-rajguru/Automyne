import pandas as pd

def build_summary_context(df_daily, ticker, df_weekly=None):

    recent = df_daily.tail(10)

    avg_sent = recent["avg_sentiment"].mean()
    med_sent = recent["median_sentiment"].median()
    std_sent = recent["sentiment_std"].mean()
    pos_ratio = recent["pos_ratio"].mean()
    neg_ratio = recent["neg_ratio"].mean()
    mom = recent["sentiment_mom"].iloc[-1]
    final_signal = recent["final_signal"].iloc[-1]

    divs = recent["divergence_signal"].value_counts().to_dict()

    # WEEKLY DATA
    if df_weekly is not None and len(df_weekly) > 0:
        last = df_weekly.tail(1).iloc[0]
        weekly_signal = last.get("weekly_signal", "N/A")
        weekly_z = last.get("weekly_zscore", 0)
        next_pred = last.get("predicted_direction", "N/A")
    else:
        weekly_signal = "N/A"
        weekly_z = 0
        next_pred = "N/A"

    return f"""
Sentiment Summary Context for {ticker}:

DAILY SENTIMENT (last 10 days):
- Avg Sentiment: {avg_sent:.3f}
- Median Sentiment: {med_sent:.3f}
- Volatility: {std_sent:.3f}
- Momentum: {mom:.3f}
- Daily Composite Signal: {final_signal}

WEEKLY SENTIMENT:
- Weekly Trend: {weekly_signal}
- Weekly Z-Score: {weekly_z:.3f}
- Weekly ML Prediction: {next_pred}

Divergence patterns (daily):
{divs}

Write a 6–8 sentence market summary interpreting:
- daily vs weekly sentiment trends
- sentiment–price interaction
- risk environment
- next-week directional bias based on signals + model.
"""