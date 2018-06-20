const { BehaviorSubject } = require('rxjs');

class TimeHandler {
    constructor() {
        this.a = 777;
        this.isCalculated = new BehaviorSubject(false);
    }

    init() {
        this.currentTime.subscribe(x => {
            console.log(x);
        })
    }
}

module.exports = TimeHandler;
