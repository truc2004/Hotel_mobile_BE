// controller/booking.controller.js
const Booking = require("../models/bookings.model");
const { v4: uuidv4 } = require("uuid");
const { sendBookingReceiptEmail, sendCancelBookingEmail } = require("../utils/mailer");

async function createBooking(req, res) {
  try {
    const data = req.body;

    const booking = new Booking({
      booking_id: uuidv4(),
      account_id: data.account_id || null,
      room_id: data.room_id,
      user_booking_info: data.user_booking_info,
      hotel_info: data.hotel_info,
      num_adults: data.num_adults,
      num_children: data.num_children,
      booking_date: data.booking_date || new Date(),
       check_in_date: data.check_in_date ? new Date(data.check_in_date) : null,
      check_out_date: data.check_out_date ? new Date(data.check_out_date) : null,
      extra_fee: data.extra_fee,
      room_price: data.room_price,
      total_price: data.total_price,
      note: data.note,
      status: data.status || "upcoming",
    });

    const saved = await booking.save();

    await sendBookingReceiptEmail(saved);

    return res.status(201).json(saved);
  } catch (err) {
    console.error("Booking save error:", err);
    return res
      .status(500)
      .json({ message: "Lỗi tạo booking", error: err.message });
  }
}


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

async function getBookingsByRoom(req, res) {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      return res.status(400).json({ message: "room_id is required" });
    }

    // Lấy tất cả booking của phòng này, chỉ lấy những trường cần dùng
    const bookings = await Booking.find({ room_id })
      .select("booking_id check_in_date check_out_date status");

    return res.json(bookings);
  } catch (err) {
    console.error("getBookingsByRoom error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function cancelBooking(req, res) {
  try {
    const { booking_id } = req.params;
    const { reason } = req.body; // text lý do từ FE

    console.log("booking_id =", booking_id);        

    if (!booking_id) {
      return res.status(400).json({ message: "booking_id is required" });
    }

    const booking = await Booking.findOne({ booking_id });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Gửi email hủy (không chặn response nếu lỗi mail)
    if (typeof sendCancelBookingEmail === "function") {
      sendCancelBookingEmail(booking, reason || "").catch((err) =>
        console.error("sendCancelBookingEmail error:", err)
      );
    }

    return res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getBookingsByAccount,
  getBookingById,
  createBooking,
  getBookingsByRoom,
  cancelBooking,
};

