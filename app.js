const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/errors');
const db = require('./utils/database');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


db.execute("SELECT * FROM products")
    .then(result => {
        console.log(result);
    }).
    catch(err => {
        console.log(err);
});
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


// Admin Routes
app.use('/admin', adminRouter);
// Shop Routes
app.use(shopRouter);

app.use(errorController.get404);
app.listen(3000);
