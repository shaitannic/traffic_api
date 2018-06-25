const { database } = require('../db');

class Result {
    constructor(params) {
        this.carId = params.carId || params.car_id;
        this.polylineId = params.polylineId || params.polyline_id;
        this.startTime = params.startTime || params.start_time;
        this.endTime = params.endTime || params.end_time;
    }

    static async getById(id) {
        let data = await database.getResultById(id);
        let polyline = new Polyline(data.rows[0]);
        return new Promise(resolve => resolve(polyline));
    }

    /** @desc Сериализатор для БД */
    serialize(params) {
        const object = {
            car_id: params.carId,
            polyline_id: params.polylineId,
            start_time: params.startTime,
            end_time: params.endTime
        }

        return object;
    }

    /** @desc Сохранение в БД */
    save() {
        const serializedObject = this.serialize(this);
        return database.saveResult(serializedObject);
    }
}

module.exports = Result;
