const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true
    },

    busNumber: {
      type: String,
      required: true,
      unique: true
    },

    from: {
      type: String,
      required: true
    },

    to: {
      type: String,
      required: true
    },

    // Multiple departure shifts
    shifts: {
      type: [
        {
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
        }
      ],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    seats: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    boardingPoint: {
      type: String,
      required: true
    },

    droppingPoint: {
      type: String,
      required: true
    },

    amenities: {
      type: [String],
      default: []
    },

    image: {
      type: String,
      default: ""
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Bus", busSchema);