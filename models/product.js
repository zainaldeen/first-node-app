const db = require('../utils/database');
const Cart = require('./cart');


module.exports = class {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    save() {
        const sql = "INSERT INTO products (title,price,description, imageUrl) VALUES (?,?,?,?)"
        const values = [this.title,
            this.price,
            this.description,
            this.imageUrl]
        ;
        return db.execute(sql, values);
    }
    static show(id) {
        return db.execute('SELECT * FROM products WHERE products.id =' + db.escape(id));
    }
    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }
    static update(id, product) {
        const sql = "UPDATE products SET title= ?, price=?,   description=?, imageUrl=? WHERE products.id = " + db.escape(id);
        const values = [product.title,
            product.price,
            product.description,
            product.imageUrl]
        ;
        return db.execute(sql, values);

    }
    static delete(id) {
        return db.execute('DELETE FROM  products WHERE products.id ='+ db.escape(id));
    }
}
