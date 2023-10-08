// external imports
const express = require("express");
const router = express.Router();

// internal imports
const {
    addNewPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPost,
} = require("../controllers/postController");

// add post
router.post("/add", addNewPost);

// update post
router.patch("/update/:id", updatePost);

// delete post
router.delete("/delete/:id", deletePost);

// get all posts
router.get("/getAll", getAllPosts);

// get post
router.get("/getPost/:id", getPost);

// exporting Modules
module.exports = router;
