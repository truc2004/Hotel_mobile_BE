const express = require('express');
const route = express.Router();

const controller = require("../controller/reviews.controller");

route.get("/", controller.getReviewsByRoom);

route.get("/review", controller.getMyReview);

// POST /api/reviews
route.post("/", controller.createReview);

// PUT /api/reviews/review
route.put("/review", controller.updateMyReview);

module.exports = route;