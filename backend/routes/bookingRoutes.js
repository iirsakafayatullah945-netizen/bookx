const express = require("express");
const Booking = require("../models/booking");
const Event = require("../models/Event");

const router = express.Router();


// ===============================
// CREATE EVENT BOOKING
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      eventId,
      name,
      email,
      tickets,
      totalPrice
    } = req.body;

    if (
      !eventId ||
      !name ||
      !email ||
      !tickets ||
      totalPrice === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all booking information"
      });
    }

    if (Number(tickets) < 1) {
      return res.status(400).json({
        message: "At least 1 ticket is required"
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const booking = await Booking.create({
      eventId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      tickets: Number(tickets),
      totalPrice: Number(totalPrice)
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.log("Event Booking Error:", error);

    res.status(500).json({
      message: "Failed to create booking",
      error: error.message
    });
  }
});


// ===============================
// GET USER EVENT BOOKINGS
// ===============================
router.get("/user/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email)
      .trim()
      .toLowerCase();

    const bookings = await Booking.find({
      email: email
    }).populate("eventId");

    res.json(bookings);

  } catch (error) {
    console.log("User Event Bookings Error:", error);

    res.status(500).json({
      message: "Failed to fetch user bookings",
      error: error.message
    });
  }
});


// ===============================
// GET ALL EVENT BOOKINGS
// ===============================
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("eventId");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message
    });
  }
});


module.exports = router;