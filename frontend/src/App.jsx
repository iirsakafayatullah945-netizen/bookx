import "./App.css";

import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import { isLoggedIn as checkIsLoggedIn, isAdmin as checkIsAdmin } from "./utils/auth";

import Home from "./pages/home";
import Events from "./pages/events";
import EventDetails from "./pages/eventDetails";
import Booking from "./pages/booking";
import Login from "./pages/login";
import Register from "./pages/register";
import VerifyEmail from "./pages/VerifyEmail";
import MyTickets from "./pages/mytTickets";
import About from "./pages/about";
import Contact from "./pages/contact";

import Buses from "./pages/buses";
import BusDetails from "./pages/busDetails";
import BusBooking from "./pages/busBooking";

import AdminDashboard from "./pages/AdminDashboard";
import AdminAddEvent from "./pages/AdminAddEvent";
import AdminEvents from "./pages/AdminEvents";
import AdminEditEvent from "./pages/AdminEditEvent";
import AdminEventBookings from "./pages/AdminEventBookings";
import AdminBusBookings from "./pages/AdminBusBookings";
import AdminAddBus from "./pages/AdminAddBus";
import AdminBuses from "./pages/AdminBuses";
import AdminEditBus from "./pages/AdminEditBus";


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn());
  const [isAdmin, setIsAdmin] = useState(checkIsAdmin());

  // Called by Login/Register after a successful auth response.
  function handleAuthSuccess(user) {
    setIsLoggedIn(true);
    setIsAdmin(Boolean(user && user.isAdmin));
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setIsAdmin(false);
  }


  return (
    <BrowserRouter>
      <AppShell
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onAuthSuccess={handleAuthSuccess}
      />
    </BrowserRouter>
  );
}

// Navbar/Footer are hidden on the Login and Register pages.
// Needs to live inside <BrowserRouter> so useLocation() works.
function AppShell({
  isLoggedIn,
  setIsLoggedIn,
  isAdmin,
  onLogout,
  onAuthSuccess
}) {

  const location = useLocation();

  const hideChrome =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verify-email";

  return (
    <>

      {!hideChrome && (
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          isAdmin={isAdmin}
          onLogout={onLogout}
        />
      )}


      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />


        {/* EVENTS */}

        <Route
          path="/events"
          element={
            <RequireAuth>
              <Events />
            </RequireAuth>
          }
        />

        <Route
          path="/event/:id"
          element={
            <RequireAuth>
              <EventDetails />
            </RequireAuth>
          }
        />

        <Route
          path="/booking/:id"
          element={
            <RequireAuth>
              <Booking />
            </RequireAuth>
          }
        />


        {/* AUTHENTICATION (left open on purpose) */}

        <Route
          path="/login"
          element={
            <Login
              onAuthSuccess={onAuthSuccess}
            />
          }
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        <Route
          path="/verify-email"
          element={
            <VerifyEmail />
          }
        />

        {/* Old separate admin-login page is retired: admin
            access is now granted via the regular /login page
            based on the ADMIN_EMAILS list on the backend. */}
        <Route
          path="/admin-login"
          element={<Navigate to="/login" replace />}
        />


        {/* TICKETS */}

        <Route
          path="/my-tickets"
          element={
            <RequireAuth>
              <MyTickets />
            </RequireAuth>
          }
        />


        {/* OTHER PAGES */}

        <Route
          path="/about"
          element={
            <RequireAuth>
              <About />
            </RequireAuth>
          }
        />

        <Route
          path="/contact"
          element={
            <RequireAuth>
              <Contact />
            </RequireAuth>
          }
        />


        {/* BUS BOOKING */}

        <Route
          path="/buses"
          element={
            <RequireAuth>
              <Buses />
            </RequireAuth>
          }
        />

        <Route
          path="/bus/:id"
          element={
            <RequireAuth>
              <BusDetails />
            </RequireAuth>
          }
        />

        <Route
          path="/bus-booking/:id"
          element={
            <RequireAuth>
              <BusBooking />
            </RequireAuth>
          }
        />


        {/* =========================
            ADMIN (login required AND
            email must be in ADMIN_EMAILS)
        ========================= */}

        <Route
          path="/admin-dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin-add-event"
          element={
            <RequireAdmin>
              <AdminAddEvent />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin-events"
          element={
            <RequireAdmin>
              <AdminEvents />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin-edit-event/:id"
          element={
            <RequireAdmin>
              <AdminEditEvent />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin-event-bookings"
          element={
            <RequireAdmin>
              <AdminEventBookings />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin-bus-bookings"
          element={
            <RequireAdmin>
              <AdminBusBookings />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin-add-bus"
          element={
            <RequireAdmin>
              <AdminAddBus />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin-buses"
          element={
            <RequireAdmin>
              <AdminBuses />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin-edit-bus/:id"
          element={
            <RequireAdmin>
              <AdminEditBus />
            </RequireAdmin>
          }
        />

      </Routes>


      {!hideChrome && <Footer />}

    </>
  );
}

export default App;
