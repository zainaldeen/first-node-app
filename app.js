const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/errors');
const sequelize = require('./utils/database');
const Product  = require('./models/product');
const User  = require('./models/user');
const Cart  = require('./models/cart');
const CartItem = require('./models/cartItem');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById(1)
        .then(user => {
            req.user = user;
            next();
        })
});

// Admin Routes
app.use('/admin', adminRouter);
// Shop Routes
app.use(shopRouter);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize
    //.sync({force: true})
    .sync()
    .then(result => {
        User.findById(1)
            .then(user => {
                if (!user) {
                    return User.create({name: "Zain Aldeen", email: "zainaldeenfayod@gmail.com"});
                }
                return user;
            })
            .then(user => {
                return user.createCart();
            })
            .then(cart => {
                app.listen(3000);
            });
}).catch(err => console.log('err'+ err));

