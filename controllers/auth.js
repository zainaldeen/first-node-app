exports.getLogin = (req, res, next) => {
    let isLoggedIn = req.session.isLoggedIn;
    res.render('auth/login',
        {
            pageTitle: "Login",
            path: '/login',
            isAuthenticated: isLoggedIn
        },
)}
exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
}
