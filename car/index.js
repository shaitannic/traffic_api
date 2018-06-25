const { database } = require('../db');
const RandomHelper = require('../helpers/random.helper');
const Polyline = require('../polyline');

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

    /** @desc текущее расстояние между машинами */
    static getCurrentDistance(car, carAhead) {
        return carAhead.position - car.position;
    }

    /** @desc безопасное расстояние между машинами */
    static getSafetyDistance(car) {
        return car.speed * car.speed / (2 * car.accelarate);
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

    /** @desc Удалить из БД */
    delete() {
        const serializedObject = this.serialize(this);
        return database.deleteCar(car);
    }

    /** @desc Обновить автомобиль */
    update() {
        const serializedObject = this.serialize(this);
        return database.updateCar(serializedObject);
    }

    /** @desc Тормозить */
    brake() {
        const time = 0.3

        this.position = Number(this.position) + Number(this.speed) * time + Number(- this.acceleration) * time * time / 2;
        this.speed = Number(this.speed) - this.acceleration * time;
    }

    accelarate() {
        const time = 0.3;
        this.position = Number(this.position) + Number(this.speed) * time + Number(this.acceleration) * time * time / 2;
        this.speed = Number(this.speed) + this.acceleration * step;
    }

    /*async get currentPolyline() {
        return await this.pool.query(`SELECT * FROM polylines WHERE object_id = ${this.polylineId}`);
    }*/

    /** @desc Проверка. Автомобиль повернул на новый перегон */
    get isTurnedToNewPolyline() {
        return this.newPolyline;
    }

    /** @desc Проверка. Автомобиль должен быть уничтожен */
    async mustBeDropped() {
        /*let polyline = await Polyline.getById(this.polylineId);

        let inputStream = polyline.inputStream;
        let outputStream = polyline.outputStream;

        if (inputStream < outputStream) {
            return false;
        } else {
            return RandomHelper.canBeSelected(probability);
        }*/
        return false;
    }

    /** @desc Получить впередиидущий автомобиль */
    async getCarAhead() {
        let data = await database.getCarAhead(this);
        let car = data.rows[0];
        return new Promise(resolve => resolve(car));
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
    get isCanAccelerate() {
        /*return new Promise(resolve => {
            setTimeout(() => {
                resolve(this)
            }, 1000)
        });*/
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