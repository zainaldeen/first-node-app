const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBConnect = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const errorController = require('./controllers/errors');
const User  = require('./models/user');
const csrfProtection = csrf({});

const MONGODB_URI = 'mongodb+srv://root:root@trainingapp.crp6h.mongodb.net/node-store?authSource=admin&replicaSet=atlas-azjdlh-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';


const app = express();
const store = new MongoDBConnect({
    uri: MONGODB_URI,
    collection: 'sessions'
})
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'Zain Aldeen Fayod Secret!!',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(flash())
app.use(csrfProtection);

app.use((req, res, next) => {
   if (!req.session.user) {
       return next()
   }
   User.findById(req.session.user._id)
       .then(user => {
           req.user = user;
           next();
       })
       .catch(err => {
           console.log(err);
       })
});

app.use((req, res, next) => {
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrfToken = req.csrfToken();
   next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(3000);
    }).catch((err) => {``
        console.log(err);
    });















// For MySql Version
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
// User.hasMany(Product);
// Cart.belongsTo(User);
// User.hasOne(Cart);
// Cart.belongsToMany(Product, {through: CartItem});
// Product.belongsToMany(Cart, {through: CartItem});
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });
//
// sequelize
//     //.sync({force: true})
//     .sync()
//     .then(result => {
//         User.findById(1)
//             .then(user => {
//                 if (!user) {
//                     return User.create({name: "Zain Aldeen", email: "zainaldeenfayod@gmail.com"});
//                 }
//                 return user;
//             })
//             .then(user => {
//                 return user.createCart();
//             })
//             .then(cart => {
//                 app.listen(3000);
//             });
// }).catch(err => console.log('err'+ err));

