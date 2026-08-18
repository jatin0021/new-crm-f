// API Base URL Configuration
// When deployed on Vercel, set VITE_API_URL in Environment Variables (e.g., https://your-crm-backend.vercel.app)
// On localhost development, defaults to empty string to use Vite dev proxy.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Returns the full absolute URL for an API endpoint path.
 */
export function getApiUrl(endpoint) {
  if (!endpoint) return '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}

/**
 * Safe JSON fetch wrapper that catches HTML 404/502/405 error pages and syntax errors gracefully.
 */
export async function safeJsonFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      if (response.status === 405) {
        return {
          response,
          ok: false,
          success: false,
          status: 405,
          message: 'Server error (405 Method Not Allowed). Please verify backend endpoint.'
        };
      }
      if (response.status === 502) {
        return {
          response,
          ok: false,
          success: false,
          status: 502,
          message: 'Backend server is temporarily unreachable (502 Bad Gateway).'
        };
      }
      return {
        response,
        ok: false,
        success: false,
        status: response.status,
        message: `Server returned error (${response.status})`
      };
    }

    return {
      response,
      ok: response.ok,
      status: response.status,
      ...data
    };
  } catch (err) {
    return {
      ok: false,
      success: false,
      status: 0,
      message: err.message || 'Server connection error.'
    };
  }
}
