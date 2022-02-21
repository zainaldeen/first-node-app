const mongodb = require('mongodb');
const MongodbClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
    MongodbClient.connect(
        'mongodb+srv://root:root@trainingapp.crp6h.mongodb.net/node-store?retryWrites=true&w=majority'
    )
        .then(client => {
            callback(client);
            _db = client.db();
            console.log('Connected Successfully');

        })
        .catch(err => {
            console.log(err);
            throw(err);
        })
};

const getDB = () => {
    if (_db) {
        return _db;
    }
    console.log('Database Not Found!');
}


module.exports = { mongoConnect, getDB };


// FOR MYSQL
//
// const sequelize = new Sequelize('node-store', 'root', '', {
//     dialect : 'mysql',
//     host: 'localhost'
// });
//
// module.exports = sequelize;