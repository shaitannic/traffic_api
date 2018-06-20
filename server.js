const express       = require('express');
const bodyParser    = require('body-parser');
const { database }  = require('./db');
// const Car           = require('./car');
const app           = express();

// var Car             = require('./car');
// var InitHandler     = require('./init-handler');

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => console.log('We are live on ' + port));

app.post('/cars', (req, res) => {
    // let car = new Car(database);
    // car.save();
})

app.get('/cars', (req, res) => {
    // console.log(new Car(database).all)
});

database.users().then((users)=> {
    console.log(users.rows);
});

database.end();
