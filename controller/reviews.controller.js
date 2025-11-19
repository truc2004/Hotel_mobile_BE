const Review = require('../models/reviews.model');

module.exports.getReviewsByRoom = async (req, res) => {
    const id = req.query.room_id;

    console.log(id);

    const result = await Review.find({
        room_id: id
    })

   res.json(result);
};