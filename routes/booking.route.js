// routes/booking.route.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings.model");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {
    console.log("Incoming booking body:", req.body);

    const data = req.body;

    const booking = new Booking({
      booking_id: uuidv4(),                       // TỰ SET
      account_id: data.account_id || null,
      room_id: data.room_id,
      user_booking_info: data.user_booking_info,
      hotel_info: data.hotel_info,
      num_adults: data.num_adults,
      num_children: data.num_children,
      booking_date: data.booking_date || new Date(),
      extra_fee: data.extra_fee,
      room_price: data.room_price,
      total_price: data.total_price,
      note: data.note,
      status: data.status || "PAID",
      // created_at / updated_at để timestamps lo
    });

    const saved = await booking.save();
    console.log("Saved booking:", saved);

    return res.status(201).json(saved);
  } catch (err) {
    console.error("Booking save error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi tạo booking", error: err.message });
  }
});

module.exports = router;
