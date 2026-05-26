from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
import logging
import json
from pathlib import Path
from utils.paths import CACHE_DIR  # <-- use your real cache dir

MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"


class RobertaSentimentEngine:
    def __init__(self):
        logging.info(f"Loading sentiment model: {MODEL_NAME}")

        # device
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # load model + tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_NAME,
            device_map=None
        )
        logging.info(f"Model loaded on {self.device}")
        self.model.eval()

        # cache file
        self.cache_path = CACHE_DIR / "sentiment_cache.json"

        if self.cache_path.exists():
            try:
                self.cache = json.loads(self.cache_path.read_text())
                logging.info(f"Loaded sentiment cache with {len(self.cache)} entries.")
            except:
                logging.warning("Cache corrupted, starting fresh.")
                self.cache = {}
        else:
            self.cache = {}

    # -------------------------
    # Cache API for batcher
    # -------------------------
    def is_cached(self, text):
        return text in self.cache

    def get_cached(self, text):
        return self.cache[text]

    def cache_result(self, text, result):
        self.cache[text] = result

    def save_cache(self):
        self.cache_path.write_text(json.dumps(self.cache, indent=2))

    # -------------------------
    # Batch inference
    # -------------------------
    def predict_batch(self, texts):
        enc = self.tokenizer(
            texts,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=128
        ).to(self.device)

        with torch.no_grad():
            logits = self.model(**enc).logits
            probs = F.softmax(logits, dim=1)

        final = []
        for p in probs:
            p = p.cpu().tolist()
            idx = p.index(max(p))
            label = ["negative", "neutral", "positive"][idx]

            final.append({
                "label": label,
                "p_negative": p[0],
                "p_neutral": p[1],
                "p_positive": p[2],
                "score": p[2] - p[0],
                "magnitude": max(p)
            })

        return final