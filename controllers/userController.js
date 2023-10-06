// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const crypto = require("crypto");

// internal imports
const environment = require("../helpers/environment");
const User = require("../model/User");
const { sendMail } = require("../utilities/sendMail");

// Register a user
const addUser = async (req, res) => {
    // getting data from registration form
    const { username, email, mobile, password, cpassword } = req.body;
    let user;
    // hashing password for security perpouse
    const hashedPassword = await bcrypt.hash(password, 10);

    // matching with retype password
    if (password === cpassword) {
        // create a new user model
        user = new User({
            username,
            email,
            mobile,
            password: hashedPassword,
            token: crypto.randomBytes(64).toString("hex"),
        });
        try {
            // send verification mail to user
            const result = await sendMail(req, user);

            // check if mail is sending
            if (result) {
                // save the user to the database
                await user.save();

                // notify to verify the email
                res.status(200).json({
                    msg: "Verification sent to your email account.",
                });
            } else {
                // not sending error
                res.status(500).json({
                    errors: {
                        common: { msg: "can not send mail!" },
                    },
                });
            }
        } catch (err) {
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
                common: { msg: "Password do not matches" },
            },
        });
    }
};

// get User by Login with email and password
const getUser = async (req, res) => {
    try {
        // Find registered user by their email and mobile
        const user = await User.findOne({
            $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
        });
        // checking is there any user and also there id
        if (user && user._id) {
            // comparing user hashed password with req.body password by bcrypt
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            // is matching finded user password tothe given body password then passed throw
            if (isValidPassword) {
                const isVerified = user.isVerify;

                // check is user verified its account by their email
                if (isVerified) {
                    // create token object to generate a token for a particular user
                    const tokenObject = {
                        id: user._id,
                    };

                    // generating a token by token object to pass it to the cookie
                    const token = jwt.sign(tokenObject, environment.token, {
                        expiresIn: "1d",
                    });
                    // sending a signed cookie with token
                    res.cookie(environment.cookie_name, token, {
                        maxAge: 86400000,
                        httpOnly: true,
                        signed: true,
                    });
                    // user information passed as json
                    res.status(200).json({ user: user });
                } else {
                    // if email verification not done then it will be fireing
                    res.status(500).json({
                        errors: {
                            common: { msg: "Email not verified!" },
                        },
                    });
                }
            } else {
                // user error
                throw createError("Provide your information correctly!");
            }
        } else {
            // Server Error
            throw createError("Login failed!");
        }
    } catch (err) {
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

// get LoggedIn user
const loggedInUser = async (req, res) => {
    // Find registered user by their id
    const userlog = await User.findById(req.user.id).select("-password");
    if (userlog) {
        // user info response
        res.status(200).json({
            user: userlog,
        });
    } else {
        // server Error
        res.status(500).json({
            errors: {
                common: {
                    msg: "not found user",
                },
            },
        });
    }
};

// logout user
const logout = (req, res) => {
    // clear the cookie that was passed for geting user
    res.clearCookie(process.env.COOKIE_NAME);
    res.send("loggedout");
};

// verify email
const verifyEmail = async (req, res) => {
    try {
        // get the token by query
        const token = req.params.token;
        // find the user by given token to the user
        const user = await User.findOne({ token });
        // check is the user exists
        if (user) {
            // update the user token null
            user.token = null;
            // also update isVerify true
            user.isVerify = true;
            // save the user to the database
            await user.save();
            // giving a success response
            res.status(200).json({
                msg: "verified!",
            });
        } else {
            // Server Error
            res.status(500).json({
                errors: {
                    common: { msg: "Email is not verified" },
                },
            });
        }
    } catch (err) {
        // Server Error
        res.status(500).json({
            errors: {
                common: { msg: err.message },
            },
        });
    }
};

// exporting modules
module.exports = {
    addUser,
    getUser,
    verifyEmail,
    loggedInUser,
    logout,
};
