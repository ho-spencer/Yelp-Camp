// Express
const express = require("express");
const router = express.Router();

// Utilities
const catchAsync = require("../utilities/catchAsync.js");                // require async catch function

// Model
const Campground = require("../models/campground.js");                   // require Campground model

// Middleware
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");


// LIST ALL CAMPGROUNDS (campground index)
router.get("/", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

// ADD NEW CAMPGROUND - serve form
router.get("/new", isLoggedIn, (req, res) => {    
    res.render("campgrounds/new.ejs");
});

// ADD NEW CAMPGROUND - update data
router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;                                                // set UserID to author field when creating a campground
    await newCampground.save();
    req.flash("success", "Successfully added a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

// EDIT A CAMPGROUND - serve form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // check to make sure campground exists
    if (!campground) {
        req.flash("error", "ERROR. Can't Find Campground");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit.ejs", { campground });
}));

// EDIT A CAMPGROUND - update data
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true });
    req.flash("success", "Successfully updated the campground to edit!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

// SHOW CAMPGROUND DETAILS
router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews").populate("author");
    if (!campground) {
        req.flash("error", "ERROR. Can't Find Campground");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
}));

// DELETE CAMPGROUND
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
}));


// export
module.exports = router;