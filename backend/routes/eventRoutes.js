const express = require("express");
const mongoose = require("mongoose");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();


// GET ALL EVENTS
router.get("/", async (req, res) => {
    try {
        console.log("Fetching events...");

        const events = await mongoose.connection
            .db
            .collection("events")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        console.log("Events found:", events.length);

        res.json(events);

    } catch (error) {
        console.log("EVENT ERROR:", error.message);

        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
});


// ADD NEW EVENT (admin only)
router.post("/", requireAdmin, async (req, res) => {
    try {
        const {
            title,
            category,
            city,
            date,
            time,
            location,
            price,
            image,
            description
        } = req.body;

        if (
            !title ||
            !category ||
            !city ||
            !date ||
            !time ||
            !location ||
            price === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all required event information"
            });
        }

        const newEvent = {
            title: title.trim(),
            category: category.trim(),
            city: city.trim(),
            date: date.trim(),
            time: time.trim(),
            location: location.trim(),
            price: Number(price),
            image: image ? image.trim() : "",
            description: description
                ? description.trim()
                : "",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await mongoose.connection
            .db
            .collection("events")
            .insertOne(newEvent);

        res.status(201).json({
            message: "Event added successfully",
            event: {
                _id: result.insertedId,
                ...newEvent
            }
        });

    } catch (error) {
        console.log("ADD EVENT ERROR:", error.message);

        res.status(500).json({
            message: "Failed to add event",
            error: error.message
        });
    }
});


// UPDATE EVENT (admin only)
router.put("/:id", requireAdmin, async (req, res) => {
    try {
        const {
            title,
            category,
            city,
            date,
            time,
            location,
            price,
            image,
            description
        } = req.body;

        const updatedEvent = {
            title: title.trim(),
            category: category.trim(),
            city: city.trim(),
            date: date.trim(),
            time: time.trim(),
            location: location.trim(),
            price: Number(price),
            image: image ? image.trim() : "",
            description: description
                ? description.trim()
                : "",
            updatedAt: new Date()
        };

        const result = await mongoose.connection
            .db
            .collection("events")
            .updateOne(
                {
                    _id: new mongoose.Types.ObjectId(req.params.id)
                },
                {
                    $set: updatedEvent
                }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event updated successfully"
        });

    } catch (error) {
        console.log("UPDATE EVENT ERROR:", error.message);

        res.status(500).json({
            message: "Failed to update event",
            error: error.message
        });
    }
});


// DELETE EVENT (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
    try {

        const result = await mongoose.connection
            .db
            .collection("events")
            .deleteOne({
                _id: new mongoose.Types.ObjectId(req.params.id)
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.log("DELETE EVENT ERROR:", error.message);

        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
});


// GET SINGLE EVENT
router.get("/:id", async (req, res) => {
    try {
        const event = await mongoose.connection
            .db
            .collection("events")
            .findOne({
                _id: new mongoose.Types.ObjectId(req.params.id)
            });

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json(event);

    } catch (error) {
        console.log("SINGLE EVENT ERROR:", error.message);

        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
});


module.exports = router;