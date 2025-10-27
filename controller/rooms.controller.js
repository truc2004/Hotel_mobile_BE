const Room = require('../models/rooms.model');

module.exports.index = async (req, res) => {
    const result = await Room.find({});

    res.json({
        res: result,
    });


}

module.exports.roomDetail = async (req, res) => {
    // const id = req.query.room_id;
    const id = req.params.roomid;
    console.log(id);

    const result = await Room.find({
        room_id: id
    })

    res.json({
        res: result,
    });


}