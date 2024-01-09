// Express
const express = require("express");
const router = express.Router({ mergeParams: true });            // pass in option "mergeParams" to use params from app.js (in this case, need to access :id in route)

// Utilites
const catchAsync = require("../utilities/catchAsync.js");        // require async catch function
const ExpressError = require("../utilities/ExpressError.js");    // require ExpressError class

// JOI Validation Schema
const { reviewSchema } = require("../schemas.js");               // require reviews Joi schemas (validation)

// Controller
const reviews = require("../controllers/reviews.js");            // require reviews controller

// Models
const Campground = require("../models/campground.js");            // require Campground model
const Review = require("../models/review.js");                    // require Review model

// Middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");           // validateReview middleware

// CREATE REVIEW
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETE REVIEWS
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// export
module.exports = router;