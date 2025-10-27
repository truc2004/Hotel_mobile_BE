// Load biến môi trường
require("dotenv").config();

// ExpressJS setup
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
const cors = require("cors");
app.use(cors({
  origin: "*",
  credentials: true,
}));

// Kết nối MongoDB
const database = require("./config/database");
const mongoose = require("mongoose");

database.connect();


// Date-time lib
const moment = require("moment");
app.locals.moment = moment;

// Session + Cookie
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));

// Routes
const routeAdmin = require("./routes/index.route");
routeAdmin(app);

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
