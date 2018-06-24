const { BehaviorSubject }   = require('rxjs');
const { takeUntil }         = require('rxjs/Operator');
const { database }          = require('../db');
const Car = require('../car');
const Road = require('../road');

const step = 0.3;

class InitHandler {
    constructor() {
        this.currentTime = new BehaviorSubject(1.8);
        this.cars = [];
    }

    /** @desc инициализация автомата */
    async init(items) {
        await database.clearTables();
        // создаем тестовый автомобиль
        await new Car({polylineId: 1, coordinates: [1,2], speed: 50, acceleration: 0, newPolyline: false }).save();

        while (this.isRunning) {
            if (this.isNeedToCreateNewCar) {
                await new Car({polylineId: 1, coordinates: [1,2], speed: 50, acceleration: 0 }).save();
            }

            await Car.getAll().then(data => this.cars = data.rows);

            this.cars.forEach(car => {
                this.updateState(car);
            })
/*
            console.log(this.cars);
            console.log('---');
            await this.operate();
            console.log(this.currentTime.getValue());*/
            this.goToNextTimeStep()
        }
    }

    /** @desc обновить состояние автомобиля */
    async updateState(car) {

        new Promise(resolve => resolve(car))
        .then(car => this.checkIsTurnedToNewPolyline(car))
        .then(car => this.checkIsNearToCrossroad(car))
        .then(car => this.checkIsNeedToChangePolyline(car))
        .then(car => this.checkIsCanAccelerate(car))
        .then(car => console.log(car))
        // .then(car => car.update())
    }

    /** @desc Проверить. Автомобиль повернул на новый перегон */
    checkIsTurnedToNewPolyline(car) {
        if (car.isTurnedToNewPolyline) {
            // change car params. For example
            // car.speed = car.speed + 2;
            // car.polyline_id = 10;
        }
        
        console.log(car);
        car.polyline_id = car.polyline_id + 10;
        return new Promise(resolve => resolve(car))
    }

    checkIsNearToCrossroad(car) {
        if (car.isNearToCrossroad) {
            // todo something
        }

        console.log(car);
        car.polyline_id = car.polyline_id + 10;
        return new Promise(resolve => resolve(car));
    }

    checkIsNeedToChangePolyline(car) {
        if (car.isNeedToChangePolyline) {
            // todo something
        }

        console.log(car);
        car.polyline_id = car.polyline_id + 10;
        return new Promise(resolve => resolve(car));
    }

    checkIsCanAccelerate(car) {
        if (car.isCanAccelarate) {
            // todo something
        }
        console.log(car);
        car.polyline_id = car.polyline_id + 10;
        return new Promise(resolve => resolve(car));
    }

    /** @desc нужно создать новую машину */
    get isNeedToCreateNewCar() {
        return false;
    }

    /** @desc программа запущена (время от 0 до 3600 секунд с шагом 0.3) */
    get isRunning() {
        return this.currentTime.getValue() <= 2;
    }
/*
    async operate() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }*/

    /** @desc увеличить временной шаг на 0,3 */
    goToNextTimeStep() {
        this.currentTime.next(this.currentTime.getValue() + step);
    }
}

module.exports = {
    initHandler: new InitHandler()
};
