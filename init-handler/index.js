const { BehaviorSubject }   = require('rxjs');
const { takeUntil }         = require('rxjs/Operator');
const { database }          = require('../db');
const Car = require('../car');
const Road = require('../road');

const step = 1.1;

class InitHandler {
    constructor() {
        this.currentTime = new BehaviorSubject(0);
        this.cars = [];
    }

    /** @desc инициализация автомата */
    async init(items) {
        // await database.clearTables();
        // await new Car({id: 1, polylineId: 1, coordinates: [1,2], speed: 50, acceleration: 3, newPolyline: false }).save();
        // await new Car({id: 2, polylineId: 2, coordinates: [1,2], speed: 60, acceleration: 3, newPolyline: false }).save();

        while (this.isRunning) {
            await new Promise(resolve => {
                Car.getAll().then(cars => {
                    cars.forEach(async car => {
                        await this.updateState(car);
                        this.goToNextTimeStep();
                        resolve(true);
                    });
                });
            })
        }
    }

    /** @desc обновить состояние автомобиля */
    updateState(car) {
        return new Promise(resolve => {
            resolve(
                new Promise(resolve => resolve(car))
            // .then(car => this.checkIsTurnedToNewPolyline(car))
            // .then(car => this.isThereCarAhead(ca))
            // .then(car => this.checkIsNearToCrossroad(car))
            // .then(car => this.checkIsNeedToChangePolyline(car))
            .then(car => this.checkIsCanAccelerate(car))
            .then(car => car.update()))
        })
        
    }

    /** @desc Проверить. Автомобиль повернул на новый перегон */
    checkIsTurnedToNewPolyline(car) {
        if (car.isTurnedToNewPolyline) {

        }
        
        car.polyline_id = car.polyline_id + 10;
        return new Promise(resolve => resolve(car))
    }

    isThereCarAhead(car) {
        if (car.isThereCarAhead) {

        }
    }

    checkIsNearToCrossroad(car) {
        if (car.isNearToCrossroad) {
            // todo something
        }

        car.polyline_id = car.polyline_id + 10;
        return new Promise(resolve => resolve(car));
    }

    checkIsNeedToChangePolyline(car) {
        if (car.isNeedToChangePolyline) {
            // todo something
        }

        car.polyline_id = car.polyline_id + 10;
        return new Promise(resolve => resolve(car));
    }

    checkIsCanAccelerate(car) {
        if (car.isCanAccelarate) {
            car.acceleration = 3;
            car.speed = Number(car.speed) + car.acceleration * 0.3;
        }
        
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
