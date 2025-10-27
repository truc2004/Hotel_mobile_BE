// Import the system file config
const systemConfig = require('../config/system');

// Import route
const accountRoute = require('../routes/accounts.route');
const roomRoute = require('../routes/rooms.route');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN+"/accounts", accountRoute)
    app.use(PATH_ADMIN+"/rooms", roomRoute)

}