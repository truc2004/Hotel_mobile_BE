// controller/booking.controller.js
const Booking = require("../models/bookings.model");


async function getBookingsByAccount(req, res) {
  try {
    const { account_id } = req.params;

    if (!account_id) {
      return res.status(400).json({ message: "account_id is required" });
    }

    // Lấy tất cả booking theo account_id, sort mới nhất trước
    const bookings = await Booking.find({ account_id }).sort({ created_at: -1 });

    return res.json(bookings);
  } catch (err) {
    console.error("getBookingsByAccount error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getBookingById(req, res) {
  try {
    const { booking_id } = req.params; // LẤY TỪ params, KHÔNG phải query

    if (!booking_id) {
      return res.status(400).json({ message: "booking_id is required" });
    }

    console.log("getBookingById booking_id =", booking_id);

    // Tìm theo field booking_id trong Mongo
    const booking = await Booking.findOne({ booking_id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json(booking);
  } catch (err) {
    console.error("getBookingById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  getBookingsByAccount,
  getBookingById
};
