"""
app.py

Flask REST API for the Network Reconnaissance Dashboard.

Wraps the original CLI scanner (now in scanner_core.py) behind HTTP
endpoints so the React frontend can trigger scans, poll progress,
view logs, and download results - without touching the core scanning
logic itself.

Endpoints
---------
POST   /api/scan                  Start a new scan job
GET    /api/scan/<job_id>         Poll status / final results of a job
GET    /api/history               List all jobs run this session
GET    /api/logs                  Return contents of scanner.log
GET    /api/download/csv/<job_id> Download that job's CSV
GET    /api/download/json/<job_id> Download that job's JSON
"""

import os
import threading
import uuid

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

from scanner_core import ScanJob
from exporter import export_csv, export_json
from logger import logger, LOG_PATH

app = Flask(__name__)
CORS(app)

# In-memory job store. Fine for a single-user portfolio/demo deployment;
# swap for Redis or a DB if this ever needs to serve multiple concurrent users.
JOBS: dict[str, ScanJob] = {}
JOB_ORDER: list[str] = []

MAX_PORT_RANGE = 5000  # guardrail so a stray request can't tie up the server for ages


def _run_job(job: ScanJob):
    job.run()
    if job.status == "completed":
        meta = {
            "target": job.target,
            "resolved_ip": job.resolved_ip,
            "start_port": job.start_port,
            "end_port": job.end_port,
            "elapsed_seconds": round(job.elapsed_time(), 2),
            "open_count": len(job.results),
        }
        export_csv(job.results, job.job_id)
        export_json(job.results, job.job_id, meta)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/scan", methods=["POST"])
def start_scan():
    data = request.get_json(silent=True) or {}

    target = str(data.get("target", "")).strip()
    ports = str(data.get("ports", "20-1024")).strip()
    threads = data.get("threads", 50)

    try:
        threads = int(threads)
        threads = max(1, min(threads, 200))
    except (TypeError, ValueError):
        threads = 50

    if not target:
        return jsonify({"error": "Target is required."}), 400

    try:
        start_port, end_port = ports.split("-")
        start_port, end_port = int(start_port), int(end_port)
    except (ValueError, AttributeError):
        return jsonify({"error": "Ports must be in the form 'start-end', e.g. 20-1024."}), 400

    if start_port < 1 or end_port > 65535 or start_port > end_port:
        return jsonify({"error": "Invalid port range. Must be within 1-65535."}), 400

    if (end_port - start_port + 1) > MAX_PORT_RANGE:
        return jsonify({"error": f"Port range too large. Max {MAX_PORT_RANGE} ports per scan."}), 400

    job_id = uuid.uuid4().hex[:10]
    job = ScanJob(job_id=job_id, target=target, start_port=start_port, end_port=end_port, threads=threads)
    JOBS[job_id] = job
    JOB_ORDER.append(job_id)

    thread = threading.Thread(target=_run_job, args=(job,), daemon=True)
    thread.start()

    return jsonify({"job_id": job_id, "status": "started"}), 202


@app.route("/api/scan/<job_id>", methods=["GET"])
def scan_status(job_id):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"error": "Unknown job id."}), 404

    if job.status == "completed":
        return jsonify(job.to_result_dict())
    return jsonify(job.to_status_dict())


@app.route("/api/history", methods=["GET"])
def history():
    items = [JOBS[jid].to_status_dict() for jid in reversed(JOB_ORDER) if jid in JOBS]
    return jsonify(items)


@app.route("/api/logs", methods=["GET"])
def get_logs():
    if not os.path.exists(LOG_PATH):
        return jsonify({"log": ""})

    with open(LOG_PATH, "r", errors="ignore") as f:
        lines = f.readlines()

    tail = lines[-500:]  # keep responses bounded
    return jsonify({"log": "".join(tail)})


@app.route("/api/download/csv/<job_id>", methods=["GET"])
def download_csv(job_id):
    job = JOBS.get(job_id)
    if not job or job.status != "completed":
        return jsonify({"error": "Job not found or not completed."}), 404

    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results", f"scan_{job_id}.csv")
    if not os.path.exists(path):
        return jsonify({"error": "CSV file not found."}), 404

    return send_file(path, as_attachment=True, download_name=f"scan_{job.target}_{job_id}.csv")


@app.route("/api/download/json/<job_id>", methods=["GET"])
def download_json(job_id):
    job = JOBS.get(job_id)
    if not job or job.status != "completed":
        return jsonify({"error": "Job not found or not completed."}), 404

    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results", f"scan_{job_id}.json")
    if not os.path.exists(path):
        return jsonify({"error": "JSON file not found."}), 404

    return send_file(path, as_attachment=True, download_name=f"scan_{job.target}_{job_id}.json")


if __name__ == "__main__":
    logger.info("Network Recon Dashboard backend starting up")
    app.run(host="0.0.0.0", port=5000, debug=True)
