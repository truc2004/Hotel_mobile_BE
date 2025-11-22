// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP connect error:", err);
  } else {
    console.log("SMTP server is ready to take messages");
  }
});

function formatCurrency(amount = 0) {
  return `${Number(amount || 0).toLocaleString("vi-VN")}đ`;
}

function formatDate(dateInput) {
  const d = new Date(dateInput);
  // Nếu không valid thì trả text đơn giản
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleString("vi-VN");
}

async function sendBookingReceiptEmail(booking) {
  console.log(">>> [mailer] booking raw =", JSON.stringify(booking, null, 2));

  const email = booking?.user_booking_info?.email;
  const fullName = booking?.user_booking_info?.full_name || "Quý khách";


  if (!email) {
    console.log(">>> [mailer] Booking không có email, bỏ qua gửi mail.");
    return;
  }

  const hotelName = booking?.hotel_info?.name || "Khách sạn";
  const hotelAddress =
    booking?.hotel_info?.address || "Địa chỉ chưa cập nhật";

  const bookingDate = formatDate(booking.booking_date);
  const bookingId = booking.booking_id;

  const totalGuests =
    (booking.num_adults || 0) + (booking.num_children || 0);

  const roomPrice = booking.room_price || booking.total_price || 0;
  const extraFee = booking.extra_fee || 0;
  const totalPrice = booking.total_price || roomPrice + extraFee;

  const subject = `Xác nhận đặt phòng #${bookingId} – ${hotelName}`;
  
  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F8FAFF; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 20px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <h2 style="text-align: center; color: #1A1A1A; margin-bottom: 4px;">Hóa đơn điện tử</h2>
      <p style="text-align: center; color: #4A4A4A; margin-top: 0; margin-bottom: 24px;">
        Cảm ơn ${fullName} đã đặt phòng qua ứng dụng của chúng tôi.
      </p>

      <!-- Mã giao dịch -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 8px 16px; border-radius: 999px; background-color: #F2F4F8; font-size: 13px; color: #4A4A4A;">
          Mã đơn đặt phòng: <strong style="color: #2E76FF;">${bookingId}</strong>
        </div>
      </div>

      <!-- Thông tin khách sạn -->
      <div style="margin-bottom: 16px;">
        <h3 style="font-size: 15px; margin: 0 0 8px 0; color: #1A1A1A;">Thông tin khách sạn</h3>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span style="color: #8E8E93;">Khách sạn: </span>
          <span style="color: #1A1A1A; font-weight: 600; text-align: right;">${hotelName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
          <span style="color: #8E8E93;">Địa chỉ: </span>
          <span style="color: #1A1A1A; text-align: right; max-width: 60%;">${hotelAddress}</span>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #E5E5EA; margin: 16px 0;" />

      <!-- Chi tiết đặt phòng -->
      <div style="margin-bottom: 16px;">
        <h3 style="font-size: 15px; margin: 0 0 8px 0; color: #1A1A1A;">Chi tiết đặt phòng</h3>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span style="color: #8E8E93;">Ngày đặt: </span>
          <span style="color: #1A1A1A; text-align: right;">${bookingDate}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span style="color: #8E8E93;">Số khách: </span>
          <span style="color: #1A1A1A; text-align: right;">${totalGuests} khách</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
          <span style="color: #8E8E93;">Ghi chú: </span>
          <span style="color: #1A1A1A; text-align: right; max-width: 60%;">${booking.note || "Không có"}</span>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #E5E5EA; margin: 16px 0;" />

      <!-- Thông tin khách hàng -->
      <div style="margin-bottom: 16px;">
        <h3 style="font-size: 15px; margin: 0 0 8px 0; color: #1A1A1A;">Thông tin người đặt</h3>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span style="color: #8E8E93;">Tên khách: </span>
          <span style="color: #1A1A1A; text-align: right;">${fullName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span style="color: #8E8E93;">Số điện thoại: </span>
          <span style="color: #1A1A1A; text-align: right;">${booking.user_booking_info?.phone || ""}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
          <span style="color: #8E8E93;">Email: </span>
          <span style="color: #1A1A1A; text-align: right;">${email}</span>
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #E5E5EA; margin: 16px 0;" />

      <!-- Thông tin thanh toán -->
      <div style="margin-bottom: 12px;">
        <h3 style="font-size: 15px; margin: 0 0 8px 0; color: #1A1A1A;">Thông tin thanh toán</h3>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span style="color: #8E8E93;">Tiền phòng: </span>
          <span style="color: #1A1A1A; text-align: right;">${formatCurrency(roomPrice)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
          <span style="color: #8E8E93;">Phụ thu: </span>
          <span style="color: #1A1A1A; text-align: right;">${formatCurrency(extraFee)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 15px; margin-top: 8px;">
          <span style="color: #1A1A1A; font-weight: 700;">Tổng thanh toán: </span>
          <span style="color: #2E76FF; font-weight: 800; font-size: 18px;">${formatCurrency(totalPrice)}</span>
        </div>
      </div>

      <p style="font-size: 13px; color: #8E8E93; margin-top: 24px;">
        Nếu có bất kỳ thắc mắc nào về đơn đặt phòng, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi.
      </p>
      <p style="font-size: 13px; color: #4A4A4A; margin-top: 4px;">
        Chúc bạn có một kỳ nghỉ tuyệt vời!
      </p>
    </div>
  </div>
  `;

  
   try {
    const info = await transporter.sendMail({
      from: `"Booking App" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });

  
  } catch (err) {
    console.error(">>> [mailer] SMTP send error:", err);
  }
}

module.exports = { sendBookingReceiptEmail };
