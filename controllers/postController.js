// internal imports
const Post = require("../model/Post");

// add new post
const addNewPost = async (req, res) => {
    // getting data from New Post
    const { title, description, user, email } = req.body;

    if (title !== "" && description !== "") {
        // create a new post model
        const post = new Post({
            user,
            title,
            description,
            email,
        });

        try {
            // save the post to the database
            await post.save();

            // notify to verify the email
            res.status(200).json({
                msg: "Added New Post.",
            });
        } catch (error) {
            // server error
            res.status(500).json({
                errors: {
                    common: { msg: err.message },
                },
            });
        }
    } else {
        // password not matching error
        res.status(400).json({
            errors: {
                common: { msg: "Please Fill all the Fields" },
            },
        });
    }
};

// update a post
const updatePost = async (req, res) => {
    const { id } = req.params;

    const { title, description, user, email } = req.body;

    try {
        await Post.findOneAndUpdate(
            { _id: id },
            { title, description, user, email },
            {
                new: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            msg: "Post Updated Successfully !",
        });
    } catch (error) {}
};

// delete a post
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        await Post.findOneAndDelete({ _id: id });

        res.status(200).json({
            msg: "Post Delete Successfully !",
        });
    } catch (error) {
        // Server Error
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
};

// get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        res.status(200).json({
            posts,
        });
    } catch (error) {
        // server error occurred
        res.status(500).json({
            errors: {
                common: { msg: "Server Error!" },
            },
        });
    }
};

// get post
const getPost = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const post = await Post.findById(id);
        res.status(200).json({
            post,
        });
    } catch (error) {
        // Server Error
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
};

// exporting Modules
module.exports = {
    addNewPost,
    deletePost,
    updatePost,
    getAllPosts,
    getPost,
};
