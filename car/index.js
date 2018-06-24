const { database } = require('../db');

class Car {
    constructor(params) {
        this.polylineId = params.polylineId;
        this.coordinates = params.coordinates;
        this.speed = params.speed;
        this.acceleration = params.acceleration;
        this.newPolyline = params.newPolyline;
    }

    static getAll () {
        return database.cars();
    }

    /** @desc Сериализатор для БД */
    serialize(params) {
        const object = {
            polyline_id: params.polylineId,
            coordinates: `{${params.coordinates.join(',')}}`,
            speed: params.speed,
            acceleration: params.acceleration,
            new_polyline: params.newPolyline
        }

        return object;
    }

    /** @desc Сохранение в БД */
    save() {
        const serializedObject = this.serialize(this);
        return database.saveCar(serializedObject);
    }

    /** @desc Обновить автомобиль */
    update() {
        const serializedObject = this.serialize(this);
        return database.updateCar(serializedObject);
    }

    /** @desc Проверка. Автомобиль повернул на новый перегон */
    get isTurnedToNewPolyline() {
        return this.newPolyline;
    }

    /** @desc Проверка. Впереди есть автомобиль */
    get isThereCarAhead() {
        return false;
    }

    /** @desc Проверка. Автомобиль приблизился к перекрестку */
    get isNearToCrossroad() {
        return false;
    }

    /** @desc Проверка. Нужно сменить перегон */
    get isNeedToChangePolyline() {
        return false;
    }

    /** @desc Проверка. Можно ускориться (увеличить скорость) */
    get isCanAccelarate() {
        return false;
    }

    /*
    get nextAuto() {
        // return автомобиль, движущийся спереди на текущем перегоне
    }

    get distanceToNextAuto() {
        // return дистанцию до впереди идущего автомобиля на текущем перегоне
    }

    get safeDistanceForCurrentSpeed() {
        // return безопасное расстояние для текущей скорости
    }*/

    /**@desc остановить автомобиль */
    /*stop() {
        this.speed = 0;
        this.acceleration = 0;
    }

    toBrake() {
        // тормозить
    }

    toAccelerate() {
        // ускоряться
    }*/
}

module.exports = Car;