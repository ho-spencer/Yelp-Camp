/*
    Middleware to check if user is logged in
        - also stores (into the session) the original url/path that a user requested
            - used to redirect back if a user needed to log in first to access page
*/
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;          // save the original URL (full path requested)
        req.flash("error", "You must be signed in.");
        return res.redirect("/login");
    }
    next();
}

/*
    Middleware to transfer the "req.session.returnTo" value to the Express.js res.locals object
*/
module.exports.storeReturnTo = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.locals.returnTo = req.session.returnTo;     // store value from session.returnTo to res.locals.returnTo
    } 
    next();
}