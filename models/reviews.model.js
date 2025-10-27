const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    review_id: {
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
    rating: Number,
    comment: String,
    images: [String],
    status: String,
      created_at: {
        type: Date,
    },
    updated_at: Date,
}, {
    timestamps: true
});

const Review = mongoose.model("Review", ReviewSchema, "reviews");

module.exports = Review;