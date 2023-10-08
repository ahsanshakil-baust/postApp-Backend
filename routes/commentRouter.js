// external imports
const express = require("express");
const router = express.Router();

// internal imports
const {
    addNewComment,
    getAllComments,
} = require("../controllers/commentController");

// add post
router.post("/:postId/add", addNewComment);

// get all comments
router.get("/:postId/getAll", getAllComments);

// exporting Modules
module.exports = router;
