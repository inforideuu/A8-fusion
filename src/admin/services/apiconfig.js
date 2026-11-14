// src/config/api.js
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '[::1]'
);

// If local, use localhost:8000. If live, use your Render link!
export const BACKEND_URL = isLocalhost
  ? 'http://127.0.0.1:8000'
  : 'https://a8-fusion.onrender.com';

export const API_BASE = `${BACKEND_URL}/api`;