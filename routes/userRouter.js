// external imports
const express = require("express");
const router = express.Router();

// internal imports
const {
    addUser,
    getUser,
    loggedInUser,
    logout,
} = require("../controllers/userController");

const {
    inputValidator,
    inputValidatorHandler,
} = require("../middlewares/user/validateUser");

const {
    loginValidator,
    loginValidatorHandler,
} = require("../middlewares/user/validateLogin");

const { checkLogin } = require("../middlewares/common/checkLogin");

// const avatarUpload = require("../middlewares/user/avatarUpload");

// register
router.post("/signup", inputValidator, inputValidatorHandler, addUser);

// login user
router.post("/login", loginValidator, loginValidatorHandler, getUser);

// get loggedin user
router.get("/", checkLogin, loggedInUser);

// logout user
router.delete("/logout", logout);

// exporting Modules
module.exports = router;
