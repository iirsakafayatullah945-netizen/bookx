import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminAddBus.css";
import { authHeader } from "../utils/auth";

function AdminAddBus() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    busNumber: "",
    from: "",
    to: "",
    price: "",
    seats: "",
    type: "",
    boardingPoint: "",
    droppingPoint: "",
    amenities: "",
    image: "",
  });

  const [shifts, setShifts] = useState([
    {
      departure: "",
      arrival: "",
      duration: "",
    },
    {
      departure: "",
      arrival: "",
      duration: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleShiftChange(index, e) {
    const { name, value } = e.target;

    setShifts((prev) =>
      prev.map((shift, i) =>
        i === index
          ? {
              ...shift,
              [name]: value,
            }
          : shift
      )
    );
  }

  function addShift() {
    if (shifts.length >= 4) {
      alert("Maximum 4 shifts are allowed.");
      return;
    }

    setShifts((prev) => [
      ...prev,
      {
        departure: "",
        arrival: "",
        duration: "",
      },
    ]);
  }

  function removeShift(index) {
    if (shifts.length <= 2) {
      alert("At least 2 shifts are required.");
      return;
    }

    setShifts((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const invalidShift = shifts.some(
      (shift) =>
        !shift.departure.trim() ||
        !shift.arrival.trim() ||
        !shift.duration.trim()
    );

    if (invalidShift) {
      alert(
        "Please fill Departure, Arrival and Duration for every shift."
      );
      return;
    }

    setLoading(true);

    try {
      const busData = {
        company: formData.company.trim(),
        busNumber: formData.busNumber.trim(),
        from: formData.from.trim(),
        to: formData.to.trim(),

        shifts: shifts.map((shift) => ({
          departure: shift.departure.trim(),
          arrival: shift.arrival.trim(),
          duration: shift.duration.trim(),
        })),

        price: Number(formData.price),
        seats: Number(formData.seats),

        type: formData.type.trim(),

        boardingPoint: formData.boardingPoint.trim(),
        droppingPoint: formData.droppingPoint.trim(),

        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        image: formData.image.trim(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/buses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(busData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add bus"
        );
      }

      alert("Bus added successfully!");
      navigate("/admin-buses");
    } catch (error) {
      console.error("Add bus error:", error);
      alert(error.message || "Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-add-bus">
      <h1>Add New Bus</h1>

      <Link to="/admin-dashboard">
        ← Back to Dashboard
      </Link>

      <form onSubmit={handleSubmit}>

        {/* Company */}
        <div className="form-group">
          <label>Bus Company</label>

          <input
            type="text"
            name="company"
            placeholder="e.g. Daewoo Express"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        {/* Bus Number */}
        <div className="form-group">
          <label>Bus Number</label>

          <input
            type="text"
            name="busNumber"
            placeholder="e.g. DW-101"
            value={formData.busNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* From */}
        <div className="form-group">
          <label>From</label>

          <input
            type="text"
            name="from"
            placeholder="e.g. Islamabad"
            value={formData.from}
            onChange={handleChange}
            required
          />
        </div>

        {/* To */}
        <div className="form-group">
          <label>To</label>

          <input
            type="text"
            name="to"
            placeholder="e.g. Lahore"
            value={formData.to}
            onChange={handleChange}
            required
          />
        </div>

        {/* Shifts */}
        <div className="bus-shifts-section">
          <h2>Bus Shifts</h2>

          <p>
            Add 2 to 4 departure shifts for this bus.
          </p>

          <div className="bus-shifts-list">
            {shifts.map((shift, index) => (
              <div
                key={index}
                className="bus-shift"
              >
                <h3>
                  Shift {index + 1}
                </h3>

                {/* Departure */}
                <div className="form-group">
                  <label>Departure Time</label>

                  <input
                    type="text"
                    name="departure"
                    placeholder="e.g. 08:00 AM"
                    value={shift.departure}
                    onChange={(e) =>
                      handleShiftChange(index, e)
                    }
                    required
                  />
                </div>

                {/* Arrival */}
                <div className="form-group">
                  <label>Arrival Time</label>

                  <input
                    type="text"
                    name="arrival"
                    placeholder="e.g. 02:30 PM"
                    value={shift.arrival}
                    onChange={(e) =>
                      handleShiftChange(index, e)
                    }
                    required
                  />
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label>Duration</label>

                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 6h 30m"
                    value={shift.duration}
                    onChange={(e) =>
                      handleShiftChange(index, e)
                    }
                    required
                  />
                </div>

                {shifts.length > 2 && (
                  <button
                    type="button"
                    className="remove-shift-btn"
                    onClick={() => removeShift(index)}
                  >
                    Remove Shift
                  </button>
                )}
              </div>
            ))}
          </div>

          {shifts.length < 4 && (
            <button
              type="button"
              className="add-shift-btn"
              onClick={addShift}
            >
              + Add Another Shift
            </button>
          )}
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Ticket Price</label>

          <input
            type="number"
            name="price"
            placeholder="e.g. 2500"
            value={formData.price}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        {/* Seats */}
        <div className="form-group">
          <label>Total Seats</label>

          <input
            type="number"
            name="seats"
            placeholder="e.g. 40"
            value={formData.seats}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        {/* Type */}
        <div className="form-group">
          <label>Bus Type</label>

          <input
            type="text"
            name="type"
            placeholder="e.g. Executive"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        {/* Boarding */}
        <div className="form-group">
          <label>Boarding Point</label>

          <input
            type="text"
            name="boardingPoint"
            placeholder="e.g. Faizabad Terminal"
            value={formData.boardingPoint}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dropping */}
        <div className="form-group">
          <label>Dropping Point</label>

          <input
            type="text"
            name="droppingPoint"
            placeholder="e.g. Thokar Niaz Baig"
            value={formData.droppingPoint}
            onChange={handleChange}
            required
          />
        </div>

        {/* Amenities */}
        <div className="form-group full-width">
          <label>Amenities</label>

          <input
            type="text"
            name="amenities"
            placeholder="WiFi, AC, Water, Charging"
            value={formData.amenities}
            onChange={handleChange}
          />

          <small>
            Separate amenities with commas.
          </small>
        </div>

        {/* Image */}
        <div className="form-group full-width">
          <label>Bus Image URL</label>

          <input
            type="text"
            name="image"
            placeholder="Paste bus image URL"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Adding Bus..." : "Add Bus"}
        </button>

      </form>
    </main>
  );
}

export default AdminAddBus;