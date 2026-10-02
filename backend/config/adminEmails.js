// ============================================================
// ADMIN EMAIL CONFIGURATION
// ============================================================
// Add or remove admin emails by editing ADMIN_EMAILS in your
// .env file (comma-separated, no spaces needed around commas).
//
// Example .env line:
//   ADMIN_EMAILS=owner@example.com,manager@example.com
//
// Any user who registers/logs in with one of these emails
// (case-insensitive) is treated as an admin. No separate admin
// account or role field is needed.
// ============================================================

const rawList = process.env.ADMIN_EMAILS || "";

const adminEmails = rawList
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter((email) => email.length > 0);

function isAdminEmail(email) {
  if (!email) return false;
  return adminEmails.includes(email.trim().toLowerCase());
}

module.exports = { adminEmails, isAdminEmail };
