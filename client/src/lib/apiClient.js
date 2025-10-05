export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchFromAPI(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error: ${res.status} ${err}`);
  }

  return res.json();
}
