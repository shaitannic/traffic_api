const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 8000;
const data = require('./data.json')

const { database }      = require('./db');
const { initHandler }   = require('./init-handler');

app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



app.listen(port, () => console.log('We are live on ' + port));

app.get('/users', (req, res) => {
    res.send({'name': 'ddd'});
})

app.post('/polyline', (req, res) => {
    console.log(req.body);
    res.send({ result: true });
})

app.get('/cars', (req, res) => {
    // console.log(new Car(database).all)
});

app.get('/placemark-object-manager', (req, res) => {
    const data = generateData();
    res.header("Content-Type",'application/json');
    res.send(data);
});

app.get('/polyline-object-manager', (req, res) => {
    const data = generateData();
    res.header("Content-Type",'application/json');
    res.send(data);
});

function generateData() {
    return JSON.stringify(data);
}

/*
database.users().then((users)=> {
    console.log(users.rows);
});*/

// initHandler.init();
