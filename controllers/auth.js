const User = require('../models/user');
const  bcrypt = require('bcryptjs');
const mailgun = require("mailgun-js");
const crypto = require('crypto');

const DOMAIN = "sandbox825499341a0d4159843ce35bcabdde67.mailgun.org";
const mg = mailgun({
    apiKey: "bfc6d8f74e6054ea3f48463689a4e60c-e2e3d8ec-cecb36ce",
    domain: DOMAIN}
);

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
exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset',
        {
            pageTitle: "Reset",
            path: '/reset',
            isAuthenticated: false,
            errorMessage: message
        },
)}
exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(12, (err, buffer)=> {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'If your email is correct then ou will find the reset link in your email');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.tokenExpiration = Date.now() + 3600000;
                req.flash('error', 'If your email is correct then ou will find the reset link in your email');

                return user.save();
            })
            .then(result => {
                return res.redirect('/reset');
            })
            .then(result => {
                const data = {
                    from: "nodeshopforzain@gmail.com",
                    to: email,
                    subject: 'You Registration is Completed Successfully',
                    html: `
                            <h1>Welcome To Our open source store :) !</h1>
                            <span>Please click the following <a href="localhost:3000/reset/${token}">Link</a></span>
`
                };
                return mg.messages().send(data, function (error, body) {
                    console.log(body);
                });
            })
            .catch(err => { console.log('err', err)});
    })
}


exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
        req.flash('error', 'Password and its confirmation doesn\'t match' );
        return res.redirect('/signup');
    }
    User
        .findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    })
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                    const data = {
                        from: "Mailgun Sandbox <postmaster@sandbox825499341a0d4159843ce35bcabdde67.mailgun.org>",
                        to: email,
                        subject: 'You Registration is Completed Successfully',
                        html: '<h1>Welcome To Our open source store :) !</h1>'
                    };
                    return mg.messages().send(data, function (error, body) {
                        console.log(body);
                    });
                })
                .catch(err => {
                    console.log(err);
                })
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
