"""
exporter.py

Exports scan results to CSV and JSON. Reused from the original CLI
scanner's exporter, parameterized by job id so each scan's downloads
don't overwrite one another.
"""

import csv
import json
import os

RESULTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")
os.makedirs(RESULTS_DIR, exist_ok=True)


def export_csv(results, job_id: str) -> str:
    path = os.path.join(RESULTS_DIR, f"scan_{job_id}.csv")

    with open(path, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Port", "Service", "Status", "Banner"])

        for result in results:
            writer.writerow([
                result["port"],
                result["service"],
                result["status"],
                result["banner"],
            ])

    return path


def export_json(results, job_id: str, meta: dict) -> str:
    path = os.path.join(RESULTS_DIR, f"scan_{job_id}.json")

    payload = {
        "meta": meta,
        "results": results,
    }

    with open(path, "w") as file:
        json.dump(payload, file, indent=4)

    return path
