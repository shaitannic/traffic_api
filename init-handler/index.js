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

        this.polyline_1 = new Polyline({
            objectId: 1,
            length: 100,
            geometryCoordinates: [1,2],
            countOfBands: 3,
            inputStream: 2300,
            outputStream: 500
        });

        this.polyline_2 = new Polyline({
            objectId: 2,
            length: 200,
            geometryCoordinates: [5,7],
            countOfBands: 3,
            inputStream: 500,
            outputStream: 700
        });

        this.polyline_3 = new Polyline({
            objectId: 3,
            length: 150,
            geometryCoordinates: [5,7],
            countOfBands: 3,
            inputStream: 900,
            outputStream: 700
        });

        this.polyline_4 = new Polyline({
            objectId: 4,
            length: 50,
            geometryCoordinates: [5,7],
            countOfBands: 3,
            inputStream: 200,
            outputStream: 700
        });

        this.polylines = [this.polyline_1, this.polyline_2, this.polyline_3, this.polyline_4];
    }

    /** @desc инициализация автомата */
    async init(items) {
        await database.clearTables();
        await new Car({id: this.carId += 1, polylineId: 1, coordinates: [1,2], speed: 60, position: 0, acceleration: 3, newPolyline: false }).save();
        await new Car({id: this.carId += 1, polylineId: 2, coordinates: [1,2], speed: 60, position: 0, acceleration: 3, newPolyline: false }).save();
        await new Car({id: this.carId += 1, polylineId: 3, coordinates: [1,2], speed: 60, position: 0, acceleration: 3, newPolyline: false }).save();
        await new Car({id: this.carId += 1, polylineId: 4, coordinates: [1,2], speed: 60, position: 0, acceleration: 3, newPolyline: false }).save();

        while (this.isRunning) {
            await this.createCars();
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

    createCars() {
        return new Promise(async resolve => {
            this.polylines.forEach(async polyline => {
                const interval = ~~(3600 / polyline.inputStream);

                if (this.currentTime.getValue() !== 0 && this.isNeedToCreateNewCar(interval)) {
                    await new Car({id: this.carId += 1, polylineId: polyline.objectId, coordinates: [1,2], speed: 60, position: 0, acceleration: 3, newPolyline: false }).save();
                }
            })
            resolve();
        })
    }

    /** @desc программа запущена (время от 0 до 3600 секунд с шагом 0.3) */
    get isRunning() {
        return this.currentTime.getValue() <= 10;
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
