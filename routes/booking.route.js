// routes/booking.route.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings.model");
const { v4: uuidv4 } = require("uuid");
const controller = require("../controller/booking.controller");

router.post("/", controller.createBooking);
router.get("/by-account/:account_id", controller.getBookingsByAccount);
router.get("/:booking_id", controller.getBookingById);
router.get("/by-room/:room_id", controller.getBookingsByRoom); 


module.exports = router;
