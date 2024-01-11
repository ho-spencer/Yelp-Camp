// Model
const Campground = require("../models/campground.js");                   // require Campground model


// Index Page - show all campgrounds
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
};

// Render New Campground Form
module.exports.renderNewForm = (req, res) => {    
    res.render("campgrounds/new.ejs");
};

// ADD NEW CAMPGROUND - submit data
module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));     // map over array (req.files) and set "url" and "filename" property of the newCampground
    newCampground.author = req.user._id;                                                    // set UserID to author field when creating a campground
    await newCampground.save();
    //console.log(newCampground.images);
    req.flash("success", "Successfully added a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
};

// RENDER EDIT CAMPGROUND FORM
module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // check to make sure campground exists
    if (!campground) {
        req.flash("error", "ERROR. Can't Find Campground");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit.ejs", { campground });
};

// EDIT CAMPGROUND - submit data
module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true });
    req.flash("success", "Successfully updated the campground to edit!");
    res.redirect(`/campgrounds/${campground._id}`);
};

// SHOW CAMPGROUND DETAILS
module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("author");
    if (!campground) {
        req.flash("error", "ERROR. Can't Find Campground");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campground });
};

// DELETE CAMPGROUND
module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
}