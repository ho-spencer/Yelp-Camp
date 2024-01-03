const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");                                   // require ejs-mate
const ExpressError = require("./utilities/ExpressError.js");            // require ExpressError class
const session = require("express-session");                             // require Express Session
const flash = require("connect-flash");                                 // require Flash
const passport = require("passport");                                   // require Passport
const LocalStrategy = require("passport-local");                        // require Local-Passport
const User = require("./models/user.js");                               // require User model


// Routes
const campgroundRoutes = require("./routes/campgrounds.js");                 // require campgrounds routes
const reviewRoutes = require("./routes/reviews.js");                         // require reviews routes
const userRoutes = require("./routes/users.js");                             // require users routes

// Connect to DB
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

app.use(passport.initialize());                             // middleware to initialize Passport
app.use(passport.session());                                // middleware to allow peristent login
passport.use(new LocalStrategy(User.authenticate()));       // tell Passport to use the "local strategy" we set up
passport.serializeUser(User.serializeUser());               // serialze Users into the session (static method from Passport)
passport.deserializeUser(User.deserializeUser());           // deserialze Users into the session (static method from Passport)


// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Route Handlers
app.use("/campgrounds", campgroundRoutes);               // set prefix, use campgrounds routes
app.use("/campgrounds/:id/reviews", reviewRoutes);       // set prefix, use reviews routes
app.use("/", userRoutes);                                // set preicx, use users routes


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