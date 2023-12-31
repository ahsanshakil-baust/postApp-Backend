// external imports
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// intenal imports
const environment = require("./helpers/environment");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const {
    notFoundHandler,
    errorHandler,
} = require("./middlewares/common/errorHandler");

// database connection
mongoose
    .connect(environment.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.log(err.message));

const app = express();

// set static folder
// app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser(environment.cookie));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000",
            "https://post-app-frontend.vercel.app",
        ],
    })
);

// Routes

// User
app.use("/user", userRouter);

// Post
app.use("/post", postRouter);

// Comments
app.use("/comment", commentRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Api running");
    });
}

// notFoundHandler
app.use(notFoundHandler);

// errorHandler
app.use(errorHandler);

// connection log
app.listen(process.env.PORT || 5000, () => {
    console.log(
        `Server running on ${process.env.PORT || 5000} on mode ${
            process.env.NODE_ENV
        }`
    );
});
