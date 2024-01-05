// Express
const express = require("express");
const router = express.Router({ mergeParams: true });            // pass in option "mergeParams" to use params from app.js (in this case, need to access :id in route)

// Utilites
const catchAsync = require("../utilities/catchAsync.js");        // require async catch function
const ExpressError = require("../utilities/ExpressError.js");    // require ExpressError class

// JOI Validation Schema
const { reviewSchema } = require("../schemas.js");               // require reviews Joi schemas (validation)

// Models
const Campground = require("../models/campground.js");            // require Campground model
const Review = require("../models/review.js");                    // require Review model

// Middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");           // validateReview middleware

// CREATE REVIEW
router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)           // create review
    review.author = req.user._id;                        // assign a user to the created review
    campground.reviews.push(review);                     // push review onto 'reviews' array
    await review.save();
    await campground.save();
    req.flash("success", "Review Created!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

// DELETE REVIEWS
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/campgrounds/${campground._id}`);
}))

// export
module.exports = router;