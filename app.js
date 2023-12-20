const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");                                   // require ejs-mate
const ExpressError = require("./utilities/ExpressError.js");            // require ExpressError class
const session = require("express-session");                             // require Express Session
const flash = require("connect-flash");                                 // require Flash

// Routes
const campgrounds = require("./routes/campgrounds.js");                 // require campgrounds routes
const reviews = require("./routes/reviews.js");                         // require reviews routes

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
app.use(express.urlencoded({ extended: true }));            // access post request's req.body
app.use(methodOverride('_method'));                         // method override to use put request on form
app.use(express.static(path.join(__dirname, "public")));    // serve "public" directory (for static assets)

// Session Config
const sessionConfig = { 
    secret: "superfakesecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Route Handlers
app.use("/campgrounds", campgrounds);               // set prefix, use campgrounds routes
app.use("/campgrounds/:id/reviews", reviews);       // set prefix, use reviews routes


// HOME PAGE
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// ERROR HANDLING
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