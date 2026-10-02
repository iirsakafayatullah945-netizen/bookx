import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cities from "../data/cities";

function Buses() {
  const [buses, setBuses] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/buses`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load buses");
        }

        return response.json();
      })
      .then((data) => {
        setBuses(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Bus error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredBuses = buses.filter((bus) => {
    const matchesFrom = from === "" || bus.from === from;
    const matchesTo = to === "" || bus.to === from;

    return matchesFrom && matchesTo;
  });

  return (
    <main className="bus-page">

      {/* Header */}
      <section className="bus-header">
        <p>BOOK.X</p>
        <h1>Bus Booking</h1>
        <span>
          Find and book comfortable buses across Pakistan.
        </span>
      </section>

      {/* Search */}
      <section className="bus-search-section">
        <div className="bus-search-box">

          <div className="bus-field">
            <label>From</label>

            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">
                Select departure city
              </option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="bus-field">
            <label>To</label>

            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">
                Select destination city
              </option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="primary-btn bus-search-btn"
          >
            Search Buses
          </button>

        </div>
      </section>

      {/* Bus Results */}
      <section className="bus-results-section">

        <div className="bus-results-heading">
          <div>
            <p>AVAILABLE BUSES</p>

            <h2>
              {loading
                ? "Loading..."
                : `${filteredBuses.length} Buses Found`}
            </h2>
          </div>
        </div>

        {/* No Buses */}
        {!loading && filteredBuses.length === 0 ? (
          <div className="no-buses">
            <h2>No Buses Found</h2>
            <p>
              Try changing your departure or destination.
            </p>
          </div>
        ) : (

          /* Bus Cards */
          <div className="bus-grid">

            {filteredBuses.map((bus) => {

              const availableSeats =
                bus.seats - (bus.bookedSeats?.length || 0);

              return (
                <div
                  className="bus-card"
                  key={bus._id}
                >

                  <div className="bus-image">
                    <img
                      src={bus.image}
                      alt={bus.company}
                    />
                  </div>

                  <div className="bus-card-content">

                    <div className="bus-company-row">

                      <div>
                        <span className="bus-type">
                          {bus.type}
                        </span>

                        <h2>{bus.company}</h2>
                      </div>

                      <strong className="bus-price">
                        Rs. {bus.price}
                      </strong>

                    </div>

                    <p>
                      🚌 {bus.busNumber}
                    </p>

                    <div className="bus-route">

                      <div>
                        <strong>{bus.from}</strong>
                        <span>{bus.departure}</span>
                      </div>

                      <span className="route-arrow">
                        →
                      </span>

                      <div>
                        <strong>{bus.to}</strong>
                        <span>{bus.arrival}</span>
                      </div>

                    </div>

                    <div className="bus-info-row">
                      <span>
                        📅 {bus.date}
                      </span>

                      <span>
                        ⏱️ {bus.duration}
                      </span>
                    </div>

                    <p className="available-seats">
                      💺 {availableSeats} seats available
                    </p>

                    <Link
                      to={`/bus/${bus._id}`}
                      className="primary-btn"
                    >
                      View Bus
                    </Link>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}

export default Buses;