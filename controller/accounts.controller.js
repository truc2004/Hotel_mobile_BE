const mongoose = require("mongoose");
const Account = require("../models/accounts.model");


// TÌM ACCOUNT THEO EMAIL
async function findAccountByEmail(req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    return res.json(account);
  } catch (err) {
    console.error("findAccountByEmail error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}




// 2) TẠO HOẶC LẤY ACCOUNT (FIND OR CREATE)

async function createOrGetAccount(req, res) {
  try {
    const { email, user_name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Tìm account theo email
    let account = await Account.findOne({ email });

    // Nếu đã tồn tại → trả về
    if (account) {
      return res.json(account);
    }

    // Chưa tồn tại → tạo mới
    const accountId = new mongoose.Types.ObjectId().toString();

    const newAccount = await Account.create({
      account_id: accountId,
      user_name: user_name || "",
      email: email,
      password: "",
      phone: "",
      created_at: new Date(),
      updated_at: null,
    });

    return res.status(201).json(newAccount);

  } catch (err) {
    console.error("createOrGetAccount error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateAccount(req, res) {
  const { account_id } = req.params;
  const payload = req.body;

  const updated = await Account.findOneAndUpdate(
    { account_id },
    payload,
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Account not found" });
  return res.json(updated);
}




module.exports = {
  findAccountByEmail,
  createOrGetAccount,
  updateAccount,
};
