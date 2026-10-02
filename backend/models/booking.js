const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    tickets: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
