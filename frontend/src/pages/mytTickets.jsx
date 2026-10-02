import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyTickets() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("eventpkUser") || "null")
  );

  const [eventBookings, setEventBookings] = useState([]);
  const [busBookings, setBusBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const savedUser = JSON.parse(
          localStorage.getItem("eventpkUser") || "null"
        );

        setUser(savedUser);

        if (!savedUser?.email) {
          setLoading(false);
          return;
        }

        const email = encodeURIComponent(savedUser.email);

        // =========================================
        // GET EVENT BOOKINGS
        // =========================================

        const eventResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/bookings/user/${email}`
        );

        const bookings = eventResponse.ok
          ? await eventResponse.json()
          : [];

        // =========================================
        // GET BUS BOOKINGS
        // =========================================

        const busResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/buses/bookings/user/${email}`
        );

        const buses = busResponse.ok
          ? await busResponse.json()
          : [];

        // =========================================
        // GET EVENT INFORMATION
        // =========================================

        const bookingsWithEvents = await Promise.all(
          bookings.map(async (booking) => {
            try {
              let eventId = booking.eventId;

              // If eventId is already populated
              if (
                typeof eventId === "object" &&
                eventId !== null
              ) {
                // Already has complete event information
                if (eventId._id) {
                  return {
                    ...booking,
                    event: eventId,
                  };
                }

                return null;
              }

              // If eventId is missing
              if (!eventId) {
                return null;
              }

              // Get event from API
              const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`
              );

              if (!response.ok) {
                return null;
              }

              const event = await response.json();

              return {
                ...booking,
                event: event,
              };
            } catch (error) {
              console.log(
                "Failed to load event:",
                error
              );

              return null;
            }
          })
        );

        // Remove invalid/old event bookings
        const validEventBookings =
          bookingsWithEvents.filter(
            (booking) =>
              booking &&
              booking.event &&
              booking.event._id
          );

        // =========================================
        // GET BUS INFORMATION
        // =========================================

        const busesWithDetails = await Promise.all(
          (Array.isArray(buses) ? buses : []).map(
            async (booking) => {
              try {
                let bus = booking.busId;

                // Bus already populated
                if (
                  typeof bus === "object" &&
                  bus !== null &&
                  bus._id
                ) {
                  return {
                    ...booking,
                    bus: bus,
                  };
                }

                // Bus ID missing
                if (!bus) {
                  return null;
                }

                // Get bus from API
                const response = await fetch(
                  `${import.meta.env.VITE_BACKEND_URL}/buses/${bus}`
                );

                if (!response.ok) {
                  return null;
                }

                const busData = await response.json();

                return {
                  ...booking,
                  bus: busData,
                };
              } catch (error) {
                console.log(
                  "Failed to load bus:",
                  error
                );

                return null;
              }
            }
          )
        );

        // Remove invalid bus bookings
        const validBusBookings =
          busesWithDetails.filter(
            (booking) =>
              booking &&
              booking.bus &&
              booking.bus._id
          );

        // =========================================
        // SAVE BOOKINGS
        // =========================================

        setEventBookings(validEventBookings);
        setBusBookings(validBusBookings);
      } catch (error) {
        console.log(
          "Tickets loading error:",
          error
        );

        setEventBookings([]);
        setBusBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // =========================================
  // CHECK IF USER HAS ANY BOOKINGS
  // =========================================

  const hasBookings =
    eventBookings.length > 0 ||
    busBookings.length > 0;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="tickets-page">
        <div className="tickets-header">
          <p>Book.X</p>

          <h1>My Tickets</h1>

          <span>
            Loading your bookings...
          </span>
        </div>
      </main>
    );
  }

  // =========================================
  // MAIN PAGE
  // =========================================

  return (
    <main className="tickets-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="tickets-header">
        <p>Book.X</p>

        <h1>My Tickets</h1>

        <span>
          View all your event and bus bookings.
        </span>
      </div>

      {/* =====================================
          TICKETS SECTION
      ===================================== */}

      <section className="tickets-section">

        {/* ===================================
            NOT LOGGED IN
        =================================== */}

        {!user ? (
          <div className="no-tickets">

            <h2>Please Login</h2>

            <p>
              Login to see your tickets.
            </p>

            <Link
              to="/login"
              className="primary-btn"
            >
              Login
            </Link>

          </div>

        ) : !hasBookings ? (

          /* =================================
             NO BOOKINGS
          ================================= */

          <div className="no-tickets">

            <h2>No Tickets Yet</h2>

            <p>
              You haven't booked any events or
              buses yet.
            </p>

            <Link
              to="/events"
              className="primary-btn"
            >
              Explore Events
            </Link>

            <br />

            <Link
              to="/buses"
              className="back-booking"
            >
              Book a Bus
            </Link>

          </div>

        ) : (

          /* =================================
             ALL BOOKINGS
          ================================= */

          <div className="tickets-grid">

            {/* =================================
                EVENT TICKETS
            ================================= */}

            {eventBookings.map((booking) => {

              const event = booking.event;

              return (
                <div
                  className="ticket-card"
                  key={booking._id}
                >

                  {/* EVENT IMAGE */}

                  {event?.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="ticket-image"
                    />
                  ) : (
                    <div className="ticket-no-image">
                      Event Image
                    </div>
                  )}

                  <div className="ticket-content">

                    {/* BOOKING TYPE */}

                    <span className="event-category">
                      EVENT BOOKED
                    </span>

                    {/* EVENT NAME */}

                    <h2>
                      {event.title}
                    </h2>

                    {/* DATE */}

                    {event.date && (
                      <p>
                        📅 {event.date}
                      </p>
                    )}

                    {/* TIME */}

                    {event.time && (
                      <p>
                        ⏰ {event.time}
                      </p>
                    )}

                    {/* LOCATION */}

                    {event.location && (
                      <p>
                        📍 {event.location}
                      </p>
                    )}

                    {/* CATEGORY */}

                    {event.category && (
                      <p>
                        🎭 Category:{" "}
                        {event.category}
                      </p>
                    )}

                    {/* CITY */}

                    {event.city && (
                      <p>
                        🏙️ City:{" "}
                        {event.city}
                      </p>
                    )}

                    {/* DESCRIPTION */}

                    {event.description && (
                      <p className="ticket-description">
                        {event.description}
                      </p>
                    )}

                    {/* NUMBER OF TICKETS */}

                    <p>
                      🎟️ Tickets:{" "}
                      {booking.tickets}
                    </p>

                    {/* CUSTOMER NAME */}

                    <p>
                      👤 {booking.name}
                    </p>

                    {/* CUSTOMER EMAIL */}

                    {booking.email && (
                      <p>
                        ✉️ {booking.email}
                      </p>
                    )}

                    {/* TOTAL */}

                    <div className="ticket-total">

                      <span>
                        Total Paid:
                      </span>

                      <strong>
                        Rs.{" "}
                        {Number(
                          booking.totalPrice || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                  </div>
                </div>
              );
            })}

            {/* =================================
                BUS TICKETS
            ================================= */}

            {busBookings.map((booking) => {

              const bus = booking.bus;

              return (
                <div
                  className="ticket-card bus-ticket-card"
                  key={booking._id}
                >

                  {/* BUS IMAGE */}

                  {bus?.image ? (
                    <img
                      src={bus.image}
                      alt={bus.company}
                      className="ticket-image"
                    />
                  ) : (
                    <div className="ticket-no-image">
                      Bus Image
                    </div>
                  )}

                  <div className="ticket-content">

                    {/* BOOKING TYPE */}

                    <span className="event-category">
                      BUS BOOKED
                    </span>

                    {/* COMPANY */}

                    <h2>
                      {bus.company}
                    </h2>

                    {/* BUS NUMBER */}

                    <p>
                      🚌 Bus:{" "}
                      {bus.busNumber}
                    </p>

                    {/* ROUTE */}

                    <p>
                      🛣️{" "}
                      {bus.from} → {bus.to}
                    </p>

                    {/* DATE */}

                    {bus.date && (
                      <p>
                        📅 {bus.date}
                      </p>
                    )}

                    {/* DEPARTURE */}

                    {bus.departure && (
                      <p>
                        ⏰ Departure:{" "}
                        {bus.departure}
                      </p>
                    )}

                    {/* ARRIVAL */}

                    {bus.arrival && (
                      <p>
                        🕐 Arrival:{" "}
                        {bus.arrival}
                      </p>
                    )}

                    {/* DURATION */}

                    {bus.duration && (
                      <p>
                        ⏱️ Duration:{" "}
                        {bus.duration}
                      </p>
                    )}

                    {/* BOARDING */}

                    {bus.boardingPoint && (
                      <p>
                        📍 Boarding:{" "}
                        {bus.boardingPoint}
                      </p>
                    )}

                    {/* DROPPING */}

                    {bus.droppingPoint && (
                      <p>
                        📍 Dropping:{" "}
                        {bus.droppingPoint}
                      </p>
                    )}

                    {/* SEATS */}

                    <p>
                      💺 Seats:{" "}
                      {booking.seats?.length
                        ? booking.seats.join(", ")
                        : "N/A"}
                    </p>

                    {/* PASSENGER */}

                    <p>
                      👤{" "}
                      {booking.passengerName ||
                        "Passenger"}
                    </p>

                    {/* PHONE */}

                    {booking.passengerPhone && (
                      <p>
                        📞{" "}
                        {booking.passengerPhone}
                      </p>
                    )}

                    {/* PAYMENT */}

                    {booking.paymentMethod && (
                      <p>
                        💳 Payment:{" "}
                        {booking.paymentMethod}
                      </p>
                    )}

                    {/* PAYMENT STATUS */}

                    {booking.paymentStatus && (
                      <p>
                        ✓ Status:{" "}
                        {booking.paymentStatus}
                      </p>
                    )}

                    {/* TOTAL */}

                    <div className="ticket-total">

                      <span>
                        Total Paid:
                      </span>

                      <strong>
                        Rs.{" "}
                        {Number(
                          booking.total || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

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

export default MyTickets;