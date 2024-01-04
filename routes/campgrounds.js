// Express
const express = require("express");
const router = express.Router();

// Utilities
const catchAsync = require("../utilities/catchAsync.js");                // require async catch function
const ExpressError = require("../utilities/ExpressError.js");            // require ExpressError class

// JOI Validation Schema
const { campgroundSchema } = require("../schemas.js");                   // require campground Joi schema (validation)

// Model
const Campground = require("../models/campground.js");                   // require Campground model

// Middleware
const { isLoggedIn } = require("../middleware.js")                      // require Middleware file

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else {
        next();
    }
}

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
router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // check to make sure campground exists
    if (!campground) {
        req.flash("error", "ERROR. Can't Find Campground");
        res.redirect("/campgrounds");
    }
    // check if campground author matches current user
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }

    res.render("campgrounds/edit.ejs", { campground });
}));

// EDIT A CAMPGROUND - update data
router.put("/:id", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true });
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
router.delete("/:id", isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
}));


// export
module.exports = router;