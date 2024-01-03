// Express
const express = require("express");
const router = express.Router();

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





// export routes
module.exports = router;