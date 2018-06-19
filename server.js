const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const bodyParser    = require('body-parser');
const db            = require('./config/db');
const app           = express();
var Auto = require('./auto');
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));  

MongoClient.connect(db.url, (err, client) => {
    if (err) return console.log(err)

    var db = client.db('traffic_optimization');

    app.listen(port, () => console.log('We are live on ' + port));

    require('./routes')(app, db);
})

var auto = new Auto('ddd');
/*auto.hello('me');
var fuck = auto.fuck;
console.log(fuck);*/
