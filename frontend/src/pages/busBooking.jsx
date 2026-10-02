import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function BusBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [bookingConfirmed, setBookingConfirmed] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] =
    useState(false);

  // ==========================================
  // GET TODAY'S DATE
  // ==========================================

  const today = useMemo(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      "0"
    );
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  // ==========================================
  // FETCH BUS
  // ==========================================

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

        const savedUser = JSON.parse(
          localStorage.getItem("eventpkUser") || "null"
        );

        if (savedUser) {
          setName(savedUser.name || "");
          setEmail(savedUser.email || "");
        }
      } catch (error) {
        console.error(
          "Bus booking error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBus();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="not-found">
        <h1>Loading...</h1>
      </main>
    );
  }

  // ==========================================
  // BUS NOT FOUND
  // ==========================================

  if (!bus) {
    return (
      <main className="not-found">
        <h1>Bus Not Found</h1>

        <Link
          to="/buses"
          className="primary-btn"
        >
          Back to Buses
        </Link>
      </main>
    );
  }

  // ==========================================
  // SAFE DATA
  // ==========================================

  const unavailableSeats = Array.isArray(
    bus.bookedSeats
  )
    ? bus.bookedSeats
    : [];

  const shifts = Array.isArray(bus.shifts)
    ? bus.shifts
    : [];

  const totalPrice =
    selectedSeats.length *
    Number(bus.price || 0);

  // ==========================================
  // DATE CHANGE
  // ==========================================

  function handleDateChange(e) {
    const date = e.target.value;

    setSelectedDate(date);

    // Reset selected time when date changes
    setSelectedShift(null);
  }

  // ==========================================
  // CONVERT SHIFT TIME TO MINUTES
  // ==========================================

  function convertTimeToMinutes(time) {
    if (!time) {
      return null;
    }

    const cleanTime = time
      .trim()
      .toUpperCase();

    // Example:
    // 08:30 AM
    // 8:30 AM
    // 08:30
    // 20:30

    const match = cleanTime.match(
      /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/
    );

    if (!match) {
      return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3];

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return null;
    }

    if (period === "AM") {
      if (hours === 12) {
        hours = 0;
      }
    }

    if (period === "PM") {
      if (hours !== 12) {
        hours += 12;
      }
    }

    return hours * 60 + minutes;
  }

  // ==========================================
  // CHECK IF SHIFT IS IN THE PAST
  // ==========================================

  function isShiftPast(shift) {
    if (!selectedDate) {
      return false;
    }

    // Future date = all shifts available
    if (selectedDate > today) {
      return false;
    }

    // This date is today
    if (selectedDate === today) {
      const shiftMinutes = convertTimeToMinutes(
        shift.departure
      );

      // If time format cannot be understood,
      // don't disable it.
      if (shiftMinutes === null) {
        return false;
      }

      const now = new Date();

      const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

      return shiftMinutes <= currentMinutes;
    }

    // Date before today
    return true;
  }

  // ==========================================
  // SELECT SHIFT
  // ==========================================

  function handleShiftSelect(shift, index) {
    if (isShiftPast(shift)) {
      return;
    }

    setSelectedShift({
      ...shift,
      index,
    });
  }

  // ==========================================
  // SEAT CLICK
  // ==========================================

  function handleSeatClick(seatNumber) {
    if (unavailableSeats.includes(seatNumber)) {
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat !== seatNumber
        )
      );

      return;
    }

    setSelectedSeats([
      ...selectedSeats,
      seatNumber,
    ]);
  }

  // ==========================================
  // BOOKING
  // ==========================================

  async function handleBooking(e) {
    e.preventDefault();

    // Login check
    if (
      localStorage.getItem("eventpkLoggedIn") !==
      "true"
    ) {
      alert(
        "Please login before booking a bus."
      );

      navigate("/login");

      return;
    }

    // Date check
    if (!selectedDate) {
      alert(
        "Please select a travel date."
      );

      return;
    }

    // Shift check
    if (!selectedShift) {
      alert(
        "Please select a departure time."
      );

      return;
    }

    // Name / email / phone
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      alert(
        "Please fill in all passenger information."
      );

      return;
    }

    // Seat check
    if (selectedSeats.length === 0) {
      alert(
        "Please select at least one seat."
      );

      return;
    }

    // Prevent booking a past time
    if (isShiftPast(selectedShift)) {
      alert(
        "This departure time has already passed. Please select another time."
      );

      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/buses/book`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            busId: bus._id,

            travelDate: selectedDate,

            departure:
              selectedShift.departure,

            arrival:
              selectedShift.arrival,

            duration:
              selectedShift.duration,

            passengerName:
              name.trim(),

            passengerEmail:
              email
                .trim()
                .toLowerCase(),

            passengerPhone:
              phone.trim(),

            seats: selectedSeats,

            total: totalPrice,

            paymentMethod:
              paymentMethod,

            shift: selectedShift
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Bus booking failed."
        );

        return;
      }

      setBookingConfirmed(true);
    } catch (error) {
      console.error(
        "Bus booking error:",
        error
      );

      alert(
        "Cannot connect to the backend."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  // ==========================================
  // SUCCESS PAGE
  // ==========================================

  if (bookingConfirmed) {
    return (
      <main className="bus-booking-page">
        <div className="bus-booking-success">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Bus Booking Confirmed!
          </h1>

          <p>
            Thank you, {name}.
          </p>

          <p>
            Your bus seats have been
            successfully reserved.
          </p>

          <div className="booking-summary">

            <p>
              <strong>Bus:</strong>{" "}
              {bus.company}
            </p>

            <p>
              <strong>Route:</strong>{" "}
              {bus.from} → {bus.to}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {selectedDate}
            </p>

            <p>
              <strong>Departure:</strong>{" "}
              {selectedShift?.departure}
            </p>

            <p>
              <strong>Arrival:</strong>{" "}
              {selectedShift?.arrival}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {selectedShift?.duration}
            </p>

            <p>
              <strong>Seats:</strong>{" "}
              {selectedSeats.join(", ")}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {paymentMethod}
            </p>

            <p>
              <strong>
                Payment Status:
              </strong>{" "}
              Demo Payment
            </p>

            <p>
              <strong>Total:</strong>{" "}
              Rs. {totalPrice}
            </p>

          </div>

          <Link
            to="/my-tickets"
            className="primary-btn"
          >
            View My Tickets
          </Link>

          <br />

          <Link
            to="/buses"
            className="back-booking"
          >
            Book Another Bus
          </Link>

        </div>
      </main>
    );
  }

  // ==========================================
  // BOOKING PAGE
  // ==========================================

  return (
    <main className="bus-booking-page">

      <div className="bus-booking-container">

        {/* ======================================
            LEFT SIDE
        ====================================== */}

        <div className="bus-booking-left">

          <span className="bus-type">
            {bus.type}
          </span>

          <h1>
            {bus.company}
          </h1>

          <p>
            {bus.from} → {bus.to}
          </p>

          {/* ====================================
              SELECT DATE
          ==================================== */}

          <div className="travel-date-section">

            <h2>
              Select Travel Date
            </h2>

            <p>
              Choose the date you want to
              travel.
            </p>

            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={handleDateChange}
              className="travel-date-input"
              required
            />

          </div>

          {/* ====================================
              SELECT SHIFT
          ==================================== */}

          <div className="travel-time-section">

            <h2>
              Select Departure Time
            </h2>

            <p>
              Choose one of the available
              bus shifts.
            </p>

            {!selectedDate && (
              <div className="select-date-message">
                Please select a travel date
                first.
              </div>
            )}

            {selectedDate && shifts.length === 0 && (
              <div className="select-date-message">
                No departure times are
                available for this bus.
              </div>
            )}

            {selectedDate && shifts.length > 0 && (
              <div className="booking-shifts">

                {shifts.map(
                  (shift, index) => {
                    const past =
                      isShiftPast(shift);

                    const selected =
                      selectedShift?.index ===
                      index;

                    return (
                      <button
                        type="button"
                        key={
                          shift._id ||
                          index
                        }
                        className={`booking-shift ${
                          selected
                            ? "selected"
                            : ""
                        } ${
                          past
                            ? "past"
                            : ""
                        }`}
                        disabled={past}
                        onClick={() =>
                          handleShiftSelect(
                            shift,
                            index
                          )
                        }
                      >

                        <strong>
                          Shift {index + 1}
                        </strong>

                        <span>
                          {shift.departure}
                          {" → "}
                          {shift.arrival}
                        </span>

                        <small>
                          Duration:{" "}
                          {shift.duration}
                        </small>

                        {past && (
                          <em>
                            {selectedDate <
                            today
                              ? "Past date"
                              : "Time passed"}
                          </em>
                        )}

                      </button>
                    );
                  }
                )}

              </div>
            )}

            {selectedShift && (
              <div className="selected-shift-box">

                <strong>
                  Selected Trip
                </strong>

                <p>
                  📅 {selectedDate}
                </p>

                <p>
                  ⏰{" "}
                  {selectedShift.departure}
                  {" → "}
                  {selectedShift.arrival}
                </p>

                <p>
                  Duration:{" "}
                  {selectedShift.duration}
                </p>

              </div>
            )}

          </div>

          {/* ====================================
              SEATS
          ==================================== */}

          <div className="seat-section">

            <div className="seat-heading">

              <div>

                <h2>
                  Select Your Seats
                </h2>

                <p>
                  Select your available
                  seats.
                </p>

              </div>

              <div className="seat-legend">

                <span>
                  <i className="legend-available"></i>
                  Available
                </span>

                <span>
                  <i className="legend-selected"></i>
                  Selected
                </span>

                <span>
                  <i className="legend-booked"></i>
                  Booked
                </span>

              </div>

            </div>

            <div className="driver">
              DRIVER
            </div>

            <div className="seats-grid">

              {Array.from(
                {
                  length:
                    Number(bus.seats) || 0,
                },
                (_, index) => {

                  const seatNumber =
                    index + 1;

                  const isBooked =
                    unavailableSeats.includes(
                      seatNumber
                    );

                  const isSelected =
                    selectedSeats.includes(
                      seatNumber
                    );

                  return (
                    <button
                      type="button"
                      key={seatNumber}
                      className={`seat ${
                        isBooked
                          ? "booked"
                          : ""
                      } ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      disabled={
                        isBooked ||
                        !selectedDate ||
                        !selectedShift
                      }
                      onClick={() =>
                        handleSeatClick(
                          seatNumber
                        )
                      }
                    >
                      {seatNumber}
                    </button>
                  );
                }
              )}

            </div>

            {!selectedDate && (
              <p className="seat-warning">
                Select a travel date first.
              </p>
            )}

            {selectedDate &&
              !selectedShift && (
                <p className="seat-warning">
                  Select a departure time
                  before selecting seats.
                </p>
              )}

          </div>

        </div>

        {/* ======================================
            RIGHT SIDE
        ====================================== */}

        <div className="bus-booking-right">

          <h2>
            Passenger Information
          </h2>

          <p className="booking-subtitle">
            Enter your information to
            complete the booking.
          </p>

          <form onSubmit={handleBooking}>

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="03XX-XXXXXXX"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                required
              />

            </div>

            {/* DATE SUMMARY */}

            <div className="selected-seats-box">

              <span>
                Travel Date
              </span>

              <strong>
                {selectedDate ||
                  "Not selected"}
              </strong>

            </div>

            {/* TIME SUMMARY */}

            <div className="selected-seats-box">

              <span>
                Departure
              </span>

              <strong>
                {selectedShift
                  ? `${selectedShift.departure} → ${selectedShift.arrival}`
                  : "Not selected"}
              </strong>

            </div>

            {/* SELECTED SEATS */}

            <div className="selected-seats-box">

              <span>
                Selected Seats
              </span>

              <strong>
                {selectedSeats.length
                  ? selectedSeats.join(
                      ", "
                    )
                  : "None"}
              </strong>

            </div>

            {/* PAYMENT */}

            <div className="form-group">

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
                  Cash on Delivery
                </option>

                <option>
                  Credit / Debit Card
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

            {/* PAYMENT NOTE */}

            <div className="payment-note">

              <strong>
                Payment Information
              </strong>

              <p>
                This is a demo payment
                system. No real payment
                will be processed.
              </p>

            </div>

            {/* TOTAL */}

            <div className="booking-total">

              <span>
                Total Price
              </span>

              <strong>
                Rs. {totalPrice}
              </strong>

            </div>

            {/* BOOKING BUTTON */}

            <button
              type="submit"
              className="primary-btn booking-btn"
              disabled={
                bookingLoading ||
                !selectedDate ||
                !selectedShift ||
                selectedSeats.length === 0
              }
            >
              {bookingLoading
                ? "Booking..."
                : "Confirm Bus Booking"}
            </button>

          </form>

          <Link
            to={`/bus/${bus._id}`}
            className="back-booking"
          >
            ← Back to Bus Details
          </Link>

        </div>

      </div>

    </main>
  );
}

export default BusBooking;