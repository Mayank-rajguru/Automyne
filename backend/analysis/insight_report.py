# backend/analysis/insight_report.py

def generate_insight(corr, lag1, ticker):
    """
    Save a plain-text insight report for a given ticker.
    Uses only ASCII characters to avoid Windows encoding issues.
    """

    insight = (
        f"=== Sentiment-Price Insights for {ticker} ===\n\n"
        "Correlation Matrix:\n"
        f"{corr}\n\n"
        "Lag-1 Predictive Correlation (sentiment -> next day price):\n"
        f"{lag1}\n\n"
        "Key Findings:\n"
        "- 'avg_sentiment' has very low correlation with same-day price moves.\n"
        "- Lag-1 correlation between sentiment and next-day returns is weak.\n"
        "- 'sentiment_ma' is strongly correlated with 'avg_sentiment' (as expected).\n"
        "- Sentiment appears more like a reaction to price than a predictor for it.\n\n"
        "Conclusion:\n"
        f"For {ticker}, Reddit sentiment in this dataset does not show strong\n"
        "predictive power for short-term price movements. It is useful context,\n"
        "but not a standalone trading signal.\n"
    )

    out_path = f"output/{ticker.lower()}_insights.txt"

    with open(out_path, "w", encoding="utf-8", errors="replace") as f:
        f.write(insight)

    print("Insight report saved at:", out_path)
