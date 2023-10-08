// internal imports
const Post = require("../model/Post");
const Comment = require("../model/Comment");

// add new Comment
const addNewComment = async (req, res) => {
    // get post id
    const postId = req.params.postId;
    // getting data from New Post
    const { commentText, name, email } = req.body;

    console.log(commentText, name, email, postId);

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                errors: {
                    common: { msg: "Post Not Found" },
                },
            });
        }

        const comment = new Comment({
            commentText,
            name,
            email,
            post: post._id,
        });
        await comment.save();

        post.comments.push(comment._id);
        await post.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: {
                common: { msg: "Server Error!" },
            },
        });
    }
};

// get all comments by the post
const getAllComments = async (req, res) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId).populate("comments");

        if (!post) {
            return res.status(404).json({
                errors: {
                    common: { msg: "Post Not Found" },
                },
            });
        }

        res.status(200).json({
            comments: post.comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: {
                common: { msg: "Server Error!" },
            },
        });
    }
};

// exporting Modules
module.exports = {
    addNewComment,
    getAllComments,
};
