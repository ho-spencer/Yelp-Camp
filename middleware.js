const ExpressError = require("./utilities/ExpressError.js");            // require ExpressError class

// JOI Validation Schema
const { campgroundSchema, reviewSchema } = require("./schemas.js");     // require campground Joi schema (validation)

// Model
const Campground = require("./models/campground.js");                   // require Campground model

/*
    isLoggedIn - check to make sure a user is logged in
        - also stores (into the session) the original url/path that a user requested
            - used to redirect back if a user needed to log in first to access page
*/
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;          // save the original URL (full path requested)
        req.flash("error", "You must be signed in.");
        return res.redirect("/login");
    }
    next();
}

/*
    storeReturnTo - transfer the "req.session.returnTo" value to the Express.js res.locals object
*/
module.exports.storeReturnTo = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.locals.returnTo = req.session.returnTo;     // store value from session.returnTo to res.locals.returnTo
    } 
    next();
}

/*
    validateCampground - check to make sure a campground exists
*/
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

/*
    isAuthor - check if campground author (owner) is the same as the current user
*/
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

/*
    validateReview - make sure review has no errors
*/
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    } 
}