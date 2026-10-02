import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/adminBus.css'
import { authHeader } from "../utils/auth";

function AdminBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getBuses() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/buses`
      );

      const data = await response.json();

      if (response.ok) {
        setBuses(data);
      } else {
        alert(data.message || "Failed to load buses");
      }
    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend");
    }

    setLoading(false);
  }

  useEffect(() => {
    getBuses();
  }, []);

  async function deleteBus(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/buses/${id}`,
        {
          method: "DELETE",
          headers: { ...authHeader() }
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Bus deleted successfully!");

        setBuses(
          buses.filter((bus) => bus._id !== id)
        );
      } else {
        alert(data.message || "Failed to delete bus");
      }
    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend");
    }
  }

  if (loading) {
    return (
      <main className="admin-buses">
        <h1>Manage Buses</h1>
        <p>Loading buses...</p>
      </main>
    );
  }

  return (
    <main className="admin-buses">

      <div className="admin-buses-header">
        <h1>Manage Buses</h1>

        <div className="admin-buses-links">
          <Link to="/admin-dashboard">
            ← Back to Dashboard
          </Link>

          <Link className="primary-btn" to="/admin-add-bus">
            + Add New Bus
          </Link>
        </div>
      </div>

      {buses.length === 0 ? (
        <div className="no-buses">
          <h2>No buses found.</h2>
        </div>
      ) : (
        <div className="admin-bus-list">
          {buses.map((bus) => (
            <div
              key={bus._id}
              className="admin-bus-card"
            >

              <div className="admin-bus-image">
                {bus.image && (
                  <img
                    src={bus.image}
                    alt={bus.company}
                  />
                )}
              </div>

              <div className="admin-bus-content">
                <h2>{bus.company}</h2>

                <div className="admin-bus-details">
                  <p>
                    <strong>Bus Number:</strong>{" "}
                    {bus.busNumber}
                  </p>

                  <p>
                    <strong>Route:</strong>{" "}
                    {bus.from} → {bus.to}
                  </p>

                  <p>
                    <strong>Price:</strong>{" "}
                    Rs. {bus.price}
                  </p>

                  <p>
                    <strong>Total Seats:</strong>{" "}
                    {bus.seats}
                  </p>

                  <p>
                    <strong>Type:</strong>{" "}
                    {bus.type}
                  </p>

                  <p>
                    <strong>Boarding:</strong>{" "}
                    {bus.boardingPoint}
                  </p>

                  <p>
                    <strong>Dropping:</strong>{" "}
                    {bus.droppingPoint}
                  </p>

                  <p>
                    <strong>Amenities:</strong>{" "}
                    {bus.amenities &&
                    bus.amenities.length > 0
                      ? bus.amenities.join(", ")
                      : "None"}
                  </p>
                </div>

                {/* SHIFTS */}

                <p className="admin-bus-shifts-label">
                  Available Shifts:
                </p>

                {bus.shifts && bus.shifts.length > 0 ? (
                  <div className="admin-bus-shifts">
                    {bus.shifts.map((shift, index) => (
                      <div key={index} className="admin-bus-shift">
                        <p>
                          <strong>Shift {index + 1}:</strong>{" "}
                          {shift.departure} → {shift.arrival}
                        </p>

                        <p>
                          <strong>Duration:</strong>{" "}
                          {shift.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin-bus-no-shifts">
                    No shifts available.
                  </p>
                )}

                {/* IMPORTANT:
                    Seats are NOT permanently booked
                    on the Bus document.

                    Availability depends on:
                    Bus + Travel Date + Shift.
                */}

                <p className="admin-bus-availability-note">
                  Seat availability is checked according to the
                  selected travel date and shift.
                </p>

                <div className="admin-bus-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      window.location.href =
                        `/admin-edit-bus/${bus._id}`
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteBus(bus._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </main>
  );
}

export default AdminBuses;