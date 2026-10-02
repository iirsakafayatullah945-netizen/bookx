const mongoose = require("mongoose");
require("dotenv").config();

const Bus = require("./models/Bus");

const buses = [
  {
    company: "Daewoo Express",
    busNumber: "DW-101",
    from: "Islamabad",
    to: "Lahore",

    shifts: [
      {
        departure: "08:00 AM",
        arrival: "02:30 PM",
        duration: "6h 30m"
      },
      {
        departure: "11:00 AM",
        arrival: "05:30 PM",
        duration: "6h 30m"
      },
      {
        departure: "02:00 PM",
        arrival: "08:30 PM",
        duration: "6h 30m"
      },
      {
        departure: "06:00 PM",
        arrival: "12:30 AM",
        duration: "6h 30m"
      }
    ],

    price: 2500,
    seats: 40,
    type: "Luxury Bus",
    boardingPoint: "Faizabad Bus Terminal, Islamabad",
    droppingPoint: "Thokar Niaz Baig, Lahore",

    amenities: [
      "Air Conditioning",
      "WiFi",
      "Charging Port",
      "Comfortable Seats"
    ],

    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80"
  }
];
async function importBuses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const bus of buses) {
      await Bus.findOneAndUpdate(
        { busNumber: bus.busNumber },
        bus,
        {
          upsert: true,
          new: true
        }
      );
    }

    console.log(
      `${buses.length} buses imported/updated successfully`
    );

    await mongoose.disconnect();

    console.log("MongoDB disconnected");

  } catch (error) {
    console.log("Bus import failed:");
    console.log(error.message);
  }
}

importBuses();