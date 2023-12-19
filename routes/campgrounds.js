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
router.get("/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

// ADD NEW CAMPGROUND - update data
router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

// EDIT A CAMPGROUND - serve form
router.get("/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { campground });
}));

// EDIT A CAMPGROUND - update data
router.put("/:id", validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// SHOW CAMPGROUND DETAILS
router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show.ejs", { campground });
}));

// DELETE CAMPGROUND
router.delete("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));


// export
module.exports = router;