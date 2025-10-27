const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    hotel_id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    addresses: {
        province: String,
        district: String,
        detailAddress: String
    },
    phone: String,
    email: String,
    description: String,
    check_in_time: String,
    check_out_time: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'available', 'fully_booked'],
        default: 'active'
    },
    created_at: {
        type: Date,
    },
    updated_at: Date,
}, {
    timestamps: true
});

const Hotel = mongoose.model("Hotel", HotelSchema, "hotels");

module.exports = Hotel;