# summary_llm.py
import logging
import ollama


def run_ollama(model: str, prompt: str) -> str:
    """
    Calls the local Ollama server using the official Python API.
    Uses stream=False to avoid hanging.
    """
    try:
        response = ollama.generate(
            model=model,
            prompt=prompt,
            stream=False
        )
        return response.get("response", "").strip()

    except Exception as e:
        logging.error(f"Ollama error: {e}")
        return None


def run_openai(prompt: str):
    return None


def run_gemini(prompt: str):
    return None


def generate_summary(prompt: str, model: str = "llama3:8b"):
    """
    Unified LLM interface with fallback.
    """
    # 1️⃣ Try Ollama first
    output = run_ollama(model, prompt)
    if output and len(output) > 10:
        return output

    # 2️⃣ Try future LLMs
    out = run_openai(prompt)
    if out:
        return out

    out = run_gemini(prompt)
    if out:
        return out

    # 3️⃣ Final fallback
    return (
        "Sentiment analysis suggests a mix of signals with moderate uncertainty. "
        "Additional insight unavailable due to LLM failure."
    )