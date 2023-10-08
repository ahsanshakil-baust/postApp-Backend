// external imports
const mongoose = require("mongoose");

// make a mongoose schema
const postSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    { timestamps: true }
);

// make a mongoose model
const Post = new mongoose.model("Post", postSchema);

// exporting module
module.exports = Post;
