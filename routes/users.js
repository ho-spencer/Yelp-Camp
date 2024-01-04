const express = require("express");
const router = express.Router();
const passport = require("passport");

// Catch Async function
const catchAsync = require("../utilities/catchAsync.js");

// User Model
const User = require ("../models/user.js");

// Middleware
const { storeReturnTo } = require("../middleware.js");

// Render Registration form
router.get("/register", (req, res) => {
    res.render("users/register.ejs");
})

// submit registration data
router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });                        // create a new instance of User
        const registeredUser = await User.register(user, password);        // register user with username, email, password using static method from passport-local-mongoose

        req.login(registeredUser, err => {
            if (err){
                return next(err);
            }
            req.flash("success", "Successfully Registered for Yelp Camp!");
            res.redirect('/campgrounds');
        })
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
router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;                                    // delete returnTo from the session object (don't need it in the session anymore after we saved it to a variable)
    res.redirect(redirectUrl);
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