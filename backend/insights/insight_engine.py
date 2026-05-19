import pandas as pd

def generate_insights(daily_df, weekly_df, ml_model=None):
    insights = []

    # ---------------------
    # DAILY INSIGHTS
    # ---------------------
    last10 = daily_df.tail(10)

    # Sentiment Direction
    trend = last10["avg_sentiment"].diff().mean()
    if trend > 0:
        insights.append("• Daily sentiment is trending upward.")
    elif trend < 0:
        insights.append("• Daily sentiment is weakening.")
    else:
        insights.append("• Daily sentiment is flat with no clear direction.")

    # Divergence
    div_counts = last10["divergence_signal"].value_counts()
    bull_div = div_counts.get("Bullish Divergence", 0)
    bear_div = div_counts.get("Bearish Divergence", 0)

    if bull_div > bear_div:
        insights.append("• Bullish divergences dominate → price may be undervalued relative to sentiment.")
    elif bear_div > bull_div:
        insights.append("• Bearish divergences dominate → sentiment weakening despite price.")
    else:
        insights.append("• Divergence patterns are mixed.")

    # ---------------------
    # WEEKLY INSIGHTS
    # ---------------------
    last_week = weekly_df.tail(1).iloc[0]

    weekly_signal = last_week.get("weekly_signal")
    zscore = last_week.get("weekly_zscore", 0)

    if weekly_signal == "Up":
        insights.append("• Weekly sentiment trend is UP.")
    elif weekly_signal == "Down":
        insights.append("• Weekly sentiment trend is DOWN.")
    else:
        insights.append("• Weekly sentiment is flat.")

    # Z-score interpretation
    if zscore > 1.0:
        insights.append("• Weekly Z-score is high → unusually positive sentiment (possible FOMO).")
    elif zscore < -1.0:
        insights.append("• Weekly Z-score is low → unusually negative sentiment (fear-driven).")
    else:
        insights.append("• Weekly Z-score is stable (normal sentiment range).")

    # ---------------------
    # ML MODEL INSIGHTS
    # ---------------------
    if "predicted_direction" in weekly_df.columns:
        pred = weekly_df["predicted_direction"].dropna().iloc[-1]
        pred_text = "Bullish" if pred == 1 else "Bearish"
        insights.append(f"• ML model predicts NEXT WEEK: **{pred_text}**.")

    # Feature importances
    if ml_model is not None:
        fi = ml_model.feature_importances_
        top_features = sorted(zip(fi, ml_model.feature_names_in_), reverse=True)[:3]
        top_text = ", ".join([f"{name}" for _, name in top_features])
        insights.append(f"• Most influential features: {top_text}")

    # ---------------------
    # FINAL INTERPRETATION
    # ---------------------
    if trend > 0 and weekly_signal == "Up":
        insights.append("→ Overall outlook: Improving sentiment across all timeframes.")
    elif trend < 0 and weekly_signal == "Down":
        insights.append("→ Overall outlook: Sentiment weakening; caution warranted.")
    else:
        insights.append("→ Overall outlook: Mixed signals; likely sideways movement.")

    return "\n".join(insights)