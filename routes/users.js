const express = require("express");
const router = express.Router();
const passport = require("passport");

// Catch Async function
const catchAsync = require("../utilities/catchAsync.js");

// User Model
const User = require("../models/user.js");

// Users Controller
const users = require("../controllers/users.js");           // require users controller

// Middleware
const { storeReturnTo } = require("../middleware.js");

// Render Registration form
router.get("/register", users.renderRegisterForm);

// submit registration data
router.post("/register", catchAsync(users.register));

// Render Login Form
router.get("/login", users.renderLoginForm);

/*
    Submit Form Data
        - included passport middleware to authenticate
            - options for this middleware are passed in an object
*/
router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

// Logout
router.get("/logout", users.logout);


// export routes
module.exports = router;