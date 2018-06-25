const { database } = require('../db');

class Polyline {
    constructor(params) {
        this.objectId = params.objectId || params.object_id;
        this.geometryCoordinates = params.geometryCoordinates || params.geometry_coordinates;
        this.countOfBands = params.countOfBands || params.count_of_bands;
        this.inputStream = params.inputStream || params.input_stream;
        this.outputStream = params.outputStream || params.output_stream;
    }

    static async getAll() {
        let data = await database.polylines();
        let polylines = [];

        data.rows.forEach(params => polylines.push(new Polyline(params)));

        return new Promise(resolve => resolve(polylines));
    }

    static async getById(id) {
        let data = await database.getPolylineById(id);
        let polyline = new Polyline(data.rows[0]);
        return new Promise(resolve => resolve(polyline));
    }

    /** @desc Сериализатор для БД */
    serialize(params) {
        const object = {
            object_id: params.objectId,
            geometry_coordinates: `{${params.geometryCoordinates.join(',')}}`,
            count_of_bands: params.countOfBands,
            input_stream: params.inputStream,
            output_stream: params.outputStream
        }

        return object;
    }

    /** @desc Сохранение в БД */
    save() {
        const serializedObject = this.serialize(this);
        return database.savePolyline(serializedObject);
    }
}

module.exports = Polyline;