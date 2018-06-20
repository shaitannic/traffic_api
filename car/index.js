const database = require('../db');

class Car {
    constructor() {
        this.speed = 30;
        this.acceleration = 0;
        this.coordinate = [0,0];
        this.road_id = 0;
    }

    save() {
        const car = {
            speed: this.speed,
            acceleration: this.acceleration,
            coordinate: this.coordinate,
            road_id: this.road_id
        }
    }

    get all() {
        this.users = database.users();
    }

    get nextAuto() {
        // return автомобиль, движущийся спереди на текущем перегоне
    }

    get distanceToNextAuto() {
        // return дистанцию до впереди идущего автомобиля на текущем перегоне
    }

    get safeDistanceForCurrentSpeed() {
        // return безопасное расстояние для текущей скорости
    }

    /**@desc остановить автомобиль */
    stop() {
        this.speed = 0;
        this.acceleration = 0;
    }

    toBrake() {
        // тормозить
    }

    toAccelerate() {
        // ускоряться
    }
}

module.exports = Car;