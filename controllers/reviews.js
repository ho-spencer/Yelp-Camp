// Models
const Campground = require("../models/campground.js");            // require Campground model
const Review = require("../models/review.js");                    // require Review model


// CREATE REVIEW
module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)           // create review
    review.author = req.user._id;                        // assign a user to the created review
    campground.reviews.push(review);                     // push review onto 'reviews' array
    await review.save();
    await campground.save();
    req.flash("success", "Review Created!");
    res.redirect(`/campgrounds/${campground._id}`);
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/campgrounds/${campground._id}`);
};

