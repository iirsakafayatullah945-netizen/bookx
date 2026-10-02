import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

// Wrap any route with this to force visitors to log in first.
// Usage: <Route path="/x" element={<RequireAuth><X /></RequireAuth>} />
function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default RequireAuth;
