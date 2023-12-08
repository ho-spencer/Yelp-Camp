const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");                           // require ejs-mate
const catchAsync = require("./utilities/catchAsync.js");        // require async catch function
const ExpressError = require("./utilities/ExpressError.js");    // require ExpressError class
const { campgroundSchema } = require("./schemas.js");           // require Joi Schema created - campgroundSchema
const Campground = require("./models/campground.js");           // require Campground model


mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("MONGO CONNECTION OPEN");
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR");
        console.log(err);
    })

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));    // access post request's req.body
app.use(methodOverride('_method'));                 // method override to use put request on form

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }    
}

app.get("/", (req, res) => {
    res.render("home.ejs");
});

// Index - list all campgrounds
app.get("/campgrounds", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
}));

// Add New Campground - serve form
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs");
});

// Add New Campground - save info from form to database
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground){
    //     throw new ExpressError(400, "Invalid Campground Data");
    // }
    
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

// Edit an Item - serve edit form
app.get("/campgrounds/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit.ejs", { campground });
}));

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Show Details - show details of one campground (by ID)
app.get("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show.ejs", { campground });
}));

// Delete Campground
app.delete("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));



// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message){
        err.message = "ERROR. Default Error Message.";
    }
    res.status(statusCode).render("error.ejs", { err });
})


app.listen(8080, () => {
    console.log("OPEN ON PORT 8080");
})