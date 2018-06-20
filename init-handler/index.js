const { BehaviorSubject }   = require('rxjs');
const { takeUntil }         = require('rxjs/Operator');
const { database }          = require('../db');
const Car = require('../car');
const Road = require('../road');

const step = 0.3;

class InitHandler {
    constructor() {
        this.currentTime = new BehaviorSubject(10);
    }

    get isRunning() {
        return this.currentTime.getValue() <= 10;
    }

    async init(items) {
        // while (this.isRunning) {
            await this.delayedLog();
            // todo добавить асинхронные вычисления
            // this.goToNextStep();
        // }
    }

    async delayedLog() {
        // console.log(this.currentTime.getValue());

        const params = {
            startCoordinate: [1, 2],
            endCoordinate: [10, 15],
            countOfBands: 3,
            inputStream: 400,
            outputStream: 800
        }
        this.road = new Road(params);
        this.road.save();

        // return new Promise(resolve => setTimeout(resolve, 1000));
    }

    goToNextStep() {
        this.currentTime.next(this.currentTime.getValue() + step);
    }
}

module.exports = {
    initHandler: new InitHandler()
};
