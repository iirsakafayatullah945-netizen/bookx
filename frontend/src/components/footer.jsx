import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-section">

          <h2>
            Book<span>.X</span>
          </h2>

          <p>
            Discover and book exciting events across
            Islamabad and Rawalpindi.
          </p>

        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/my-tickets">My Tickets</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

        </div>

        {/* CONTACT */}
        <div className="footer-section">

          <h3>Contact</h3>

          <p>Islamabad, Pakistan</p>
          <p>support@bookx.com</p>
          <p>+92 300 1234567</p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 Book.X. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;