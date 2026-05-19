from pathlib import Path

# Base project directory (two levels up from this file)
BASE_DIR = Path(__file__).resolve().parents[1]

# Cache directory
CACHE_DIR = BASE_DIR / "cache"
CACHE_DIR.mkdir(exist_ok=True)