import re
import unicodedata

URL_REGEX = re.compile(r"https?://\S+|www\.\S+")
EMOJI_REGEX = re.compile(
    "[" 
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F300-\U0001F5FF"  # Symbols & Pictographs
    "\U0001F680-\U0001F6FF"  # Transport & Map Symbols
    "\U0001F1E0-\U0001F1FF"  # Flags
    "]+",
    flags=re.UNICODE,
)

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""

    # Lowercase
    text = text.lower()


    text = URL_REGEX.sub("", text)


    text = EMOJI_REGEX.sub("", text)


    text = unicodedata.normalize("NFKD", text)

    # Remove markdown links [text](url)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)

    # Remove weird punctuation artifacts
    text = re.sub(r"[\(\)\[\]\{\}<>]", " ", text)

    # Remove repeated punctuation (e.g., !!!, ???)
    text = re.sub(r"([!?.,])\1+", r"\1", text)

    # Replace multiple spaces with one
    text = re.sub(r"\s+", " ", text).strip()

    return text

def build_ticker_regex(ticker: str):
    pattern = rf"(?<!\w)\$?{re.escape(ticker)}(?=\W|$)"
    return re.compile(pattern, re.IGNORECASE)