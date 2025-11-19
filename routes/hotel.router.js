const express = require('express');
const route = express.Router();
const controller = require("../controller/hotel.controller");

route.get("/hotelDetail", controller.hotetlDetail);

module.exports = route;
