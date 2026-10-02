const mongoose = require("mongoose");

const busBookingSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },

    travelDate: {
      type: String,
      required: true
    },

    // Customer's selected shift
    shift: {
      departure: {
        type: String,
        required: true
      },

      arrival: {
        type: String,
        required: true
      },

      duration: {
        type: String,
        required: true
      }
    },

    passengerName: {
      type: String,
      required: true
    },

    passengerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    passengerPhone: {
      type: String,
      required: true
    },

    seats: {
      type: [Number],
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      required: true
    },

    paymentStatus: {
      type: String,
      default: "Demo Payment"
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "BusBooking",
  busBookingSchema
);