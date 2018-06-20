const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const port          = 8000;

const { database }      = require('./db');
const { initHandler }   = require('./init-handler');

app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => console.log('We are live on ' + port));

app.post('/cars', (req, res) => {
    // let car = new Car(database);
    // car.save();
})

app.get('/cars', (req, res) => {
    // console.log(new Car(database).all)
});

/*
database.users().then((users)=> {
    console.log(users.rows);
});*/

initHandler.init();
