const User = require('../models/user');
const  bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login',
        {
            pageTitle: "Login",
            path: '/login',
            isAuthenticated: false,
            errorMessage: message
        },
)}
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email or Password');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    console.log(isMatched);
                    if (isMatched) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/');
                        })
                    }
                    req.flash('error', 'Invalid Email or Password');    
                    return res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        })
}
exports.getSignup= (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup',
        {
            pageTitle: "Signup",
            path: '/signup',
            isAuthenticated: false,
            errorMessage: message
        },
)}
exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
        req.flash('error', 'Password and its confirmation doesn\'t match' );
        return res.redirect('/signup');
    }
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12).then(hashedPassword => {
                const user = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    cart: {items: []}
                })
                return user.save();
            })
        })
        .then(result => {
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}
