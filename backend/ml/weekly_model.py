import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


def train_weekly_random_forest(weekly_df: pd.DataFrame):
    weekly_df = weekly_df.copy()
    weekly_df = weekly_df.dropna(subset=["target"])

    feature_cols = [
        "avg_sentiment",
        "median_sentiment",
        "sentiment_std",
        "pos_ratio", "neg_ratio", "neu_ratio",
        "weekly_sentiment_mom",
        "weekly_zscore",
        "Bullish Divergence",
        "Bearish Divergence",
        "None",
    ]

    X = weekly_df[feature_cols]
    y = weekly_df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, shuffle=False
    )

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=6,
        class_weight="balanced",
        random_state=42
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    weekly_df.loc[X_test.index, "predicted_direction"] = preds

    print("\n=== Weekly RandomForest Results ===")
    print("Accuracy:", accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))

    return model, weekly_df, feature_cols