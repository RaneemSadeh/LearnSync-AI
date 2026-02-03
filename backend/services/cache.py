from functools import lru_cache
import time

# Simple in-memory cache for demonstration
# In production, use Redis or Memcached

_memory_cache = {}

def get_cached_result(key: str):
    entry = _memory_cache.get(key)
    if entry:
        # Check expiry if needed, for MVP we keep it simple
        return entry
    return None

def set_cached_result(key: str, value: any):
    _memory_cache[key] = value

def clear_cache():
    _memory_cache.clear()
