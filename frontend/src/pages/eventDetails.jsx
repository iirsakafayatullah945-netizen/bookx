import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/eventPages.css";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Event not found");
        }

        return response.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Event Details Error:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="event-not-found">
        <h1>Loading Event...</h1>
        <p>Please wait.</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-not-found">
        <h1>Event Not Found</h1>

        <p>
          Sorry, this event does not exist.
        </p>

        <Link
          to="/events"
          className="event-primary-btn"
        >
          Back to Events
        </Link>
      </main>
    );
  }

  return (
    <main className="event-details-page">

      {/* HERO IMAGE */}

      <div className="event-details-image">

        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
          />
        ) : (
          <div className="event-large-placeholder">
            Book.X
          </div>
        )}

      </div>

      {/* MAIN CONTENT */}

      <div className="event-details-container">

        {/* LEFT */}

        <div className="event-details-main">

          <span className="event-type">
            {event.category}
          </span>

          <h1>
            {event.title}
          </h1>

          <p className="event-description">
            {event.description ||
              "Join us for this exciting event and enjoy an unforgettable experience."}
          </p>

          {/* EVENT INFORMATION */}

          <div className="event-info-route">

            <div>
              <span>Date</span>

              <h2>
                {event.date}
              </h2>
            </div>

            <div className="event-info-arrow">
              →
            </div>

            <div>
              <span>Time</span>

              <h2>
                {event.time}
              </h2>
            </div>

          </div>

          {/* DETAILS */}

          <div className="event-detail-info">

            <div>
              <span>City</span>
              <strong>{event.city}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>{event.location}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>{event.category}</strong>
            </div>

            <div>
              <span>Ticket Price</span>
              <strong>Rs. {event.price}</strong>
            </div>

          </div>

          {/* ABOUT */}

          <div className="event-about-section">

            <h2>
              Event Information
            </h2>

            <p>
              📅 <strong>Date:</strong>{" "}
              {event.date}
            </p>

            <p>
              ⏰ <strong>Time:</strong>{" "}
              {event.time}
            </p>

            <p>
              📍 <strong>Location:</strong>{" "}
              {event.location}
            </p>

            <p>
              🏙️ <strong>City:</strong>{" "}
              {event.city}
            </p>

          </div>

          {/* DESCRIPTION */}

          <div className="event-description-section">

            <h2>
              About This Event
            </h2>

            <p>
              {event.description ||
                "Experience this exciting event with Book.X. Book your tickets easily and enjoy the event."}
            </p>

          </div>

        </div>

        {/* RIGHT BOOKING CARD */}

        <aside className="event-booking-card">

          <p>
            Starting From
          </p>

          <h2>
            Rs. {event.price}
          </h2>

          <span>
            per ticket
          </span>

          <div className="event-price-box">
            🎟️ Tickets available
          </div>

          <Link
            to={`/booking/${event._id}`}
            className="event-primary-btn"
          >
            Book Now
          </Link>

          <Link
            to="/events"
            className="event-back-link"
          >
            ← Back to Events
          </Link>

        </aside>

      </div>

    </main>
  );
}

export default EventDetails;