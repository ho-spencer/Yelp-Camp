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

// Multer
const multer = require("multer");
const { storage } = require("../cloudinary/index.js");                  // require cloudinary storage we set up
const upload = multer({ storage });                                     // tell multer to upload to the "storage" we created

router.route("/")
    .get(catchAsync(campgrounds.index))                                                                 // LIST ALL CAMPGROUNDS (campground index)
    //.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));                    // ADD NEW CAMPGROUND - update data
    .post(upload.single("image"), (req, res) => {                                                       // temp route for image upload
        console.log(req.body, req.file);
    })

// ADD NEW CAMPGROUND - serve form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))                                                // SHOW CAMPGROUND DETAILS
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))      // EDIT A CAMPGROUND - update data
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));                    // DELETE CAMPGROUND


// EDIT A CAMPGROUND - serve form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// export
module.exports = router;