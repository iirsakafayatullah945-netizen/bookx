import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/eventPages.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "Concert",
    "Sports & Screening",
    "Theatre",
    "Workshop & Classes",
    "Seminar",
    "Art & Crafts",
    "Food",
    "Family",
    "Health & Wellness",
  ];

  // Reads ?category=... from the URL (set when a category tile
  // on the home page is clicked). "All" means no filter.
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/events`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        return response.json();
      })
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Events Error:", error);
        setError("Unable to load events.");
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    const eventCategory = event.category || "";

    const matchesCategory =
      selectedCategory === "All" ||
      eventCategory.toLowerCase() === selectedCategory.toLowerCase();

    return matchesCategory;
  });

  if (loading) {
    return (
      <main className="event-page">
        <div className="event-message">
          <h2>Loading Events...</h2>
          <p>Please wait while we load the latest events.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="event-page">
        <div className="event-message">
          <h2>{error}</h2>
          <p>Make sure the backend server is running.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="event-page">

      {/* EVENTS */}
      <section className="events-list-section">

        {(selectedCategory === "All"
          ? categories
          : [selectedCategory]
        ).map((category) => {

          const categoryEvents = filteredEvents.filter(
            (event) =>
              (event.category || "").toLowerCase() ===
              category.toLowerCase()
          );

          if (categoryEvents.length === 0) {
            return null;
          }

          return (
            <div
              className="event-category-section"
              key={category}
            >

              <div className="event-category-header">

                <div>
                  <span>CATEGORY</span>
                  <h2>{category}</h2>
                </div>

                <strong>
                  {categoryEvents.length} Event
                  {categoryEvents.length !== 1 ? "s" : ""}
                </strong>

              </div>

              <div className="events-card-grid">

                {categoryEvents.map((event) => (

                  <div
                    className="event-list-card"
                    key={event._id}
                  >

                    <div className="event-list-image">

                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                        />
                      ) : (
                        <div className="event-image-placeholder">
                          Book.X
                        </div>
                      )}

                    </div>

                    <div className="event-list-content">

                      <span className="event-type-label">
                        {event.category}
                      </span>

                      <h2>{event.title}</h2>

                      <p>
                        📅 {event.date}
                      </p>

                      <p>
                        ⏰ {event.time}
                      </p>

                      <p>
                        📍 {event.location}
                      </p>

                      <div className="event-card-bottom">

                        <div>
                          <span>Starting From</span>

                          <strong>
                            Rs. {event.price}
                          </strong>
                        </div>

                        <Link
                          to={`/event/${event._id}`}
                          className="event-view-btn"
                        >
                          View Details
                        </Link>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="event-message">
            <h2>No Events Found</h2>
            <p>
              Check back later for new events.
            </p>
          </div>
        )}

      </section>

    </main>
  );
}

export default Events;