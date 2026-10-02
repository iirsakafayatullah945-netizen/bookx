import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import '../styles/AdminEditBus.css'
import { authHeader } from "../utils/auth";

function AdminEditBus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [company, setCompany] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [shifts, setShifts] = useState([]);

  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [type, setType] = useState("");
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [amenities, setAmenities] = useState("");
  const [image, setImage] = useState("");

  async function getBus() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/buses/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setCompany(data.company || "");
        setBusNumber(data.busNumber || "");
        setFrom(data.from || "");
        setTo(data.to || "");

        setShifts(
          data.shifts && data.shifts.length > 0
            ? data.shifts.map((shift) => ({
                departure: shift.departure || "",
                arrival: shift.arrival || "",
                duration: shift.duration || ""
              }))
            : [
                {
                  departure: "",
                  arrival: "",
                  duration: ""
                },
                {
                  departure: "",
                  arrival: "",
                  duration: ""
                }
              ]
        );

        setPrice(data.price ?? "");
        setSeats(data.seats ?? "");
        setType(data.type || "");
        setBoardingPoint(data.boardingPoint || "");
        setDroppingPoint(data.droppingPoint || "");

        setAmenities(
          data.amenities &&
          data.amenities.length > 0
            ? data.amenities.join(", ")
            : ""
        );

        setImage(data.image || "");

      } else {
        alert(
          data.message ||
          "Failed to load bus"
        );
      }

    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend");
    }

    setLoading(false);
  }

  useEffect(() => {
    getBus();
  }, [id]);


  // ==========================================
  // CHANGE SHIFT
  // ==========================================

  function handleShiftChange(index, field, value) {
    const updatedShifts = [...shifts];

    updatedShifts[index] = {
      ...updatedShifts[index],
      [field]: value
    };

    setShifts(updatedShifts);
  }


  // ==========================================
  // ADD SHIFT
  // ==========================================

  function addShift() {
    if (shifts.length >= 4) {
      alert("Maximum 4 shifts are allowed.");
      return;
    }

    setShifts([
      ...shifts,
      {
        departure: "",
        arrival: "",
        duration: ""
      }
    ]);
  }


  // ==========================================
  // REMOVE SHIFT
  // ==========================================

  function removeShift(index) {
    if (shifts.length <= 2) {
      alert("At least 2 shifts are required.");
      return;
    }

    const updatedShifts = shifts.filter(
      (_, shiftIndex) =>
        shiftIndex !== index
    );

    setShifts(updatedShifts);
  }


  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    // Check shifts

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

    setSubmitting(true);


    const busData = {
      company: company.trim(),

      busNumber: busNumber.trim(),

      from: from.trim(),

      to: to.trim(),

      shifts: shifts.map((shift) => ({
        departure: shift.departure.trim(),
        arrival: shift.arrival.trim(),
        duration: shift.duration.trim()
      })),

      price: Number(price),

      seats: Number(seats),

      type: type.trim(),

      boardingPoint:
        boardingPoint.trim(),

      droppingPoint:
        droppingPoint.trim(),

      amenities: amenities
        ? amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      image: image.trim()
    };


    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/buses/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            ...authHeader()
          },

          body: JSON.stringify(busData)
        }
      );


      const data =
        await response.json();


      if (response.ok) {

        alert(
          "Bus updated successfully!"
        );

        navigate("/admin-buses");

      } else {

        alert(
          data.message ||
          "Failed to update bus"
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Cannot connect to backend"
      );
    }


    setSubmitting(false);
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="admin-edit-bus">
        <h1>Edit Bus</h1>
        <p>Loading bus...</p>
      </main>
    );
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="admin-edit-bus">

      <h1>Edit Bus</h1>

      <Link to="/admin-buses">
        ← Back to Manage Buses
      </Link>


      <form onSubmit={handleSubmit}>

        {/* Company */}
        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) =>
              setCompany(e.target.value)
            }
            required
          />
        </div>


        {/* Bus Number */}
        <div className="form-group">
          <label>Bus Number</label>
          <input
            type="text"
            value={busNumber}
            onChange={(e) =>
              setBusNumber(e.target.value)
            }
            required
          />
        </div>


        {/* From */}
        <div className="form-group">
          <label>From</label>
          <input
            type="text"
            value={from}
            onChange={(e) =>
              setFrom(e.target.value)
            }
            required
          />
        </div>


        {/* To */}
        <div className="form-group">
          <label>To</label>
          <input
            type="text"
            value={to}
            onChange={(e) =>
              setTo(e.target.value)
            }
            required
          />
        </div>


        {/* ================================= */}
        {/* SHIFTS */}
        {/* ================================= */}

        <div className="bus-shifts-section">

          <h2>Bus Shifts</h2>

          <p>
            A bus can have 2 to 4 departure shifts.
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
                  <label>Departure</label>
                  <input
                    type="text"
                    value={shift.departure}
                    onChange={(e) =>
                      handleShiftChange(
                        index,
                        "departure",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 08:00 AM"
                    required
                  />
                </div>

                {/* Arrival */}
                <div className="form-group">
                  <label>Arrival</label>
                  <input
                    type="text"
                    value={shift.arrival}
                    onChange={(e) =>
                      handleShiftChange(
                        index,
                        "arrival",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 02:30 PM"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={shift.duration}
                    onChange={(e) =>
                      handleShiftChange(
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 6h 30m"
                    required
                  />
                </div>

                {/* Remove */}
                {shifts.length > 2 && (
                  <button
                    type="button"
                    className="remove-shift-btn"
                    onClick={() =>
                      removeShift(index)
                    }
                  >
                    Remove Shift
                  </button>
                )}

              </div>

            ))}
          </div>

          {/* Add Shift */}
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
          <label>Price (Rs.)</label>
          <input
            type="number"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            min="1"
            required
          />
        </div>


        {/* Seats */}
        <div className="form-group">
          <label>Total Seats</label>
          <input
            type="number"
            value={seats}
            onChange={(e) =>
              setSeats(e.target.value)
            }
            min="1"
            required
          />
        </div>


        {/* Type */}
        <div className="form-group">
          <label>Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            required
          />
        </div>


        {/* Boarding */}
        <div className="form-group">
          <label>Boarding Point</label>
          <input
            type="text"
            value={boardingPoint}
            onChange={(e) =>
              setBoardingPoint(
                e.target.value
              )
            }
            required
          />
        </div>


        {/* Dropping */}
        <div className="form-group">
          <label>Dropping Point</label>
          <input
            type="text"
            value={droppingPoint}
            onChange={(e) =>
              setDroppingPoint(
                e.target.value
              )
            }
            required
          />
        </div>


        {/* Amenities */}
        <div className="form-group full-width">
          <label>Amenities (comma separated)</label>
          <input
            type="text"
            value={amenities}
            onChange={(e) =>
              setAmenities(
                e.target.value
              )
            }
            placeholder="WiFi, AC, Charging Port"
          />
        </div>


        {/* Image */}
        <div className="form-group full-width">
          <label>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          />
        </div>

        {image && (
          <div className="image-preview">
            <img
              src={image}
              alt={company}
            />
          </div>
        )}


        {/* Submit */}
        <button
          type="submit"
          className="submit-btn"
          disabled={submitting}
        >
          {submitting
            ? "Updating..."
            : "Update Bus"}
        </button>

      </form>

    </main>
  );
}

export default AdminEditBus;