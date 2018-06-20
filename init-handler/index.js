const { BehaviorSubject } = require('rxjs');
const { takeUntil } = require('rxjs/Operator');

const step = 0.3;

class InitHandler {
    constructor() {
        this.currentTime = new BehaviorSubject(10);
    }

    get isRunning() {
        return this.currentTime.getValue() < 11;
    }

    async init(items) {
        while (this.isRunning) {
            await this.delayedLog();
            // todo добавить асинхронные вычисления
            this.goToNextStep();
        }
    }

    async delayedLog() {
        console.log(this.currentTime.getValue());
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    goToNextStep() {
        this.currentTime.next(this.currentTime.getValue() + step);
    }
}

module.exports = InitHandler;
