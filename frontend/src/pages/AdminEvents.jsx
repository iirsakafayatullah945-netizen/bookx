import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/AdminEvents.css'
import { authHeader } from "../utils/auth";

function AdminEvents() {
  const [events, setEvents] = useState([]);

  // GET ALL EVENTS
  async function fetchEvents() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/events`
      );

      const data = await response.json();

      setEvents(data);
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // DELETE EVENT
  async function deleteEvent(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/events/${id}`,
        {
          method: "DELETE",
          headers: { ...authHeader() }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete event");
        return;
      }

      alert("Event deleted successfully!");

      fetchEvents();

    } catch (error) {
      console.log("Delete error:", error);
      alert("Cannot connect to server");
    }
  }

  return (
    <main className="admin-events">

      <h1>Manage Events</h1>

      <Link to="/admin-dashboard">
        ← Back to Dashboard
      </Link>

      {events.length === 0 ? (
        <div className="no-events">
          <h2>No events found.</h2>
        </div>
      ) : (
        <div className="admin-event-list">
          {events.map((event) => (
            <div key={event._id} className="admin-event-card">

              <h2>{event.title}</h2>

              <div className="admin-event-details">
                <p>
                  <strong>Category:</strong> {event.category}
                </p>

                <p>
                  <strong>City:</strong> {event.city}
                </p>

                <p>
                  <strong>Date:</strong> {event.date}
                </p>

                <p>
                  <strong>Time:</strong> {event.time}
                </p>

                <p>
                  <strong>Location:</strong> {event.location}
                </p>

                <p>
                  <strong>Price:</strong> Rs. {event.price}
                </p>
              </div>

              <div className="admin-event-actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    window.location.href =
                      `/admin-edit-event/${event._id}`
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteEvent(event._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </main>
  );
}

export default AdminEvents;