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


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    } 
}

// CREATE REVIEW
router.post("/", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);          // create review
    campground.reviews.push(review);                     // push review onto 'reviews' array
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// DELETRE REVIEWS
router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

// export
module.exports = router;