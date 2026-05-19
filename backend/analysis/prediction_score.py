import pandas as pd

def evaluate_accuracy(monthly_df):
    df = monthly_df.copy()
    df["actual"] = df["future_return"] > 0
    df["pred"] = df["sentiment_ma"] > 0

    df = df.dropna(subset=["future_return"])

    accuracy = (df["actual"] == df["pred"]).mean() * 100
    return round(accuracy,2)
