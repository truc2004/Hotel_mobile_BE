const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        unique: true,
        required: true
    },
    hotel_id: {
        type: String,
        required: true,
        ref: 'Hotel' // Tham chiếu đến Model Hotel
    },
    price_per_night: Number,
    extra_fee_adult: Number,
    extra_fee_child: Number,
    images: [String], // Array of Strings
    amenities: String,
    description: String,
    status: {
        type: String,
        enum: ['available', 'booked', 'check_in', 'check_out', 'inactive'],
        default: 'available'
    },
    // Các trường metadata
      created_at: {
        type: Date,
    },
    updated_at: Date,
    rate: Number,
    bed_count: Number
}, {
    timestamps: true
});

const Room = mongoose.model("Room", RoomSchema, "rooms");

module.exports = Room;