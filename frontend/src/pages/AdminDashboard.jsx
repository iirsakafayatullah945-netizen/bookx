import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/adminDashboard.css';
import { clearSession } from "../utils/auth";

// ------------------------------------------------------------
// Admin access, explained:
// This page is only reachable because App.jsx wraps its route
// in <RequireAdmin>, which checks the logged-in user's
// "isAdmin" flag. That flag is set by the backend at login time
// by comparing the user's email against ADMIN_EMAILS in
// backend/.env (see backend/config/adminEmails.js). To add or
// remove admins, edit ADMIN_EMAILS and restart the backend --
// no code changes needed.
// ------------------------------------------------------------

function AdminDashboard() {
  const navigate = useNavigate();

  function logout() {
    clearSession();
    navigate("/login");
  }

  return (
    <main className="admin-dashboard">

      {/* Header */}
      <div className="admin-header">
        <div>
          <p>BOOK.X</p>
          <h1>Admin Dashboard</h1>
        </div>

        <button onClick={logout}>
          Logout
        </button>
      </div>


      {/* Dashboard Cards */}
      <div className="admin-cards">

        {/* Events */}
        <div className="admin-card">
          <h2>Events</h2>

          <p>
            Add, edit and delete events
          </p>

          <Link className="primary-btn" to="/admin-add-event">
            Add Event
          </Link>

          <Link className="back-booking" to="/admin-events">
            Manage Events
          </Link>
        </div>


        {/* Buses */}
        <div className="admin-card">
          <h2>Buses</h2>

          <p>Add, edit and delete bus services</p>

          <Link className="primary-btn" to="/admin-add-bus">
            Add New Bus
          </Link>

          <Link className="back-booking" to="/admin-buses">
            Manage Buses
          </Link>

          <Link className="back-booking" to="/buses">
            View Public Buses
          </Link>
        </div>


        {/* Event Bookings */}
        <div className="admin-card">
          <h2>Event Bookings</h2>

          <p>
            View customer event bookings
          </p>

          <Link className="primary-btn" to="/admin-event-bookings">
            View Bookings
          </Link>
        </div>


        {/* Bus Bookings */}
        <div className="admin-card">
          <h2>Bus Bookings</h2>

          <p>
            View customer bus bookings
          </p>

          <Link className="primary-btn" to="/admin-bus-bookings">
            View Bookings
          </Link>
        </div>

      </div>

    </main>
  );
}

export default AdminDashboard;