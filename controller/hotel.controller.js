const Hotel = require('../models/hotels.model');


module.exports.hotetlDetail = async (req, res) => {
    const id = req.query.hotel_id;

    const result = await Hotel.find({
        hotel_id: id
    })

   res.json(result[0] || null);
}