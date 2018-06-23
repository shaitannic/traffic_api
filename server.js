const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const bodyParser    = require('body-parser');
const database      = require('./database');
const app           = express();
var Auto = require('./auto');
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));  

MongoClient.connect(database.url, (err, client) => {
    if (err) return console.log(err)

    var database = client.database('traffic_optimization');

    app.listen(port, () => console.log('We are live on ' + port));

    require('./routes')(app, database);
})

var auto = new Auto('ddd');
/*auto.hello('me');
var fuck = auto.fuck;
console.log(fuck);*/
