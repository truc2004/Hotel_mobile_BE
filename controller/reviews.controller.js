const Review = require('../models/reviews.model');
const crypto = require('crypto');

module.exports.getReviewsByRoom = async (req, res) => {
    const id = req.query.room_id;

    console.log(id);

    const result = await Review.find({
        room_id: id
    })

   res.json(result);
};

module.exports.getReviewsByRoom = async (req, res) => {
  const id = req.query.room_id;

  console.log(id);

  const result = await Review.find({
    room_id: id
  });

  res.json(result);
};

exports.getMyReview = async (req, res) => {
  try {
    const { account_id, room_id } = req.query;

    if (!account_id || !room_id) {
      return res
        .status(400)
        .json({ message: "Thiếu account_id hoặc room_id" });
    }

    const review = await Review.findOne({ account_id, room_id });

    if (!review) {
      return res.status(404).json(null);
    }

    return res.json(review);
  } catch (err) {
    console.error("getMyReview error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /hotel/reviews
// body: { account_id, room_id, rating, comment }
exports.createReview = async (req, res) => {
  try {
    const { account_id, room_id, rating, comment } = req.body;

    if (!account_id || !room_id) {
      return res
        .status(400)
        .json({ message: "Thiếu account_id hoặc room_id" });
    }

    if (rating == null) {
      return res.status(400).json({ message: "Thiếu rating" });
    }

    // mỗi account chỉ được review 1 lần cho 1 room
    const existed = await Review.findOne({ account_id, room_id });
    if (existed) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá phòng này rồi" });
    }

    const review = await Review.create({
      review_id: crypto.randomUUID(),
      account_id,
      room_id,
      rating,
      comment,
      // created_at, updated_at tự set bởi timestamps
    });

    return res.status(201).json(review);
  } catch (err) {
    console.error("createReview error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /hotel/reviews/review
// body: { account_id, room_id, rating, comment }
exports.updateMyReview = async (req, res) => {
  try {
    const { account_id, room_id, rating, comment } = req.body;

    if (!account_id || !room_id) {
      return res
        .status(400)
        .json({ message: "Thiếu account_id hoặc room_id" });
    }

    if (rating == null) {
      return res.status(400).json({ message: "Thiếu rating" });
    }

    const review = await Review.findOneAndUpdate(
      { account_id, room_id },
      {
        $set: {
          rating,
          comment,
        },
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Chưa có đánh giá để cập nhật" });
    }

    return res.json(review);
  } catch (err) {
    console.error("updateMyReview error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};