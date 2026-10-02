import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function BusDetails() {
  const { id } = useParams();

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBus() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/buses/${id}`
        );

        if (!response.ok) {
          throw new Error("Bus not found");
        }

        const data = await response.json();
        setBus(data);
      } catch (error) {
        console.error("Bus details error:", error);
        setBus(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBus();
  }, [id]);

  if (loading) {
    return (
      <main className="not-found">
        <h1>Loading Bus...</h1>
        <p>Please wait.</p>
      </main>
    );
  }

  if (!bus) {
    return (
      <main className="not-found">
        <h1>Bus Not Found</h1>

        <p>
          Sorry, this bus does not exist.
        </p>

        <Link
          to="/buses"
          className="primary-btn"
        >
          Back to Buses
        </Link>
      </main>
    );
  }

  const bookedSeats = Array.isArray(bus.bookedSeats)
    ? bus.bookedSeats.length
    : 0;

  const totalSeats = Number(bus.seats) || 0;

  const availableSeats = Math.max(
    totalSeats - bookedSeats,
    0
  );

  const amenities = Array.isArray(bus.amenities)
    ? bus.amenities
    : [];

  const shifts = Array.isArray(bus.shifts)
    ? bus.shifts
    : [];

  return (
    <main className="bus-details-page">

      {/* Bus Image */}
      <div className="bus-details-image">
        <img
          src={bus.image}
          alt={bus.company || "Bus"}
        />
      </div>

      <div className="bus-details-container">

        {/* Main Details */}
        <div className="bus-details-main">

          <span className="bus-type">
            {bus.type || "Bus"}
          </span>

          <h1>{bus.company}</h1>

          <p className="bus-number">
            Bus Number: {bus.busNumber}
          </p>

          {/* Route */}
          <div className="details-route">

            <div>
              <span>Departure</span>
              <h2>{bus.from}</h2>
            </div>

            <div className="details-route-arrow">
              →
            </div>

            <div>
              <span>Arrival</span>
              <h2>{bus.to}</h2>
            </div>

          </div>

          {/* Bus Information */}
          <div className="bus-detail-info">

            <div>
              <span>Total Seats</span>
              <strong>{totalSeats}</strong>
            </div>

            <div>
              <span>Available Seats</span>
              <strong>{availableSeats}</strong>
            </div>

            <div>
              <span>Price</span>
              <strong>
                Rs. {bus.price}
              </strong>
            </div>

            <div>
              <span>Bus Type</span>
              <strong>
                {bus.type || "N/A"}
              </strong>
            </div>

          </div>

          {/* Available Shifts */}
          <div className="shifts-section">

            <h2>Available Shifts</h2>

            {shifts.length > 0 ? (
              <div className="shifts-list">

                {shifts.map((shift, index) => (
                  <div
                    className="shift-card"
                    key={shift._id || index}
                  >

                    <h3>
                      Shift {index + 1}
                    </h3>

                    <p>
                      <strong>
                        {shift.departure}
                      </strong>

                      {" → "}

                      <strong>
                        {shift.arrival}
                      </strong>
                    </p>

                    <span>
                      Duration: {shift.duration}
                    </span>

                  </div>
                ))}

              </div>
            ) : (
              <p>
                No shifts available.
              </p>
            )}

          </div>

          {/* Boarding Information */}
          <div className="boarding-section">

            <h2>
              Boarding Information
            </h2>

            <p>
              📍 <strong>Boarding:</strong>{" "}
              {bus.boardingPoint || "Not specified"}
            </p>

            <p>
              📍 <strong>Dropping:</strong>{" "}
              {bus.droppingPoint || "Not specified"}
            </p>

          </div>

          {/* Amenities */}
          <div className="amenities-section">

            <h2>Bus Facilities</h2>

            {amenities.length > 0 ? (
              <div className="amenities-list">

                {amenities.map(
                  (amenity, index) => (
                    <span key={index}>
                      ✓ {amenity}
                    </span>
                  )
                )}

              </div>
            ) : (
              <p>
                No facilities information available.
              </p>
            )}

          </div>

        </div>

        {/* Booking Card */}
        <aside className="bus-booking-card">

          <p>Starting From</p>

          <h2>
            Rs. {bus.price}
          </h2>

          <span>
            per passenger
          </span>

          <div className="booking-card-seats">
            💺 {availableSeats} seats available
          </div>

          {availableSeats > 0 ? (
            <Link
              to={`/bus-booking/${bus._id}`}
              className="primary-btn"
            >
              Select Seats
            </Link>
          ) : (
            <button
              type="button"
              className="primary-btn"
              disabled
            >
              Sold Out
            </button>
          )}

          <Link
            to="/buses"
            className="back-booking"
          >
            ← Back to Buses
          </Link>

        </aside>

      </div>
    </main>
  );
}

export default BusDetails;