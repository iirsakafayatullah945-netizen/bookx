const jwt = require("jsonwebtoken");

// ============================================================
// verifyToken
// Reads "Authorization: Bearer <token>", verifies it, and
// attaches the decoded payload ({ id, email, isAdmin }) to
// req.user. Responds 401 if missing/invalid.
// ============================================================
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Please log in to continue."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session is invalid or has expired. Please log in again."
    });
  }
}

// ============================================================
// requireAdmin
// Runs verifyToken first, then checks req.user.isAdmin.
// Responds 403 for logged-in non-admins.
// ============================================================
function requireAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        message: "Admin access only."
      });
    }
    next();
  });
}

module.exports = { verifyToken, requireAdmin };
