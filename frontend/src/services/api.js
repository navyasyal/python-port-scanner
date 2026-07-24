import axios from 'axios';

// In dev, Vite proxies /api to the Flask backend (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed backend origin.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({ baseURL, timeout: 30000 });

export const api = {
  startScan: async ({ target, ports, threads }) => {
    const { data } = await client.post('/scan', { target, ports, threads });
    return data;
  },

  getScanStatus: async (jobId) => {
    const { data } = await client.get(`/scan/${jobId}`);
    return data;
  },

  getHistory: async () => {
    const { data } = await client.get('/history');
    return data;
  },

  getLogs: async () => {
    const { data } = await client.get('/logs');
    return data;
  },

  downloadCsvUrl: (jobId) => `${baseURL}/download/csv/${jobId}`,
  downloadJsonUrl: (jobId) => `${baseURL}/download/json/${jobId}`,
};

export default api;
