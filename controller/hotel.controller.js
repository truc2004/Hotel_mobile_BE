const Hotel = require('../models/hotels.model');

module.exports.getHotels = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};

    if (q && q.trim() !== "") {
      const regex = new RegExp(q.trim(), "i"); // không phân biệt hoa thường

      filter.$or = [
        { name: regex },
        { "addresses.detailAddress": regex },
        { "addresses.district": regex },
        { "addresses.province": regex },
      ];
    }

    const hotels = await Hotel.find(filter);
    res.json(hotels);
  } catch (error) {
    console.error("Error getHotels:", error);
    res.status(500).json({
      message: "Lỗi server khi tải danh sách khách sạn",
      error: error.message,
    });
  }
};

module.exports.hotelDetail = async (req, res) => {
    const id = req.query.hotel_id;

    const result = await Hotel.find({
        hotel_id: id
    })

   res.json(result[0] || null);
}