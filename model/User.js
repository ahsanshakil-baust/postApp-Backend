// external imports
const mongoose = require("mongoose");

// make a mongoose schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerify: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
        },
    },
    { timestamps: true }
);

// make a mongoose model
const User = new mongoose.model("User", userSchema);

// exporting module
module.exports = User;
