import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This page is retired. Admin access is now granted through the
// normal /login page: if the email you log in with is listed in
// the backend's ADMIN_EMAILS config, you become an admin
// automatically and an "Admin" link appears in the navbar.
// This file is kept only so any old bookmarked link redirects
// cleanly instead of breaking.
function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
}

export default AdminLogin;
