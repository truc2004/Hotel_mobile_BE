const Room = require('../models/rooms.model');

module.exports.index = async (req, res) => {
    const result = await Room.find({});
    const result2 = await Room.find({
        _id: "68fed99bdae4abb6eb1bb4fd"
    })


    res.json({
        res: result,
        res2: result2
    });


}