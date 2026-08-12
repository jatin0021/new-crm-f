// API Base URL Configuration
// When deployed on Vercel, set VITE_API_URL in Environment Variables (e.g., https://your-crm-backend.vercel.app)
// On localhost development, defaults to empty string to use Vite dev proxy.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
