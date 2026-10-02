
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/eventPages.css";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  const [tickets, setTickets] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Event");

  const [bookingConfirmed, setBookingConfirmed] =
    useState(false);

  const [bookingError, setBookingError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(false);

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

        const savedUser = JSON.parse(
          localStorage.getItem("eventpkUser") || "null"
        );

        if (savedUser) {
          setName(savedUser.name || "");
          setEmail(savedUser.email || "");
        }

      })
      .catch((error) => {

        console.log(
          "Event Booking Error:",
          error
        );

      })
      .finally(() => {

        setLoading(false);

      });

  }, [id]);

  const totalPrice = event
    ? tickets * event.price
    : 0;

  async function handleBooking(e) {

    e.preventDefault();

    setBookingError("");

    const loggedIn =
      localStorage.getItem(
        "eventpkLoggedIn"
      ) === "true";

    const savedUser = JSON.parse(
      localStorage.getItem("eventpkUser") || "null"
    );

    if (!loggedIn || !savedUser) {

      setBookingError(
        "Please login before booking a ticket."
      );

      navigate("/login");

      return;
    }

    if (!name.trim() || !email.trim()) {

      setBookingError(
        "Please enter your name and email."
      );

      return;
    }

    if (tickets < 1) {

      setBookingError(
        "Please select at least 1 ticket."
      );

      return;
    }

    try {

      setBookingLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            eventId: event._id,
            name: name.trim(),
            email: email
              .trim()
              .toLowerCase(),
            tickets: tickets,
            totalPrice: totalPrice
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Booking failed."
        );

      }

      console.log(
        "Event Booking Successful:",
        data
      );

      setBookingConfirmed(true);

    } catch (error) {

      console.log(
        "Event Booking Error:",
        error
      );

      setBookingError(
        error.message ||
        "Unable to complete booking."
      );

    } finally {

      setBookingLoading(false);

    }
  }

  if (loading) {

    return (
      <main className="event-booking-page">

        <div className="event-booking-loading">

          <h1>
            Loading Event...
          </h1>

          <p>
            Please wait.
          </p>

        </div>

      </main>
    );
  }

  if (!event) {

    return (
      <main className="event-booking-page">

        <div className="event-booking-loading">

          <h1>
            Event Not Found
          </h1>

          <Link
            to="/events"
            className="event-primary-btn"
          >
            Back to Events
          </Link>

        </div>

      </main>
    );
  }

  {/* BOOKING SUCCESS */}

  if (bookingConfirmed) {

    return (
      <main className="event-booking-page">

        <div className="event-success-card">

          <div className="event-success-icon">
            ✓
          </div>

          <h1>
            Booking Confirmed!
          </h1>

          <p>
            Thank you, {name}.
          </p>

          <p>
            Your event tickets have
            been successfully booked.
          </p>

          <div className="event-booking-summary">

            <p>
              <strong>Event:</strong>{" "}
              {event.title}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {event.date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {event.time}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {event.location}
            </p>

            <p>
              <strong>Tickets:</strong>{" "}
              {tickets}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {paymentMethod}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              Demo Payment
            </p>

            <p>
              <strong>Total:</strong>{" "}
              Rs. {totalPrice}
            </p>

          </div>

          <Link
            to="/my-tickets"
            className="event-primary-btn"
          >
            View My Tickets
          </Link>

          <br />

          <Link
            to="/events"
            className="event-back-link"
          >
            Book Another Event
          </Link>

        </div>

      </main>
    );
  }

  const loggedIn =
    localStorage.getItem(
      "eventpkLoggedIn"
    ) === "true";

  const savedUser = JSON.parse(
    localStorage.getItem("eventpkUser") || "null"
  );

  return (
    <main className="event-booking-page">

      <div className="event-booking-container">

        {/* LEFT SIDE */}

        <div className="event-booking-left">

          <div className="event-booking-image">

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

          <span className="event-type">
            {event.category}
          </span>

          <h1>
            {event.title}
          </h1>

          <p>
            📅 {event.date}
          </p>

          <p>
            ⏰ {event.time}
          </p>

          <p>
            📍 {event.location}
          </p>

          <p>
            🏙️ {event.city}
          </p>

          <div className="event-ticket-price">

            <span>
              Ticket Price
            </span>

            <strong>
              Rs. {event.price}
            </strong>

            <small>
              per ticket
            </small>

          </div>

          <div className="event-booking-description">

            <h2>
              About This Event
            </h2>

            <p>
              {event.description ||
                "Join us for this exciting event and enjoy an unforgettable experience."}
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="event-booking-right">

          <h2>
            Ticket Information
          </h2>

          <p className="event-booking-subtitle">
            Enter your information to
            complete the booking.
          </p>

          {!loggedIn || !savedUser ? (

            <div className="event-login-required">

              <h2>
                Login Required
              </h2>

              <p>
                You must login before
                booking an event ticket.
              </p>

              <Link
                to="/login"
                className="event-primary-btn"
              >
                Login to Book
              </Link>

            </div>

          ) : (

            <form
              onSubmit={handleBooking}
              className="event-booking-form"
            >

              <div className="event-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                  required
                />

              </div>

              <div className="event-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  required
                />

              </div>

              <div className="event-form-group">

                <label>
                  Number of Tickets
                </label>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tickets}
                  onChange={(e) =>
                    setTickets(
                      Math.max(
                        1,
                        Number(e.target.value)
                      )
                    )
                  }
                  required
                />

              </div>

              <div className="event-selected-box">

                <span>
                  Selected Tickets
                </span>

                <strong>
                  {tickets}
                </strong>

              </div>

              <div className="event-form-group">

                <label>
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                >

                  <option>
                    Cash on Event
                  </option>

                  <option>
                    JazzCash
                  </option>

                  <option>
                    Easypaisa
                  </option>

                  <option>
                    Bank Transfer
                  </option>

                </select>

              </div>

              <div className="event-payment-note">

                <strong>
                  Payment Information
                </strong>

                <p>
                  This is a demo payment
                  system. No real payment
                  will be processed.
                </p>

              </div>

              {bookingError && (

                <div className="event-booking-error">
                  {bookingError}
                </div>

              )}

              <div className="event-total">

                <span>
                  Total Price
                </span>

                <strong>
                  Rs. {totalPrice}
                </strong>

              </div>

              <button
                type="submit"
                className="event-primary-btn event-confirm-btn"
                disabled={bookingLoading}
              >

                {bookingLoading
                  ? "Booking..."
                  : "Confirm Booking"}

              </button>

            </form>

          )}

          <Link
            to={`/event/${event._id}`}
            className="event-back-link"
          >
            ← Back to Event Details
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Booking;