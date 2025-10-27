const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    favorite_id: {
        type: String,
        unique: true,
        required: true
    },
    account_id: {
        type: String,
        ref: 'Account'
    },
    room_id: {
        type: String,
        ref: 'Room'
    },
}, {
    timestamps: true
});

// Đảm bảo mỗi tài khoản chỉ thích một khách sạn một lần
FavoriteSchema.index({ account_id: 1, hotel_id: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema, "favorites");

module.exports = Favorite;