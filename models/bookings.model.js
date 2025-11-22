const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    booking_id: {
        type: String,
        unique: true,
        required: true
    },
    account_id: {
        type: String,
        ref: 'Account' // Tham chiếu đến Model Account
    },
    room_id: {
        type: String,
        ref: 'Room' // Tham chiếu đến Model Account
    },
    // Thông tin người đặt (Có thể dùng Sub-document)
    user_booking_info: {
        full_name: String,
        phone: String,
        email: String
    },
    // Thông tin khách sạn (Lưu trữ snapshot tại thời điểm đặt)
    hotel_info: {
        name: String,
        address: String
    },
    num_adults: Number,
    num_children: Number,
    booking_date: {
        type: Date,
        default: Date.now
    },
    extra_fee: Number,
    room_price: Number,
    total_price: Number,
    note: String,
    status: String,
    created_at: {
        type: Date,
    },
    updated_at: Date,
    check_in_date: Date,
    check_out_date: Date,
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", BookingSchema, "bookings");

module.exports = Booking;