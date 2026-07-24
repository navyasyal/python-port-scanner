"""
scanner_core.py

This is the original CLI scanner's engine (scanner.py), refactored so it
can be driven from a Flask API instead of argparse. The actual scanning
logic - opening a TCP socket, connect_ex, banner grab, service lookup -
is unchanged from the original project. What changed is packaging:
    * scan_port() is now a method on ScanJob so it can report progress
    * results accumulate on the job instance instead of a module-level list
    * a status dict is updated as ports complete, which the Flask layer
      exposes to the frontend for polling / progress bars
"""

import socket
import threading
import time
from concurrent.futures import ThreadPoolExecutor

from banner import grab_banner
from utils import validate_target, resolve_target, get_service, categorize_port
from logger import logger


class ScanJob:
    """
    Represents a single port scan run. One instance is created per
    POST /api/scan request and tracked by job id in app.py.
    """

    def __init__(self, job_id: str, target: str, start_port: int, end_port: int, threads: int = 50):
        self.job_id = job_id
        self.target = target
        self.resolved_ip = resolve_target(target)
        self.start_port = start_port
        self.end_port = end_port
        self.threads = threads

        self.results = []
        self._lock = threading.Lock()

        self.status = "pending"  # pending -> running -> completed | error
        self.error = None
        self.scanned_count = 0
        self.total_ports = end_port - start_port + 1
        self.start_time = None
        self.end_time = None

    # ------------------------------------------------------------------
    # Scan Function (logic preserved from the original CLI scanner.py)
    # ------------------------------------------------------------------
    def _scan_port(self, port: int):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)

        try:
            result = sock.connect_ex((self.resolved_ip, port))

            if result == 0:
                banner = grab_banner(self.resolved_ip, port)
                service = get_service(port)
                logger.info(f"[{self.job_id}] Port {port} OPEN on {self.target}")

                with self._lock:
                    self.results.append({
                        "port": port,
                        "service": service,
                        "status": "Open",
                        "banner": banner,
                        "category": categorize_port(port),
                    })
        finally:
            sock.close()
            with self._lock:
                self.scanned_count += 1

    # ------------------------------------------------------------------
    # Start Scanning
    # ------------------------------------------------------------------
    def run(self):
        if not validate_target(self.target):
            self.status = "error"
            self.error = "Invalid IP address or hostname."
            logger.info(f"[{self.job_id}] Invalid target rejected: {self.target}")
            return

        self.status = "running"
        self.start_time = time.time()
        logger.info(f"[{self.job_id}] Started scanning {self.target} "
                    f"({self.start_port}-{self.end_port}, {self.threads} threads)")

        try:
            with ThreadPoolExecutor(max_workers=self.threads) as executor:
                executor.map(self._scan_port, range(self.start_port, self.end_port + 1))

            self.results.sort(key=lambda r: r["port"])
            self.end_time = time.time()
            self.status = "completed"
            logger.info(
                f"[{self.job_id}] Scan finished. "
                f"{len(self.results)} open / {self.total_ports} scanned "
                f"in {self.elapsed_time():.2f}s"
            )
        except Exception as exc:
            self.status = "error"
            self.error = str(exc)
            logger.info(f"[{self.job_id}] Scan failed: {exc}")

    # ------------------------------------------------------------------
    def elapsed_time(self) -> float:
        if self.start_time is None:
            return 0.0
        end = self.end_time or time.time()
        return end - self.start_time

    def progress_percent(self) -> float:
        if self.total_ports == 0:
            return 100.0
        return round((self.scanned_count / self.total_ports) * 100, 1)

    def to_status_dict(self) -> dict:
        return {
            "job_id": self.job_id,
            "status": self.status,
            "error": self.error,
            "target": self.target,
            "resolved_ip": self.resolved_ip,
            "start_port": self.start_port,
            "end_port": self.end_port,
            "threads": self.threads,
            "scanned_count": self.scanned_count,
            "total_ports": self.total_ports,
            "progress_percent": self.progress_percent(),
            "open_count": len(self.results),
            "elapsed_seconds": round(self.elapsed_time(), 2),
        }

    def to_result_dict(self) -> dict:
        data = self.to_status_dict()
        data["results"] = self.results
        return data
