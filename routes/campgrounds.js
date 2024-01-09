// Express
const express = require("express");
const router = express.Router();

// Utilities
const catchAsync = require("../utilities/catchAsync.js");                // require async catch function

// Model
const Campground = require("../models/campground.js");                   // require Campground model

// Controller
const campgrounds = require("../controllers/campgrounds.js");           // require campgrounds controller

// Middleware
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware.js");


// LIST ALL CAMPGROUNDS (campground index)
router.get("/", catchAsync(campgrounds.index));

// ADD NEW CAMPGROUND - serve form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// ADD NEW CAMPGROUND - update data
router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// EDIT A CAMPGROUND - serve form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// EDIT A CAMPGROUND - update data
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground));

// SHOW CAMPGROUND DETAILS
router.get("/:id", catchAsync(campgrounds.showCampground));

// DELETE CAMPGROUND
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


// export
module.exports = router;