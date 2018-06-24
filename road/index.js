const { database } = require('../db');

class Road {
    constructor(params) {
        this.startCoordinate = params.startCoordinate;
        this.endCoordinate = params.endCoordinate;
        this.countOfBands = params.countOfBands;
        this.inputStream = params.inputStream;
        this.outputStream = params.outputStream;
    }

    /** @desc Сериализатор для БД */
    serialize(params) {
        const object = {
            start_coordinate: `{${params.startCoordinate.join(',')}}`,
            end_coordinate: `{${params.endCoordinate.join(',')}}`,
            count_of_bands: params.countOfBands,
            input_stream: params.inputStream,
            output_stream: params.outputStream
        }

        return object;
    }

    /** @desc Сохранение в БД */
    save() {
        const serializedObject = this.serialize(this);
        database.saveRoad(serializedObject);
    }
}

module.exports = Road;