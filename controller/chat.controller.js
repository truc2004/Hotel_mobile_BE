// controller/chat.controller.js
const ai = require("../config/gemini");
const Hotel = require("../models/hotels.model");
const Room = require("../models/rooms.model");

async function chatWithGemini(req, res) {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    // 1. Lấy toàn bộ khách sạn
    const hotels = await Hotel.find({}).lean();
    // 2. Lấy toàn bộ phòng
    const rooms = await Room.find({}).lean();

    // ============================
    // CHUẨN HÓA THÔNG TIN KHÁCH SẠN
    // ============================
    const hotelContext = hotels
      .map((h) => {
        const id = h.hotel_id;
        const name = h.name || "Khách sạn không tên";

        const province = h.addresses?.province || "";
        const district = h.addresses?.district || "";
        const detailAddress = h.addresses?.detailAddress || "";

        const addressParts = [detailAddress, district, province].filter(Boolean);
        const address =
          addressParts.length > 0 ? addressParts.join(", ") : "Địa chỉ chưa cập nhật";

        const phone = h.phone || "";
        const email = h.email || "";
        const description = h.description || "";
        const checkIn = h.check_in_time || "";
        const checkOut = h.check_out_time || "";
        const status = h.status || "active";

        return [
          `ID: ${id}`,
          `Tên: ${name}`,
          `Địa chỉ: ${address}`,
          phone ? `SĐT: ${phone}` : null,
          email ? `Email: ${email}` : null,
          checkIn ? `Check-in: ${checkIn}` : null,
          checkOut ? `Check-out: ${checkOut}` : null,
          `Trạng thái: ${status}`,
          description ? `Mô tả: ${description}` : null,
        ]
          .filter(Boolean)
          .join(" | ");
      })
      .join("\n");

    // Map hotel_id -> hotel
    const hotelMap = new Map();
    hotels.forEach((h) => {
      if (h.hotel_id) hotelMap.set(h.hotel_id, h);
    });

    // ============================
    // CHUẨN HÓA THÔNG TIN PHÒNG
    // ============================
    const roomContext = rooms
      .map((r) => {
        const hotel = hotelMap.get(r.hotel_id) || {};
        const hotelName = hotel.name || "Khách sạn chưa rõ tên";

        const province = hotel.addresses?.province || "";
        const district = hotel.addresses?.district || "";
        const detailAddress = hotel.addresses?.detailAddress || "";
        const addressParts = [detailAddress, district, province].filter(Boolean);
        const hotelAddress =
          addressParts.length > 0 ? addressParts.join(", ") : "";

        // KHÔNG dùng roomId trong text nữa
        const price = r.price_per_night ?? "…";
        const extraAdult = r.extra_fee_adult ?? null;
        const extraChild = r.extra_fee_child ?? null;
        const amenities = r.amenities || "";
        const description = r.description || "";
        const status = r.status || "available";
        const rate = r.rate ?? null;
        const bedCount = r.bed_count ?? null;

        return [
          `Khách sạn: ${hotelName}`,
          hotelAddress ? `Địa chỉ KS: ${hotelAddress}` : null,
          `Giá/đêm: ${price} VND`,
          extraAdult != null ? `Phụ thu người lớn: ${extraAdult} VND/đêm` : null,
          extraChild != null ? `Phụ thu trẻ em: ${extraChild} VND/đêm` : null,
          bedCount != null ? `Số giường: ${bedCount}` : null,
          rate != null ? `Điểm đánh giá: ${rate}` : null,
          amenities ? `Tiện nghi: ${amenities}` : null,
          `Trạng thái: ${status}`,
          description ? `Mô tả phòng: ${description}` : null,
        ]
          .filter(Boolean)
          .join(" | ");
      })
      .join("\n");

    // ============================
    // CHÍNH SÁCH ĐẶT PHÒNG
    // ============================
    const policyText = `
1. Chính sách đặt phòng
- Thanh toán: Thanh toán toàn bộ số tiền ngay khi xác nhận đặt phòng (trừ tùy chọn "đặt trước trả sau" nếu có). Hỗ trợ ví điện tử, thẻ tín dụng, giá đã bao gồm phí và thuế.
- Thời gian lưu trú: Tối thiểu 1 đêm, tối đa 30 đêm liên tục. Nếu muốn ở dài hơn, cần chia nhỏ đặt phòng hoặc liên hệ khách sạn.
- Số lượng khách: Phù hợp với loại phòng. Ví dụ: phòng đôi thường phù hợp 2 người lớn và 1 trẻ em dưới 6 tuổi ngủ chung miễn phí. Thêm người có thể phụ thu khoảng 200000 đến 500000 VND mỗi người lớn một đêm, tùy khách sạn.
- Quy trình đặt: Khi đặt thành công sẽ có thông báo và gửi thông tin về email đã đăng ký.

2. Chính sách hủy đặt
- Thời gian hủy: Hủy trước 48 giờ so với ngày check-in không mất phí và được hoàn 100 phần trăm. Hủy trong khoảng 24 đến 48 giờ trước ngày check-in có thể mất khoảng 50 phần trăm giá trị đặt phòng. Hủy dưới 24 giờ thường không được hoàn tiền.
- Trường hợp đặc biệt: Nếu hủy do lý do bất khả kháng như thiên tai hoặc dịch bệnh và có chứng từ phù hợp, có thể được xem xét hoàn tiền đầy đủ. Thường không áp dụng cho các loại phòng giá khuyến mãi không hoàn hủy.
- Cách hủy: Người dùng có thể hủy qua ứng dụng hoặc liên hệ qua email, tùy hướng dẫn của khách sạn hoặc nền tảng đặt phòng.

3. Chính sách chỉnh sửa thời gian đặt phòng
- Thời hạn chỉnh sửa: Có thể thay đổi ngày check-in hoặc check-out miễn phí nếu thực hiện sớm hơn khoảng 7 ngày so với ngày ở mới. Sau khoảng thời gian này, có thể phát sinh thêm phí, ví dụ thêm khoảng 20 phần trăm giá trị đặt phòng, tùy mức chênh lệch và quy định của khách sạn.
- Giới hạn số lần: Thường chỉ cho phép chỉnh sửa tối đa 2 lần cho một đơn đặt phòng. Nếu thay đổi dẫn đến tăng giá phòng hoặc khác loại phòng, có thể cần hủy và đặt mới.

4. Chính sách thanh toán và hoàn tiền
- Hoàn tiền: Các khoản hoàn cho đơn hủy hợp lệ thường được xử lý trong khoảng 7 ngày làm việc, tùy theo ngân hàng hoặc phương thức thanh toán.
- Thuế và phí: Giá phòng thường đã bao gồm thuế giá trị gia tăng và phí dịch vụ. Các khoản này được hiển thị rõ trước khi người dùng xác nhận đặt phòng.
    `.trim();

    // ============================
    // SYSTEM CONTEXT
    // ============================
    const systemContext = `
Bạn là trợ lý tư vấn đặt phòng cho ứng dụng BookingHotel.

Bạn biết:
- Danh sách khách sạn với các thông tin: hotel_id, tên, tỉnh hoặc thành phố, quận hoặc huyện, địa chỉ chi tiết, số điện thoại, email, mô tả, giờ check-in, giờ check-out, trạng thái.
- Danh sách phòng với các thông tin: hotel_id, giá mỗi đêm, phụ thu người lớn và trẻ em, tiện nghi, mô tả, trạng thái, điểm đánh giá, số giường.
- Các chính sách đặt phòng, hủy phòng, chỉnh sửa đặt phòng và hoàn tiền ở bên dưới.

Khi khách đặt câu hỏi:
1. Hãy hiểu rõ nhu cầu của họ, ví dụ: địa điểm mong muốn (tỉnh, thành phố, quận, huyện), khoảng ngân sách, số lượng khách, số giường, thời gian lưu trú, loại phòng và tiện nghi cần có.
2. Dựa trên danh sách khách sạn và phòng ở trên, hãy tìm và gợi ý khoảng từ 3 đến 5 lựa chọn phù hợp nhất:
   - Với mỗi gợi ý, nêu rõ: tên khách sạn, địa chỉ (tỉnh hoặc thành phố, quận hoặc huyện, chi tiết), loại phòng, giá tham khảo, số giường và một vài tiện nghi nổi bật.
   - Giải thích ngắn gọn vì sao lựa chọn đó phù hợp với nhu cầu của người hỏi, ví dụ: gần khu vực họ muốn, phù hợp ngân sách, đủ sức chứa, tiện nghi phù hợp.
3. Nếu các thông tin như giá chính xác theo ngày ở cụ thể hoặc tình trạng phòng trống có thể thay đổi, hãy nhắc người dùng rằng:
   - Giá và tình trạng phòng có thể thay đổi, nên kiểm tra lại trên ứng dụng hoặc liên hệ trực tiếp khách sạn để xác nhận.
4. Luôn cố gắng đề xuất lựa chọn gần nhất với nhu cầu, kể cả khi không trùng khớp hoàn toàn, ví dụ khác quận nhưng cùng thành phố và cùng mức giá.
5. Trả lời bằng tiếng Việt, ngắn gọn, thân thiện, như một nhân viên tư vấn.
6. Khi cần liệt kê, ưu tiên dùng gạch đầu dòng với dấu gạch ngang hoặc đánh số dạng 1, 2, 3. Tránh sử dụng dấu hoa thị.
7. Tuyệt đối không nhắc đến các cụm như: dữ liệu hệ thống, cơ sở dữ liệu, mô hình trí tuệ nhân tạo, không có dữ liệu, hoặc cách bạn được xây dựng.

Danh sách khách sạn:
${hotelContext || "Chưa có dữ liệu khách sạn."}

Danh sách phòng:
${roomContext || "Chưa có dữ liệu phòng."}

Chính sách đặt phòng:
${policyText}
    `.trim();

    // ============================
    // BUILD CONTEXT GỬI GEMINI
    // ============================
    const contents = [];

    contents.push({
      role: "user",
      parts: [{ text: systemContext }],
    });

    if (Array.isArray(history)) {
      history.forEach((m) => {
        if (!m || !m.text) return;
        contents.push({
          role: m.from === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        });
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const reply = response.text || "";

    return res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({ error: "Lỗi khi gọi Gemini API" });
  }
}

module.exports = { chatWithGemini };
