const express = require('express');
const route = express.Router();

const controller = require("../controller/rooms.controller");

route.get("/", controller.index);
route.get("/roomDetail", controller.roomDetail)

module.exports = route;