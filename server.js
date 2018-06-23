const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 8000;
const dataPolyline = require('./data-polyline.json')
const dataPlacemark = require('./data-placemark.json')

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

app.post('/polyline', (req, res) => {
    // todo создать полигон по входным параметрам
    // перезаписать файл
    console.log(req.body);
    res.send({ result: true });
})

app.get('/polyline', (req, res) => {
    // todo возвратить информацию о перегоне по id
    console.log(req.query);
})

app.put('/polyline', (req, res) => {
    // todo получить новые параметры и обновить запись в БД
    // перезаписать файл
    console.log(req.body);
    res.send({ result: true });
})

app.get('/placemark-object-manager', (req, res) => {
    const data = JSON.stringify(dataPlacemark);
    res.header("Content-Type",'application/json');
    res.send(data);
});

app.get('/polyline-object-manager', (req, res) => {
    const data = JSON.stringify(dataPolyline);
    res.header("Content-Type",'application/json');
    res.send(data);
});

app.post('/add-relation', (req, res) => {
    console.log(req.body);
    res.send({result: true});
});

/*
database.users().then((users)=> {
    console.log(users.rows);
});*/

// initHandler.init();
