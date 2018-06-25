const { BehaviorSubject }   = require('rxjs');
const { takeUntil }         = require('rxjs/Operator');
const { database }          = require('../db');
const Car = require('../car');
const Polyline = require('../polyline');

const step = 1;

class InitHandler {
    constructor() {
        this.currentTime = new BehaviorSubject(0);
        this.cars = [];
        this.carId = 0;
    }

    /** @desc инициализация автомата */
    async init(items) {
        await this.initialize();

        while (this.isRunning) {
            await this.createCars();
            let cars = await Car.getAll();

            for(let i = 0; i < cars.length; i ++) {
                let car = cars[i];
                await this.updateState(car);
                this.goToNextTimeStep();
            }
        }
        console.log('done');
    }

    async initialize() {
        await database.clearTables();

        await this.createInitialPolylines();
        await this.createInitialCars();
    }

    /** @desc обновить состояние автомобиля */
    async updateState(car) {
        /*if (car.isTurnedToNewPolyline) {    // автомобиль повернул на новый полигон
            if (car.mustBeDropped) {
                await car.delete();
            }
        }*/

        debugger
        let carAhead = await car.getCarAhead();
        if (carAhead) {
            console.log(carAhead);
        }
/*
        car = await this.checkIsNearToCrossroad(car)
        car = await this.checkIsNeedToChangePolyline(car)
        car = await this.checkIsCanAccelerate(car)
        await car.update();
        return new Promise(resolve => resolve());*/
    }

    checkIsNearToCrossroad(car) {
        if (car.isNearToCrossroad) {
            // todo update car state
        }

        return new Promise(resolve => resolve(car));
    }

    checkIsNeedToChangePolyline(car) {
        if (car.isNeedToChangePolyline) {
            // todo update car state
        }

        return new Promise(resolve => resolve(car));
    }

    async checkIsCanAccelerate(car) {
        if (car.isCanAccelerate) {
            const time = this.currentTime.getValue();
            car.position = Number(car.position) + Number(car.speed) * time + Number(car.acceleration) * time * time / 2;
            car.speed = Number(car.speed) + car.acceleration * 0.3;
        }

        return new Promise(resolve => resolve(car));
    }

    get isInitial() {
        return this.currentTime.getValue() === 0;
    }

    /** @desc нужно создать новую машину */
    isNeedToCreateNewCar(interval) {
        return this.currentTime.getValue() >= step && (this.currentTime.getValue() + 0.01) % interval < step;
    }

    async createInitialPolylines() {
        await new Polyline({ objectId: 1, geometryCoordinates: [0, 1000], countOfBands: 3, inputStream: 2300, outputStream: 500}).save();
        await new Polyline({ objectId: 2, geometryCoordinates: [1000, 2000], countOfBands: 3, inputStream: 2300, outputStream: 500}).save();
        await new Polyline({ objectId: 3, geometryCoordinates: [2000, 1000], countOfBands: 3, inputStream: 2300, outputStream: 500}).save();
        await new Polyline({ objectId: 4, geometryCoordinates: [1000, 0], countOfBands: 3, inputStream: 2300, outputStream: 500}).save();

        this.polylines = await Polyline.getAll();
    }

    async createInitialCars() {
        for (let i = 0; i < this.polylines.length; i ++) {
            let polyline = this.polylines[i];
            await new Car({id: parseInt(this.carId += 1), polylineId: parseInt(polyline.objectId), coordinates: [1,2], speed: 60, position: 0, acceleration: 3, newPolyline: false }).save();
        }
    }

    async createCars() {
        for(let i = 0; i < this.polylines.length; i ++) {
            let polyline = this.polylines[i];
            let interval = ~~(3600 / polyline.inputStream);

            if (this.currentTime.getValue() !== 0 && this.isNeedToCreateNewCar(interval)) {
                await new Car({id: this.carId += 1, polylineId: parseInt(polyline.objectId), coordinates: [1,2], speed: 60, position: 0, acceleration: 3, newPolyline: false }).save();
            }
        }
        return new Promise(resolve => resolve());
    }

    /** @desc программа запущена (время от 0 до 3600 секунд с шагом 0.3) */
    get isRunning() {
        return this.currentTime.getValue() <= 5;
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
