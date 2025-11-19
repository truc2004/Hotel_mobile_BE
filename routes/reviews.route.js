const express = require('express');
const route = express.Router();

const controller = require("../controller/reviews.controller");

route.get("/", controller.getReviewsByRoom);

module.exports = route;