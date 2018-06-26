const { database } = require('../db');
const CONSTS = require('../consts');

class TrafficLight {
    constructor(params) {
        this.id = params.id;
        this.coordinates = params.coordinates;
        this.periodTime = params.periodTime || params.period_time;
        this.isRed = params.isRed;
    }

    static async getById(id) {
        let data = await database.getTrafficLightById(id);
        let result = new TrafficLight(data.rows[0]);
        return new Promise(resolve => resolve(result));
    }

    async getCurrentDistanceFor(car) {
        // let trafficLight = await TrafficLight.getById(1);
        return CONSTS.polylineLength - car.position;
    }

    isAllowedTraffic(car) {
        switch(car.polylineId) {
            case 1: return this.isRed;
            case 2: return this.isRed;
            case 3: return !this.isRed;
            case 4: return !this.isRed;
        }
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

    async next() {
        if (this.periodTime < CONSTS.trafficInterval) {
            this.periodTime += CONSTS.step;
        } else {
            this.periodTime = 0; 
            this.toggleSignal();
        }
        await this.update();

        return new Promise(resolve => resolve());
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
