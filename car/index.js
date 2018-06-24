const { database } = require('../db');

class Car {
    constructor(params) {
        this.id = params.id;
        this.polylineId = params.polylineId || params.polyline_id;
        this.coordinates = params.coordinates;
        this.speed = params.speed;
        this.position = params.position;
        this.acceleration = params.acceleration;
        this.newPolyline = params.newPolyline || params.new_polyline === 't';
    }

    static getAll () {
        return new Promise(resolve => {
            resolve(database.cars().then(data => {
                let cars = [];
                data.rows.forEach(params => {
                    cars.push(new Car(params));
                })
                return new Promise(resolve => resolve(cars));
            }))
        })
    }

    /** @desc Сериализатор для БД */
    serialize(params) {
        const object = {
            id: params.id,
            polyline_id: params.polylineId,
            coordinates: `{${params.coordinates.join(',')}}`,
            speed: params.speed,
            position: params.position,
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

    /*async get currentPolyline() {
        return await this.pool.query(`SELECT * FROM polylines WHERE object_id = ${this.polylineId}`);
    }*/

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
        return true;
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