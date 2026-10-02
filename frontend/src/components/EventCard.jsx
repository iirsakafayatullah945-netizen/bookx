import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <div className="event-card">

      <div className="event-image">
        <img
          src={event.image}
          alt={event.title}
        />
      </div>

      <div className="event-content">

        <span className="event-category">
          {event.category}
        </span>

        <h3>
          {event.title}
        </h3>

        <p>
          📅 {event.date}
        </p>

        <p>
          ⏰ {event.time}
        </p>

        <p>
          📍 {event.city}
        </p>

        <p className="event-price">
          Rs. {event.price}
        </p>

        <Link
          to={`/event/${event.id}`}
          className="primary-btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default EventCard;