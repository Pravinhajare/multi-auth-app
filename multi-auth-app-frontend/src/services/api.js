const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE = (rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '') + '/api';

/**
 * Custom fetch wrapper with JSON handling and token support
 */
async function request(endpoint, options = {}) {
  const { token, body, headers = {}, ...customConfig } = options;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  health: () => request('/health', { method: 'GET' }),

  jwt: {
    register: (name, email, password) =>
      request('/auth/jwt/register', {
        method: 'POST',
        body: { name, email, password },
      }),

    login: (email, password) =>
      request('/auth/jwt/login', {
        method: 'POST',
        body: { email, password },
      }),

    getMe: (token) =>
      request('/auth/jwt/me', {
        method: 'GET',
        token,
      }),

    inspectToken: (token) =>
      request('/auth/jwt/inspect', {
        method: 'POST',
        body: { token },
      }),
  },
};
