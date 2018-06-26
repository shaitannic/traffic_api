const { BehaviorSubject }   = require('rxjs');
const { takeUntil }         = require('rxjs/Operator');
const { database }          = require('../db');
const CONSTS = require('../consts');
const Car = require('../car');
const Polyline = require('../polyline');
const Result = require('../result');
const TrafficLight = require('../traffic-light');

class InitHandler {
    constructor() {
        this.currentTime = 1;
        this.cars = [];
        this.carId = 0;
    }

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
        await this.createTrafficLights();
        await this.createInitialPolylines();
        await this.createInitialCars();

        return new Promise(resolve => resolve());
    }

    async updateState(car) {
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
        let currentDistanceToTrafficLights = await this.trafficLight.getCurrentDistanceFor(car); // todo получить расстояние до светофора
        let safetyDistanceToTrafficLight = Car.getSafetyDistance(car);

        if (currentDistanceToTrafficLights < safetyDistanceToTrafficLight){
            if (!this.trafficLight.isAllowedTraffic(car)) {
                car.brake();
            }
        } else {
            car = await this.checkIsCanAccelerate(car)
        }

        return new Promise(resolve => resolve(car));
    }

    async checkIsCanAccelerate(car) {
        if (car.speed < 80) {
            car.accelerate();
        }

        return new Promise(resolve => resolve(car));
    }

    get isInitial() {
        return this.currentTime === 0;
    }

    isNeedToCreateNewCar(interval) {
        return this.currentTime >= CONSTS.step && (this.currentTime + 0.01) % interval < CONSTS.step;
    }

    async createTrafficLights() {
        this.trafficLight = new TrafficLight({ id: 1, coordinates: [CONSTS.polylineLength, CONSTS.polylineLength], isRed: false, periodTime: 0.1});
        await this.trafficLight.save();
    }

    async createInitialPolylines() {
        await new Polyline({    objectId: 1, geometryCoordinates: [0, CONSTS.polylineLength],
                                countOfBands: 3, inputStream: 2300, outputStream: 500}).save();
        await new Polyline({    objectId: 2, geometryCoordinates: [CONSTS.polylineLength, 2 * CONSTS.polylineLength],
                                countOfBands: 3, inputStream: 2300, outputStream: 500}).save();
        await new Polyline({    objectId: 3, geometryCoordinates: [2 * CONSTS.polylineLength, CONSTS.polylineLength],
                                countOfBands: 3, inputStream: 2300, outputStream: 500}).save();
        await new Polyline({    objectId: 4, geometryCoordinates: [CONSTS.polylineLength, 0],
                                countOfBands: 3, inputStream: 2300, outputStream: 500}).save();

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

    get isRunning() {
        return this.currentTime <= CONSTS.interval;
    }

    async goToNextTimeStep() {
        if (this.currentTime > 1000) {
            console.log('------1000------');
        }
        this.currentTime = this.currentTime + CONSTS.step;
        await this.trafficLight.next();
    }
}

module.exports = {
    initHandler: new InitHandler()
};
