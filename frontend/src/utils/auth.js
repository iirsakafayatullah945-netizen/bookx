// ============================================================
// Shared auth helpers.
// Reads/writes the same localStorage keys the app already used
// (eventpkLoggedIn, eventpkUser) plus a new eventpkToken key.
// ============================================================

const TOKEN_KEY = "eventpkToken";
const USER_KEY = "eventpkUser";
const LOGGED_IN_KEY = "eventpkLoggedIn";

// Dev-only bypass. Set VITE_DEV_BYPASS_AUTH=true in your .env
// to explore the site locally without logging in. ALWAYS keep
// this "false" (or unset) before deploying / sharing the site.
export const DEV_BYPASS_AUTH =
  import.meta.env.VITE_DEV_BYPASS_AUTH === "true";

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOGGED_IN_KEY, "true");
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGGED_IN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return (
    DEV_BYPASS_AUTH ||
    localStorage.getItem(LOGGED_IN_KEY) === "true"
  );
}

export function isAdmin() {
  if (DEV_BYPASS_AUTH) return true;
  const user = getUser();
  return Boolean(user && user.isAdmin);
}

// Spread this into a fetch() "headers" object for admin
// (POST/PUT/DELETE) requests, e.g.:
//   fetch(url, { headers: { "Content-Type": "application/json", ...authHeader() } })
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
