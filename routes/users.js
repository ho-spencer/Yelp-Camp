const express = require("express");
const router = express.Router();
const passport = require("passport");

// Catch Async function
const catchAsync = require("../utilities/catchAsync.js");

// User Model
const User = require ("../models/user.js");

// Render Registration form
router.get("/register", (req, res) => {
    res.render("users/register.ejs");
})

// submit registration data
router.post("/register", catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });                        // create a new instance of User
        const registeredUser = await User.register(user, password);        // register user with username, email, password using static method from passport-local-mongoose
        req.flash("success", "Successfully Registered for Yelp Camp!");
        res.redirect('/campgrounds');
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    } 
}));

// Render Login Form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

/*
    Submit Form Data
        - included passport middleware to authenticate
            - options for this middleware are passed in an object
*/
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome Back!");
    res.redirect("/campgrounds");
});

// Logout
router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully Logged Out.");
        res.redirect("/campgrounds");
    });
});





// export routes
module.exports = router;