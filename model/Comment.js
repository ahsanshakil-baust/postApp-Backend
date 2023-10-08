// external imports
const mongoose = require("mongoose");

// make a mongoose schema
const commentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        commentText: {
            type: String,
            required: true,
            trim: true,
        },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    },
    { timestamps: true }
);

// make a mongoose model
const Comment = new mongoose.model("Comment", commentSchema);

// exporting module
module.exports = Comment;
