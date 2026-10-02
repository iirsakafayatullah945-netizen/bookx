import { Link, useNavigate } from "react-router-dom";
import { clearSession } from "../utils/auth";

function Navbar({ isLoggedIn, setIsLoggedIn, isAdmin, onLogout }) {

  const navigate = useNavigate();

  function handleLogout() {

    clearSession();

    setIsLoggedIn(false);

    if (onLogout) {
      onLogout();
    }

    alert("You have been logged out.");

    navigate("/login");
  }

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link
        to="/"
        className="logo"
      >
        Book<span>.X</span>
      </Link>


      {/* NAVIGATION */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/events">
          Events
        </Link>
        <Link to="/buses">
          Bus Booking
        </Link>


        <Link to="/my-tickets">
          My Tickets
        </Link>

        <Link to="/about">
          About
        </Link>

        <Link to="/contact">
          Contact
        </Link>

        {/* Admin link only shows for logged-in admin emails */}
        {isAdmin && (
          <Link to="/admin-dashboard">Admin</Link>
        )}

      </div>


      {/* LOGIN / LOGOUT */}

      <div className="nav-buttons">

        {!isLoggedIn ? (

          <>
            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>
          </>

        ) : (

          <button
            type="button"
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        )}

      </div>

    </nav>
  );
}

export default Navbar;
