"""
logger.py

Central logging configuration for the scanner backend. Reused from the
original CLI project's logger, upgraded to a rotating file handler so
scanner.log doesn't grow unbounded when the app is used repeatedly.
"""

import logging
from logging.handlers import RotatingFileHandler
import os

LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scanner.log")

logger = logging.getLogger("network_recon")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = RotatingFileHandler(LOG_PATH, maxBytes=1_000_000, backupCount=3)
    formatter = logging.Formatter("%(asctime)s | %(levelname)s | %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
