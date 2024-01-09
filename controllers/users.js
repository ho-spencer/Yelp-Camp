// User Model
const User = require ("../models/user.js");


// RENDER REGISTER FORM
module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register.ejs");
};

// SUBMIT REGISTER DATA
module.exports.register = async (req, res, next) => {
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
};

// RENDER LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// SUBMIT LOGIN FORM
module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;                                    // delete returnTo from the session object (don't need it in the session anymore after we saved it to a variable)
    res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully Logged Out.");
        res.redirect("/campgrounds");
    });
};