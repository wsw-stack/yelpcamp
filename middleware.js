module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // store the url they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must log in to create or edit a new campground!')
        return res.redirect('/login')
    }
    // call the next middleware if signed in
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}