// dotenv setup
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

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
const mongoSanitize = require("express-mongo-sanitize");                // require express mongo sanitize
const helmet = require("helmet");                                       // require Helmet

// Routes
const campgroundRoutes = require("./routes/campgrounds.js");                 // require campgrounds routes
const reviewRoutes = require("./routes/reviews.js");                         // require reviews routes
const userRoutes = require("./routes/users.js");                             // require users routes

// Mongo Atlas DB URL
//const dbUrl = process.env.DB_URL;

// mongodb://127.0.0.1:27017/yelp-camp  // use to connect to local DB

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
app.use(mongoSanitize());                                   // mongo sanitize (prevents prohibited characters in req.body, req.params, req.query)
app.use(helmet());                                          // helmet - includes all middleware that comes with helmet

// Helmet Content Security Policy Specifications
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
// Configure Helmet CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dlhoipchx/",    // PERSONAL CLOUDINARY NAME 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


const sessionConfig = {
    name: "session",
    secret: "superfakesecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true
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

// Global Items
app.use((req, res, next) => {
    res.locals.success = req.flash("success");              // allow req.flash("success") to be accessed from any route/template as "success"
    res.locals.error = req.flash("error");                  // allow req.flash("error") to be accessed from any route/template as "error"
    res.locals.currentUser = req.user;                      // allow req.user to be accessed from any route/template as "currentUser"
    next();
})

// Route Handlers
app.use("/campgrounds", campgroundRoutes);               // set prefix, use campgrounds routes
app.use("/campgrounds/:id/reviews", reviewRoutes);       // set prefix, use reviews routes
app.use("/", userRoutes);                                // set prefix, use users routes


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