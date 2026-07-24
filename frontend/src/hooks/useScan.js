import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';

const POLL_INTERVAL_MS = 800;

/**
 * Drives the lifecycle of a single scan: start -> poll -> complete/error.
 * Exposes everything the Scanner page needs to render form state,
 * a progress bar, and a live/final results table.
 */
export function useScan() {
  const [job, setJob] = useState(null); // latest status/result payload from the backend
  const [isScanning, setIsScanning] = useState(false);
  const [formError, setFormError] = useState(null);
  const pollRef = useRef(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const poll = useCallback((jobId) => {
    clearPoll();
    pollRef.current = setInterval(async () => {
      try {
        const status = await api.getScanStatus(jobId);
        setJob(status);
        if (status.status === 'completed' || status.status === 'error') {
          clearPoll();
          setIsScanning(false);
        }
      } catch (err) {
        clearPoll();
        setIsScanning(false);
        setFormError('Lost connection to the scan job. Is the backend running?');
      }
    }, POLL_INTERVAL_MS);
  }, [clearPoll]);

  const startScan = useCallback(async ({ target, ports, threads }) => {
    setFormError(null);
    setJob(null);

    try {
      setIsScanning(true);
      const { job_id } = await api.startScan({ target, ports, threads });
      const initialStatus = await api.getScanStatus(job_id);
      setJob(initialStatus);
      poll(job_id);
    } catch (err) {
      setIsScanning(false);
      setFormError(err?.response?.data?.error || 'Could not reach the backend API.');
    }
  }, [poll]);

  const clearResults = useCallback(() => {
    clearPoll();
    setJob(null);
    setIsScanning(false);
    setFormError(null);
  }, [clearPoll]);

  useEffect(() => () => clearPoll(), [clearPoll]);

  return { job, isScanning, formError, startScan, clearResults };
}

export default useScan;
