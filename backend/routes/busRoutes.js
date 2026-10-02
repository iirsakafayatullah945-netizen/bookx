const express = require("express");
const mongoose = require("mongoose");

const Bus = require("../models/Bus");
const BusBooking = require("../models/BusBooking");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();


// =====================================================
// GET ALL BUSES
// =====================================================

router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find().sort({
      createdAt: -1
    });

    res.json(buses);

  } catch (error) {
    console.log("GET BUSES ERROR:", error.message);

    res.status(500).json({
      message: "Failed to fetch buses",
      error: error.message
    });
  }
});


// =====================================================
// ADD NEW BUS (admin only)
// =====================================================

router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      company,
      busNumber,
      from,
      to,
      shifts,
      price,
      seats,
      type,
      boardingPoint,
      droppingPoint,
      amenities,
      image
    } = req.body;


    // Check required information

    if (
      !company ||
      !busNumber ||
      !from ||
      !to ||
      !Array.isArray(shifts) ||
      shifts.length === 0 ||
      price === undefined ||
      seats === undefined ||
      !type ||
      !boardingPoint ||
      !droppingPoint
    ) {
      return res.status(400).json({
        message:
          "Please provide all required bus information"
      });
    }


    // Maximum 4 shifts

    if (shifts.length > 4) {
      return res.status(400).json({
        message:
          "A bus can have maximum 4 shifts"
      });
    }


    // Check every shift

    for (const shift of shifts) {
      if (
        !shift.departure ||
        !shift.arrival ||
        !shift.duration
      ) {
        return res.status(400).json({
          message:
            "Each shift must have departure, arrival and duration"
        });
      }
    }


    // Check duplicate bus number

    const existingBus = await Bus.findOne({
      busNumber: busNumber.trim()
    });

    if (existingBus) {
      return res.status(400).json({
        message:
          "A bus with this bus number already exists"
      });
    }


    // Create bus

    const bus = await Bus.create({
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

      boardingPoint: boardingPoint.trim(),

      droppingPoint: droppingPoint.trim(),

      amenities: Array.isArray(amenities)
        ? amenities
        : [],

      image: image
        ? image.trim()
        : ""
    });


    res.status(201).json({
      message: "Bus added successfully",
      bus
    });

  } catch (error) {
    console.log("ADD BUS ERROR:", error.message);

    res.status(500).json({
      message: "Failed to add bus",
      error: error.message
    });
  }
});


// =====================================================
// GET USER BUS BOOKINGS
// =====================================================

router.get(
  "/bookings/user/:email",
  async (req, res) => {
    try {

      const email = decodeURIComponent(
        req.params.email
      )
        .trim()
        .toLowerCase();


      const bookings =
        await BusBooking.find({
          passengerEmail: email
        })
          .populate("busId")
          .sort({
            createdAt: -1
          });


      res.json(bookings);

    } catch (error) {

      console.log(
        "USER BUS BOOKINGS ERROR:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch user bus bookings",
        error: error.message
      });
    }
  }
);


// =====================================================
// GET ALL BUS BOOKINGS
// =====================================================

router.get(
  "/bookings/all",
  async (req, res) => {
    try {

      const bookings =
        await BusBooking.find()
          .populate("busId")
          .sort({
            createdAt: -1
          });


      res.json(bookings);

    } catch (error) {

      console.log(
        "ALL BUS BOOKINGS ERROR:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch bus bookings",
        error: error.message
      });
    }
  }
);


// =====================================================
// BOOK BUS
// =====================================================

router.post("/book", async (req, res) => {
  try {

    const {
      busId,
      travelDate,
      shift,
      passengerName,
      passengerEmail,
      passengerPhone,
      seats,
      total,
      paymentMethod
    } = req.body;


    // Check required information

    if (
      !busId ||
      !travelDate ||
      !shift ||
      !shift.departure ||
      !shift.arrival ||
      !shift.duration ||
      !passengerName ||
      !passengerEmail ||
      !passengerPhone ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      total === undefined ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message:
          "Please provide all booking information"
      });
    }


    // Check bus ID

    if (
      !mongoose.Types.ObjectId.isValid(busId)
    ) {
      return res.status(400).json({
        message: "Invalid bus ID"
      });
    }


    // Check travel date

    const selectedDate =
      new Date(`${travelDate}T00:00:00`);

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    if (
      isNaN(selectedDate.getTime()) ||
      selectedDate < today
    ) {
      return res.status(400).json({
        message:
          "Please select a valid future travel date"
      });
    }


    // Find bus

    const bus =
      await Bus.findById(busId);


    if (!bus) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }


    // Check selected shift exists

    const selectedShift =
      bus.shifts.find(
        (busShift) =>
          busShift.departure ===
            shift.departure &&
          busShift.arrival ===
            shift.arrival &&
          busShift.duration ===
            shift.duration
      );


    if (!selectedShift) {
      return res.status(400).json({
        message:
          "Selected bus shift is not available"
      });
    }


    // Convert seats to numbers

    const selectedSeats =
      seats.map(Number);


    // Check duplicate seats

    const uniqueSeats =
      new Set(selectedSeats);


    if (
      uniqueSeats.size !==
      selectedSeats.length
    ) {
      return res.status(400).json({
        message:
          "You cannot select the same seat twice"
      });
    }


    // Check seat numbers

    const invalidSeat =
      selectedSeats.some(
        (seat) =>
          !Number.isInteger(seat) ||
          seat < 1 ||
          seat > bus.seats
      );


    if (invalidSeat) {
      return res.status(400).json({
        message:
          "One or more selected seats are invalid"
      });
    }


    // =================================================
    // IMPORTANT:
    // SEATS ARE CHECKED BY:
    //
    // BUS + DATE + SHIFT
    // =================================================

    const existingBookings =
      await BusBooking.find({
        busId: bus._id,

        travelDate: travelDate,

        "shift.departure":
          selectedShift.departure,

        "shift.arrival":
          selectedShift.arrival,

        "shift.duration":
          selectedShift.duration
      });


    // Collect booked seats

    const bookedSeats =
      existingBookings.flatMap(
        (booking) =>
          booking.seats
      );


    // Check overlapping seats

    const alreadyBooked =
      selectedSeats.filter(
        (seat) =>
          bookedSeats.includes(seat)
      );


    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message:
          `Seat(s) ${alreadyBooked.join(
            ", "
          )} are already booked for ${travelDate} at ${selectedShift.departure}`
      });
    }


    // Create booking

    const booking =
      await BusBooking.create({

        busId: bus._id,

        travelDate: travelDate,

        shift: {
          departure:
            selectedShift.departure,

          arrival:
            selectedShift.arrival,

          duration:
            selectedShift.duration
        },

        passengerName:
          passengerName.trim(),

        passengerEmail:
          passengerEmail
            .trim()
            .toLowerCase(),

        passengerPhone:
          passengerPhone.trim(),

        seats:
          selectedSeats,

        total:
          Number(total),

        paymentMethod:
          paymentMethod,

        paymentStatus:
          "Demo Payment"
      });


    res.status(201).json({
      message:
        "Bus booking created successfully",

      booking
    });

  } catch (error) {

    console.log(
      "BUS BOOKING ERROR:",
      error.message
    );

    res.status(500).json({
      message:
        "Failed to create bus booking",

      error:
        error.message
    });
  }
});


// =====================================================
// GET BOOKED SEATS
// BUS + DATE + SHIFT
// =====================================================

router.get(
  "/:id/booked-seats",
  async (req, res) => {
    try {

      const { id } =
        req.params;

      const {
        date,
        departure,
        arrival,
        duration
      } = req.query;


      // Check bus ID

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          message:
            "Invalid bus ID"
        });
      }


      // Check date

      if (!date) {
        return res.status(400).json({
          message:
            "Please provide a travel date"
        });
      }


      // Check shift

      if (
        !departure ||
        !arrival ||
        !duration
      ) {
        return res.status(400).json({
          message:
            "Please provide the selected shift"
        });
      }


      // Find bookings for:
      //
      // BUS + DATE + SHIFT

      const bookings =
        await BusBooking.find({

          busId: id,

          travelDate: date,

          "shift.departure":
            departure,

          "shift.arrival":
            arrival,

          "shift.duration":
            duration

        });


      // Get booked seats

      const bookedSeats =
        bookings.flatMap(
          (booking) =>
            booking.seats
        );


      res.json({
        bookedSeats
      });

    } catch (error) {

      console.log(
        "BOOKED SEATS ERROR:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch booked seats",

        error:
          error.message
      });
    }
  }
);


// =====================================================
// GET SINGLE BUS
// =====================================================

router.get(
  "/:id",
  async (req, res) => {
    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid bus ID"
        });
      }


      const bus =
        await Bus.findById(
          req.params.id
        );


      if (!bus) {
        return res.status(404).json({
          message:
            "Bus not found"
        });
      }


      res.json(bus);

    } catch (error) {

      console.log(
        "SINGLE BUS ERROR:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch bus",

        error:
          error.message
      });
    }
  }
);


// =====================================================
// UPDATE BUS (admin only)
// =====================================================

router.put(
  "/:id",
  requireAdmin,
  async (req, res) => {
    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid bus ID"
        });
      }


      const {
        company,
        busNumber,
        from,
        to,
        shifts,
        price,
        seats,
        type,
        boardingPoint,
        droppingPoint,
        amenities,
        image
      } = req.body;


      // Check required information

      if (
        !company ||
        !busNumber ||
        !from ||
        !to ||
        !Array.isArray(shifts) ||
        shifts.length === 0 ||
        price === undefined ||
        seats === undefined ||
        !type ||
        !boardingPoint ||
        !droppingPoint
      ) {
        return res.status(400).json({
          message:
            "Please provide all required bus information"
        });
      }


      // Maximum 4 shifts

      if (shifts.length > 4) {
        return res.status(400).json({
          message:
            "A bus can have maximum 4 shifts"
        });
      }


      // Validate shifts

      for (const shift of shifts) {

        if (
          !shift.departure ||
          !shift.arrival ||
          !shift.duration
        ) {
          return res.status(400).json({
            message:
              "Each shift must have departure, arrival and duration"
          });
        }
      }


      // Find current bus

      const currentBus =
        await Bus.findById(
          req.params.id
        );


      if (!currentBus) {
        return res.status(404).json({
          message:
            "Bus not found"
        });
      }


      // Check duplicate bus number

      const duplicateBus =
        await Bus.findOne({
          busNumber:
            busNumber.trim(),

          _id: {
            $ne:
              req.params.id
          }
        });


      if (duplicateBus) {
        return res.status(400).json({
          message:
            "A bus with this bus number already exists"
        });
      }


      // Do not allow seats
      // to become smaller than
      // an already booked seat

      const existingBookings =
        await BusBooking.find({
          busId:
            currentBus._id
        });


      const highestBookedSeat =
        existingBookings.reduce(
          (highest, booking) => {

            if (
              !booking.seats ||
              booking.seats.length === 0
            ) {
              return highest;
            }

            const bookingHighest =
              Math.max(
                ...booking.seats
              );

            return Math.max(
              highest,
              bookingHighest
            );

          },
          0
        );


      if (
        Number(seats) <
        highestBookedSeat
      ) {
        return res.status(400).json({
          message:
            `Total seats cannot be less than already booked seat number ${highestBookedSeat}`
        });
      }


      // Update bus

      currentBus.company =
        company.trim();

      currentBus.busNumber =
        busNumber.trim();

      currentBus.from =
        from.trim();

      currentBus.to =
        to.trim();

      currentBus.shifts =
        shifts.map((shift) => ({
          departure:
            shift.departure.trim(),

          arrival:
            shift.arrival.trim(),

          duration:
            shift.duration.trim()
        }));

      currentBus.price =
        Number(price);

      currentBus.seats =
        Number(seats);

      currentBus.type =
        type.trim();

      currentBus.boardingPoint =
        boardingPoint.trim();

      currentBus.droppingPoint =
        droppingPoint.trim();

      currentBus.amenities =
        Array.isArray(amenities)
          ? amenities
          : [];

      currentBus.image =
        image
          ? image.trim()
          : "";


      await currentBus.save();


      res.json({
        message:
          "Bus updated successfully",

        bus:
          currentBus
      });

    } catch (error) {

      console.log(
        "UPDATE BUS ERROR:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update bus",

        error:
          error.message
      });
    }
  }
);


// =====================================================
// DELETE BUS (admin only)
// =====================================================

router.delete(
  "/:id",
  requireAdmin,
  async (req, res) => {
    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid bus ID"
        });
      }


      const bus =
        await Bus.findById(
          req.params.id
        );


      if (!bus) {
        return res.status(404).json({
          message:
            "Bus not found"
        });
      }


      // Don't delete a bus
      // if bookings exist

      const hasBookings =
        await BusBooking.exists({
          busId:
            bus._id
        });


      if (hasBookings) {
        return res.status(400).json({
          message:
            "This bus cannot be deleted because it has existing bookings."
        });
      }


      await Bus.findByIdAndDelete(
        req.params.id
      );


      res.json({
        message:
          "Bus deleted successfully"
      });

    } catch (error) {

      console.log(
        "DELETE BUS ERROR:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to delete bus",

        error:
          error.message
      });
    }
  }
);


module.exports = router;