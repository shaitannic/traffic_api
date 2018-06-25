const { BehaviorSubject }   = require('rxjs');
const { takeUntil }         = require('rxjs/Operator');
const { database }          = require('../db');
const Car = require('../car');
const Polyline = require('../polyline');
const Result = require('../result');
const TrafficLight = require('../traffic-light');

const step = 0.3;

class InitHandler {
    constructor() {
        this.currentTime = 1;
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

        return new Promise(resolve => resolve());
    }

    /** @desc обновить состояние автомобиля */
    async updateState(car) {
        /*if (car.isTurnedToNewPolyline) {    // автомобиль повернул на новый полигон
            if (car.mustBeDropped) {
                await car.delete();
            }
        }*/

        // debugger
        let carAhead = await car.getCarAhead();
        if (carAhead) {
            let currentDistance = Car.getCurrentDistance(car, carAhead);
            let safetyDistance = Car.getSafetyDistance(car);
            if (currentDistance < safetyDistance) {
                car.brake();
            } else {
                car = await this.checkIsCanAccelerate(car)
            }
        } else {
            car = await this.checkIsNearToCrossroad(car)
        }

        await car.update();
        await this.checkIsFinished(car);
        return new Promise(resolve => resolve());
    }

    async checkIsFinished(car) {
        let polyline = await Polyline.getById(car.polylineId);

        if (polyline.length < car.position) {
            let result = await Result.getById(car.id);
            result.endTime = this.currentTime;
            await result.update();
            await car.delete();
        }
        return new Promise(resolve => resolve(car));
    }

    async checkIsNearToCrossroad(car) {
        let currentDistanceToTrafficLights = TrafficLight.getCurrentDistanceFor(car); // todo получить расстояние до светофора
        let safetyDistanceToTrafficLight = Car.getSafetyDistance(car);

        if (currentDistanceToTrafficLights < safetyDistanceToTrafficLight) {
            car.brake();
        } else {
            car = await this.checkIsCanAccelerate(car)
        }

        return new Promise(resolve => resolve(car));
    }

    /*checkIsNeedToChangePolyline(car) {
        if (car.isNeedToChangePolyline) {
            // todo update car state
        }

        return new Promise(resolve => resolve(car));
    }*/

    async checkIsCanAccelerate(car) {
        if (car.speed < 80) {
            car.accelerate();
        }

        return new Promise(resolve => resolve(car));
    }

    get isInitial() {
        return this.currentTime === 0;
    }

    /** @desc нужно создать новую машину */
    isNeedToCreateNewCar(interval) {
        return this.currentTime >= step && (this.currentTime + 0.01) % interval < step;
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
            let id = this.carId += 1;

            await new Car({id: parseInt(id), polylineId: parseInt(polyline.objectId), coordinates: [0,0], speed: 1, position: 0, acceleration: 3, newPolyline: false }).save();
            await new Result({carId: parseInt(id), polylineId: parseInt(polyline.objectId), startTime: this.currentTime, endTime: 1 }).save();
        }

        return new Promise(resolve => resolve());
    }

    async createCars() {
        for(let i = 0; i < this.polylines.length; i ++) {
            let polyline = this.polylines[i];
            let interval = ~~(3600 / polyline.outputStream);

            if (this.currentTime !== 0 && this.isNeedToCreateNewCar(interval)) {
                let id = this.carId += 1;

                await new Car({id: id, polylineId: parseInt(polyline.objectId), coordinates: [0,0], speed: 1, position: 0, acceleration: 3, newPolyline: false }).save();
                await new Result({carId: parseInt(id), polylineId: parseInt(polyline.objectId), startTime: this.currentTime, endTime: 1 }).save();
            }
        }

        return new Promise(resolve => resolve());
    }

    /** @desc программа запущена (время от 0 до 3600 секунд с шагом 0.3) */
    get isRunning() {
        return this.currentTime <= 1000;
    }
/*
    async operate() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }*/

    /** @desc увеличить временной шаг на 0,3 */
    goToNextTimeStep() {
        this.currentTime = this.currentTime + step;
    }
}

module.exports = {
    initHandler: new InitHandler()
};
