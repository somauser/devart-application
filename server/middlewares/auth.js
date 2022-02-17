exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.flash('error', 'You must be singed in first!')
        return res.redirect('/users/login');
    }
    // call next if the user is authenticated
    next();
}