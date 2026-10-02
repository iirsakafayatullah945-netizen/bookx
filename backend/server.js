const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");

const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");

const app = express();

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Book.X Backend is Working!"
    });
});

app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        console.log("MongoDB readyState:", mongoose.connection.readyState);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Server stopped because MongoDB could not connect.");
        process.exit(1);
    }
};

startServer();