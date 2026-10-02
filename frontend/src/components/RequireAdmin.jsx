import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

// Wrap any admin route with this. Non-logged-in visitors go to
// /login; logged-in non-admins go to "/" (home) instead of
// seeing the admin panel.
// Usage: <Route path="/admin-x" element={<RequireAdmin><X /></RequireAdmin>} />
function RequireAdmin({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireAdmin;
