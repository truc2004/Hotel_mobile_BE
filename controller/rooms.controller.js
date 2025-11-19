const Room = require('../models/rooms.model');

module.exports.index = async (req, res) => {
    try {
        const result = await Room.find({});
        res.json(result); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports.roomDetail = async (req, res) => {
    const id = req.query.room_id;

    const result = await Room.find({
        room_id: id
    })

   res.json(result[0] || null);
}