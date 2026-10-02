import { useState } from "react";
import '../styles/AdminAddEvent.css'
import { authHeader } from "../utils/auth";

function AdminAddEvent() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    city: "",
    date: "",
    time: "",
    location: "",
    price: "",
    image: "",
    description: ""
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader()
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(
          data.message || "Failed to add event"
        );
        return;
      }

      setIsError(false);
      setMessage("Event added successfully!");

      setFormData({
        title: "",
        category: "",
        city: "",
        date: "",
        time: "",
        location: "",
        price: "",
        image: "",
        description: ""
      });

    } catch (error) {
      console.log(error);
      setIsError(true);
      setMessage("Cannot connect to server");
    }
  }

  return (
    <main className="admin-add-event">

      <h1>Add New Event</h1>

      <form onSubmit={handleSubmit}>

        {/* Event Title */}
        <div className="form-group full-width">
          <label>Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Concert">Concert</option>
            <option value="Sports & Screening">Sports & Screening</option>
            <option value="Theatre">Theatre</option>
            <option value="Workshop & Classes">Workshop & Classes</option>
            <option value="Seminar">Seminar</option>
            <option value="Art & Crafts">Art & Crafts</option>
            <option value="Food">Food</option>
            <option value="Family">Family</option>
            <option value="Health & Wellness">Health & Wellness</option>
          </select>
        </div>

        {/* City */}
        <div className="form-group">
          <label>City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Multan">Multan</option>
            <option value="Peshawar">Peshawar</option>
            <option value="Quetta">Quetta</option>
            <option value="Sialkot">Sialkot</option>
            <option value="Gujranwala">Gujranwala</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bahawalpur">Bahawalpur</option>
            <option value="Sargodha">Sargodha</option>
            <option value="Abbottabad">Abbottabad</option>
            <option value="Murree">Murree</option>
            <option value="Gujrat">Gujrat</option>
            <option value="Mardan">Mardan</option>
            <option value="Rahim Yar Khan">Rahim Yar Khan</option>
            <option value="Sukkur">Sukkur</option>
            <option value="Larkana">Larkana</option>
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Date</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="e.g. 20 Sep 2026"
            required
          />
        </div>

        {/* Time */}
        <div className="form-group">
          <label>Time</label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g. 7:00 PM"
            required
          />
        </div>

        {/* Location */}
        <div className="form-group full-width">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Jinnah Convention Centre"
            required
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            placeholder="Enter ticket price"
            required
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows="5"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="form-submit">
          <button type="submit">
            Add Event
          </button>

          {message && (
            <p className={`form-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}
        </div>

      </form>

    </main>
  );
}

export default AdminAddEvent;