const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // store the url they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must log in to create a new campground!')
        return res.redirect('/login')
    }
    // call the next middleware if signed in
    next()
}
module.exports = isLoggedIn