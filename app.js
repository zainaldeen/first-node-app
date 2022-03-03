const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const errorController = require('./controllers/errors');
const User  = require('./models/user');
const session = require('express-session');
const MongoDBConnect = require('connect-mongodb-session')(session);


const MONGODB_URI = 'mongodb+srv://root:root@trainingapp.crp6h.mongodb.net/node-store?authSource=admin&replicaSet=atlas-azjdlh-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const app = express();
const store = new MongoDBConnect({
    uri: MONGODB_URI
})
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'Zain Aldeen Fayod Secret!!', resave: false, saveUninitialized: false, store: store }))
app.use((req, res, next) => {
    User.findById("621d5b29b0b8caa5cfa6d624")
        .then(user => {
            req.user = user;
            next();
        })
});

// Admin Routes
app.use('/admin', adminRouter);
// Shop Routes
app.use(shopRouter);
// Auth Routes
app.use(authRouter);

app.use(errorController.get404);

mongoose.connect(
    MONGODB_URI
)
.then(() => {
    User.findOne().then(user => {
        if (!user) {
            let name = 'Zain';
            let email = 'zainaldeenfayod@gmail.com';
            let cart = {items:[]};
            let user = new User({ name: name, email: email, cart:cart});
            user.save();
        }
        app.listen(3000);
    })
}).catch((err) => {``
    console.log(err);
})















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

