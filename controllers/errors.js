exports.get404 = (req, res, next) => {
    let isLoggedIn = req.session.isLoggedIn;
    res.status(404).render('404', {pageTitle: '404 Not Found!', path: '/', isAuthenticated: isLoggedIn});
};
