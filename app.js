const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/errors');
const { mongoConnect } = require('./utils/database');

// For MySql Version
// const sequelize = require('./utils/database');
// const Product  = require('./models/product');
const User  = require('./models/user');
// const Cart  = require('./models/cart');
// const CartItem = require('./models/cartItem');
// const Order  = require('./models/order');
// const OrderItem = require('./models/orderItem');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("620d95aa644419a2e0c0b1cb")
        .then(user => {
            req.user = new User(user.name, user.email, user.password, user.cart, user._id);
            next();
        })
});


// For MySql Version
// app.use((req, res, next) => {
//     User.findById(1)
//         .then(user => {
//             req.user = user;
//             next();
//         })
// });

// Admin Routes
app.use('/admin', adminRouter);
// Shop Routes
app.use(shopRouter);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
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

