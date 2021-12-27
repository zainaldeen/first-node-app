const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);
getProductsFromFile = cb => {

    fs.readFile(p, (err, contentFile) => {
        if (err) {
            cb([]);
        }else{
            cb(JSON.parse(contentFile));
        }
    })
}

module.exports = class {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (err){
                    console.log(err);
                }
            })
        });
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}
