import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/AdminBusBookings.css'

function AdminEventBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all event bookings
  async function getBookings() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/bookings`
      );

      const data = await response.json();

      if (response.ok) {
        setBookings(data);
      } else {
        alert(data.message || "Failed to load bookings");
      }

    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend");
    }

    setLoading(false);
  }

  useEffect(() => {
    getBookings();
  }, []);

  if (loading) {
    return (
      <main className="admin-event-bookings">
        <h1>Event Bookings</h1>
        <p>Loading bookings...</p>
      </main>
    );
  }

  return (
    <main className="admin-event-bookings">

      <h1>Event Bookings</h1>

      <Link to="/admin-dashboard">
        ← Back to Dashboard
      </Link>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h2>No event bookings found.</h2>
        </div>
      ) : (

        <div className="admin-booking-list">
          {bookings.map((booking) => {

            // Event may be populated or may be missing
            const event = booking.eventId;

            // Ignore old broken bookings
            if (!event || typeof event !== "object") {
              return null;
            }

            return (
              <div
                key={booking._id}
                className="admin-booking-card"
              >

                <h2>{event.title}</h2>

                <div className="admin-booking-details">
                  <p>
                    <strong>Customer Name:</strong>{" "}
                    {booking.name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {booking.email}
                  </p>

                  <p>
                    <strong>Tickets:</strong>{" "}
                    {booking.tickets}
                  </p>

                  <p>
                    <strong>Total Price:</strong>{" "}
                    Rs. {booking.totalPrice}
                  </p>

                  <p>
                    <strong>Event Date:</strong>{" "}
                    {event.date}
                  </p>

                  <p>
                    <strong>Event Time:</strong>{" "}
                    {event.time}
                  </p>

                  <p>
                    <strong>City:</strong>{" "}
                    {event.city}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {event.location}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      )}

    </main>
  );
}

export default AdminEventBookings;