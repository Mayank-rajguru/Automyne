import logging

class SentimentBatcher:
    def __init__(self, engine, batch_size=32):
        self.engine = engine
        self.batch_size = batch_size

    def process_texts(self, texts):
        """
        Runs sentiment analysis using caching + batching.
        """
        results = []
        uncached_texts = []
        uncached_indices = []

        # Pass 1: Serve cached results
        for idx, text in enumerate(texts):
            if self.engine.is_cached(text):
                results.append(self.engine.get_cached(text))
            else:
                results.append(None)
                uncached_texts.append(text)
                uncached_indices.append(idx)

        # Pass 2: Run model on uncached items
        if uncached_texts:
            logging.info(f"Running RoBERTa on {len(uncached_texts)} uncached posts...")

            new_results = self._run_batches(uncached_texts)

            # Insert new results + save to cache
            for idx, text, res in zip(uncached_indices, uncached_texts, new_results):
                results[idx] = res
                self.engine.cache_result(text, res)

            self.engine.save_cache()

        return results

    def _run_batches(self, texts):
        """
        Splits into batches and delegates prediction to the engine.
        """
        outputs = []

        for i in range(0, len(texts), self.batch_size):
            batch = texts[i:i+self.batch_size]
            batch_results = self.engine.predict_batch(batch)
            outputs.extend(batch_results)

        return outputs