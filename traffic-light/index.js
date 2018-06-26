const { database } = require('../db');
const position = 1000;

class TrafficLight {
    constructor(params) {
        this.id = params.id;
        this.coordinates = params.coordinates;
        this.periodTime = params.periodTime || params.period_time;
        this.isRed = params.isRed || params.is_red;
    }

    static async getById(id) {
        let data = await database.getTrafficLightById(id);
        let result = new TrafficLight(data.rows[0]);
        return new Promise(resolve => resolve(result));
    }

    async getCurrentDistanceFor(car) {
        // let trafficLight = await TrafficLight.getById(1);
        return position - car.position;
    }

    toggleSignal() {
        this.isRed = !this.isRed;
    }

    /** @desc Сериализатор для БД */
    serialize(params) {
        const object = {
            id: params.id,
            coordinates: `{${params.coordinates.join(',')}}`,
            is_red: params.isRed,
            period_time: params.periodTime
        }

        return object;
    }

    /** @desc Сохранение в БД */
    save() {
        const serializedObject = this.serialize(this);
        return database.saveTrafficLight(serializedObject);
    }

    /** @desc Обновить светофор */
    update() {
        const serializedObject = this.serialize(this);
        return database.updateTrafficLight(serializedObject);
    }
}

module.exports = TrafficLight;
