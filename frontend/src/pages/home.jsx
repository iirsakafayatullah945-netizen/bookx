import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Categories from "../components/Categories";

function Home() {
  const [events, setEvents] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/events`)
      .then((response) => response.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((error) => console.log("Home events error:", error));
  }, []);

  const visibleEvents = events.slice(startIndex, startIndex + 3);

  function handleNext() {
    if (startIndex + 3 < events.length) {
      setStartIndex(startIndex + 3);
    }
  }

  function handlePrevious() {
    if (startIndex > 0) {
      setStartIndex(startIndex - 3);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">ISLAMABAD • RAWALPINDI</p>
          <h1>Discover Events Near You</h1>
          <p>
            Find concerts, sports events, workshops, exhibitions,
            festivals and more happening in Islamabad and Rawalpindi.
          </p>
          <a href="/events" className="primary-btn">Explore Events</a>
        </div>
      </section>

      <section className="events-section">
        <div className="section-title">
          <p>UPCOMING EVENTS</p>
          <h2>What's Happening Near You?</h2>
        </div>

        <div className="home-event-carousel">
          <button
            className="carousel-arrow carousel-left"
            onClick={handlePrevious}
            disabled={startIndex === 0}
          >
            ←
          </button>

          <div className="home-events-grid">
            {visibleEvents.map((event) => (
              <EventCard
                key={event._id}
                event={{ ...event, id: event._id }}
              />
            ))}
          </div>

          <button
            className="carousel-arrow carousel-right"
            onClick={handleNext}
            disabled={startIndex + 3 >= events.length}
          >
            →
          </button>
        </div>
      </section>

      <Categories />
    </main>
  );
}

export default Home;
