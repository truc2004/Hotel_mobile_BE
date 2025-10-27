const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    account_id: {
        type: String,
        unique: true,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    email: {
        type: String,
        unique: true
    },
    created_at: {
        type: Date,
    },
    updated_at: Date,
}, {
    timestamps: true 
});

const Account = mongoose.model("Account", AccountSchema, "accounts");

module.exports = Account;