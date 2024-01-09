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

router.route("/register")
    .get(users.renderRegisterForm)             // Render Registration form
    .post(catchAsync(users.register));         // submit registration data

router.route("/login")
    .get(users.renderLoginForm)                                                                  // Render Login Form
    
    /*
    Submit Form Data
        - included passport middleware to authenticate
            - options for this middleware are passed in an object
    */
    .post(storeReturnTo,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        users.login);



// Logout
router.get("/logout", users.logout);


// export routes
module.exports = router;