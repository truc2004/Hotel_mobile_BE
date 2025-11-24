// Import the system file config
const systemConfig = require('../config/system');

// Import route
const accountRoute = require('../routes/accounts.route');
const roomRoute = require('../routes/rooms.route');
const reviewsRoute = require('../routes/reviews.route');
const hotelRoute = require('../routes/hotel.route');
const bookingRoute = require("../routes/booking.route");
const chatRoute = require("../routes/chat.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN+"/accounts", accountRoute)
    app.use(PATH_ADMIN+"/rooms", roomRoute)
    app.use(PATH_ADMIN+"/reviews", reviewsRoute)
    app.use(PATH_ADMIN+"/hotels", hotelRoute)
    app.use(PATH_ADMIN+"/bookings", bookingRoute);
    app.use(PATH_ADMIN + "/ai", chatRoute);
}