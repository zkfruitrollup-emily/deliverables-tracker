// Vercel serverless proxy — forwards requests to Google Apps Script.
// This sidesteps CORS: the browser talks to /api/data (same origin),
// and this function calls Apps Script server-to-server (no CORS rules).

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_P2sCrcTYIa6Y6eyOTjAj5z8U-sFuhUKslpJgwcg9_hyjoBZMK1Bqh4hnDYC0sGI5/exec';

export default async function handler(req, res) {
  // Forward all query params from the tracker to Apps Script
  const params = new URLSearchParams(req.query).toString();
  const url    = params ? `${SCRIPT_URL}?${params}` : SCRIPT_URL;

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const text     = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
