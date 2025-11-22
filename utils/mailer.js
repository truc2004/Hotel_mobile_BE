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

/**
 * Tính số tiền hoàn / phí hủy dựa trên giờ còn lại so với check-in
 */
function calcRefundForCancellation(booking) {
  const total = Number(booking.total_price || 0);

  const checkIn = booking.check_in_date
    ? new Date(booking.check_in_date)
    : null;

  if (!checkIn || isNaN(checkIn.getTime())) {
    return {
      refundAmount: 0,
      feeAmount: total,
      ruleText: "Không xác định được thời gian hủy, áp dụng phí 100%.",
    };
  }

  const now = new Date();
  const diffMs = checkIn.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  let refundPercent = 0;
  let ruleText = "";

  if (diffHours >= 48) {
    refundPercent = 1;
    ruleText =
      "Hủy trước 48 giờ so với ngày check-in: hoàn tiền 100%, không mất phí.";
  } else if (diffHours >= 24) {
    refundPercent = 0.5;
    ruleText =
      "Hủy trước 24–48 giờ so với ngày check-in: phí 50% giá trị, hoàn 50%.";
  } else {
    refundPercent = 0;
    ruleText =
      "Hủy trong vòng dưới 24 giờ trước check-in: phí 100%, không hoàn tiền.";
  }

  const refundAmount = Math.round(total * refundPercent);
  const feeAmount = total - refundAmount;

  return { refundAmount, feeAmount, ruleText };
}

/**
 * Gửi mail xác nhận ĐẶT PHÒNG (giữ nguyên như trước, chỉ gói lại)
 */
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

      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 8px 16px; border-radius: 999px; background-color: #F2F4F8; font-size: 13px; color: #4A4A4A;">
          Mã đơn đặt phòng: <strong style="color: #2E76FF;">${bookingId}</strong>
        </div>
      </div>

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
    await transporter.sendMail({
      from: `"Booking App" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });
  } catch (err) {
    console.error(">>> [mailer] SMTP send error:", err);
  }
}

/**
 * Gửi mail xác nhận HỦY ĐẶT PHÒNG + thông tin hoàn tiền
 */
async function sendCancelBookingEmail(booking, reasonText) {
  const email = booking?.user_booking_info?.email;
  const fullName = booking?.user_booking_info?.full_name || "Quý khách";

  if (!email) {
    console.log("[mailer] Không có email, bỏ qua gửi mail hủy");
    return;
  }

  const hotelName = booking?.hotel_info?.name || "Khách sạn";
  const hotelAddress = booking?.hotel_info?.address || "";

  const bookingId = booking.booking_id;
  const bookingDate = formatDate(booking.booking_date);
  const checkInDate = booking.check_in_date
    ? formatDate(booking.check_in_date)
    : "N/A";
  const checkOutDate = booking.check_out_date
    ? formatDate(booking.check_out_date)
    : "N/A";

  const totalGuests =
    (booking.num_adults || 0) + (booking.num_children || 0);

  const totalPrice = Number(booking.total_price || 0);
  const { refundAmount, feeAmount } = calcRefundForCancellation(booking);

  const subject = `Xác nhận hủy đặt phòng #${bookingId} – ${hotelName}`;

  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#F8FAFF; padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
      <h2 style="text-align:center;color:#1A1A1A;margin:0 0 4px;">Xác nhận hủy đặt phòng</h2>
      <p style="text-align:center;color:#4A4A4A;margin:0 0 16px;">
        Xin chào ${fullName}, yêu cầu hủy đơn đặt phòng của bạn đã được tiếp nhận và xử lý.
      </p>

      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;padding:8px 16px;border-radius:999px;background:#F2F4F8;font-size:13px;color:#4A4A4A;">
          Mã đơn đặt phòng: <strong style="color:#FF3B30;">${bookingId}</strong>
        </div>
      </div>

      <h3 style="font-size:15px;margin:0 0 8px;color:#1A1A1A;">Thông tin khách sạn</h3>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Khách sạn</span>
        <span style="color:#1A1A1A;font-weight:600;text-align:right;">${hotelName}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:12px;">
        <span style="color:#8E8E93;">Địa chỉ</span>
        <span style="color:#1A1A1A;text-align:right;max-width:60%;">${hotelAddress}</span>
      </div>

      <hr style="border:none;border-top:1px solid #E5E5EA;margin:16px 0;" />

      <h3 style="font-size:15px;margin:0 0 8px;color:#1A1A1A;">Chi tiết đặt phòng</h3>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Ngày đặt</span>
        <span style="color:#1A1A1A;text-align:right;">${bookingDate}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Check-in</span>
        <span style="color:#1A1A1A;text-align:right;">${checkInDate}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Check-out</span>
        <span style="color:#1A1A1A;text-align:right;">${checkOutDate}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Số khách</span>
        <span style="color:#1A1A1A;text-align:right;">${totalGuests} khách</span>
      </div>

      <hr style="border:none;border-top:1px solid #E5E5EA;margin:16px 0;" />

      <h3 style="font-size:15px;margin:0 0 8px;color:#1A1A1A;">Thông tin người đặt</h3>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Tên khách</span>
        <span style="color:#1A1A1A;text-align:right;">${fullName}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Số điện thoại</span>
        <span style="color:#1A1A1A;text-align:right;">${booking.user_booking_info?.phone || ""}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:12px;">
        <span style="color:#8E8E93;">Email</span>
        <span style="color:#1A1A1A;text-align:right;">${email}</span>
      </div>

      ${
        reasonText
          ? `
      <div style="margin-bottom:12px;font-size:13px;color:#4A4A4A;">
        <strong>Lý do hủy:</strong>
        <div style="margin-top:4px;">${reasonText}</div>
      </div>`
          : ""
      }

      <hr style="border:none;border-top:1px solid #E5E5EA;margin:16px 0;" />

      <h3 style="font-size:15px;margin:0 0 8px;color:#1A1A1A;">Thông tin hoàn tiền</h3>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Tổng giá trị đặt phòng</span>
        <span style="color:#1A1A1A;text-align:right;">${formatCurrency(totalPrice)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px;">
        <span style="color:#8E8E93;">Phí hủy áp dụng</span>
        <span style="color:#FF3B30;text-align:right;">-${formatCurrency(feeAmount)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:15px;margin-top:8px;">
        <span style="color:#1A1A1A;font-weight:700;">Số tiền hoàn lại dự kiến</span>
        <span style="color:#2E76FF;font-weight:800;font-size:18px;">${formatCurrency(refundAmount)}</span>
      </div>

      <div style="margin-top:16px;font-size:13px;color:#4A4A4A;">
        <p style="margin:0 0 4px;"><strong>Chính sách hủy đặt:</strong></p>
        <ul style="padding-left:18px;margin:0 0 8px;">
          <li>Hủy trước <strong>48 giờ</strong> so với ngày check-in: <strong>không mất phí</strong>, hoàn tiền 100%.</li>
          <li>Hủy trước <strong>24–48 giờ</strong>: phí 50% giá trị.</li>
          <li>Hủy trong vòng <strong>dưới 24 giờ</strong>: phí 100% (không hoàn tiền).</li>
          <li>Trường hợp bất khả kháng (thiên tai, dịch bệnh...) có chứng từ hợp lệ: có thể được xem xét hoàn tiền đầy đủ.</li>
          <li>Không áp dụng cho các đơn <strong>giá đặc biệt (non-refundable)</strong>.</li>
        </ul>
        <p style="margin:0;">
          Số tiền hoàn trả (nếu có) sẽ được xử lý trong vòng
          <strong> 6–7 ngày làm việc</strong>, tùy theo ngân hàng/đơn vị thanh toán.
        </p>
      </div>
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
    console.log("[mailer] Cancel email sent:", info.messageId);
  } catch (err) {
    console.error("[mailer] sendCancelBookingEmail error:", err);
  }
}

module.exports = { sendBookingReceiptEmail, sendCancelBookingEmail,
  calcRefundForCancellation,
  formatCurrency,
  formatDate, };
