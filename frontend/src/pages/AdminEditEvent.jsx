import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import '../styles/AdminEditEvent.css'
import { authHeader } from "../utils/auth";

function AdminEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // GET EVENT
  useEffect(() => {
    async function getEvent() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/events/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setIsError(true);
          setMessage(
            data.message || "Event not found"
          );
          setLoading(false);
          return;
        }

        setFormData({
          title: data.title || "",
          category: data.category || "",
          city: data.city || "",
          date: data.date || "",
          time: data.time || "",
          location: data.location || "",
          price: data.price || "",
          image: data.image || "",
          description: data.description || ""
        });

        setLoading(false);

      } catch (error) {
        console.log(error);
        setIsError(true);
        setMessage("Cannot connect to server");
        setLoading(false);
      }
    }

    getEvent();
  }, [id]);


  // HANDLE INPUT
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }


  // UPDATE EVENT
  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/events/${id}`,
        {
          method: "PUT",
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
          data.message || "Failed to update event"
        );
        return;
      }

      setIsError(false);
      setMessage(
        "Event updated successfully!"
      );

      setTimeout(() => {
        navigate("/admin-events");
      }, 1000);

    } catch (error) {
      console.log(error);
      setIsError(true);
      setMessage("Cannot connect to server");
    }
  }


  if (loading) {
    return (
      <main className="admin-edit-event">
        <h1>Loading Event...</h1>
      </main>
    );
  }


  return (
    <main className="admin-edit-event">

      <h1>Edit Event</h1>

      <Link to="/admin-events">
        ← Back to Manage Events
      </Link>


      <form onSubmit={handleSubmit}>

        {/* Event Title */}
        <label>Event Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
          required
        />


        {/* Category */}
        <label>Category</label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Category
          </option>

          <option value="Concert">
            Concert
          </option>

          <option value="Sports & Screening">
            Sports & Screening
          </option>

          <option value="Theatre">
            Theatre
          </option>

          <option value="Workshop & Classes">
            Workshop & Classes
          </option>

          <option value="Seminar">
            Seminar
          </option>

          <option value="Art & Crafts">
            Art & Crafts
          </option>

          <option value="Food">
            Food
          </option>

          <option value="Family">
            Family
          </option>

          <option value="Health & Wellness">
            Health & Wellness
          </option>
        </select>


        {/* City */}
        <label>City</label>

        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        >
          <option value="">
            Select City
          </option>

          <option value="Islamabad">
            Islamabad
          </option>

          <option value="Rawalpindi">
            Rawalpindi
          </option>

          <option value="Lahore">
            Lahore
          </option>

          <option value="Karachi">
            Karachi
          </option>

          <option value="Faisalabad">
            Faisalabad
          </option>

          <option value="Multan">
            Multan
          </option>

          <option value="Peshawar">
            Peshawar
          </option>

          <option value="Quetta">
            Quetta
          </option>

          <option value="Sialkot">
            Sialkot
          </option>

          <option value="Gujranwala">
            Gujranwala
          </option>

          <option value="Hyderabad">
            Hyderabad
          </option>

          <option value="Bahawalpur">
            Bahawalpur
          </option>

          <option value="Sargodha">
            Sargodha
          </option>

          <option value="Abbottabad">
            Abbottabad
          </option>

          <option value="Murree">
            Murree
          </option>

          <option value="Gujrat">
            Gujrat
          </option>

          <option value="Mardan">
            Mardan
          </option>

          <option value="Rahim Yar Khan">
            Rahim Yar Khan
          </option>

          <option value="Sukkur">
            Sukkur
          </option>

          <option value="Larkana">
            Larkana
          </option>
        </select>


        {/* Date */}
        <label>Date</label>

        <input
          type="text"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="e.g. 20 Sep 2026"
          required
        />


        {/* Time */}
        <label>Time</label>

        <input
          type="text"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="e.g. 7:00 PM"
          required
        />


        {/* Location */}
        <label>Location</label>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Jinnah Convention Centre"
          required
        />


        {/* Price */}
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


        {/* Image */}
        <label>Image URL</label>

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Enter image URL"
        />


        {/* Description */}
        <label>Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          rows="5"
        ></textarea>


        {/* Update */}
        <button type="submit">
          Update Event
        </button>


        {/* Message */}
        {message && (
          <p className={`form-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}

      </form>

    </main>
  );
}

export default AdminEditEvent;