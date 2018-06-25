const { Pool } = require('pg');

const DATABASE = 'traffic';
const PGUSER = 'andy';
const PGPASSWORD = 'andy';
const PORT = 5432;

class Database {
    constructor() {
        this.pool = new Pool({
            database: DATABASE,
            user: PGUSER,
            password: PGPASSWORD,
            port: PORT,
        });
    }

    saveCar(car) {
        const keys = Object.keys(car);
        const values = Object.values(car);
        const query = `INSERT INTO cars (${keys.join(', ')}) VALUES ('${values.join("', '")}')`;

        return this.pool.query(query);
    }

    savePolyline(polyline) {
        const keys = Object.keys(polyline);
        const values = Object.values(polyline);
        const query = `INSERT INTO polylines (${keys.join(', ')}) VALUES ('${values.join("', '")}')`;

        return this.pool.query(query);
    }

    updateCar(car) {
        const keys = Object.keys(car);
        const values = Object.values(car);
        const query = `UPDATE cars SET (${keys.join(', ')}) = ('${values.join("', '")}') WHERE id = ${car.id}`;

        return this.pool.query(query);
    }

    deleteCar(car) {
        return this.pool.query(`DELETE FROM cars WHERE id = ${car.id}`); 
    }

    cars() {
        return this.pool.query(`SELECT * FROM cars`);
    }

    polylines() {
        return this.pool.query(`SELECT * FROM polylines`);
    }

    getPolylineById(id) {
        return this.pool.query(`SELECT * FROM polylines WHERE object_id = ${id}`)
    }

    getCarAhead(car) {
        return this.pool.query(`SELECT * FROM cars
                                WHERE polyline_id = ${car.polylineId}
                                AND position > ${car.position}
                                ORDER BY position
                                LIMIT 1`);
    }

    saveResult(result) {
        const keys = Object.keys(result);
        const values = Object.values(result);
        const query = `INSERT INTO results (${keys.join(', ')}) VALUES ('${values.join("', '")}')`;

        return this.pool.query(query);
    }

    updateResult(result) {
        const keys = Object.keys(result);
        const values = Object.values(result);
        const query = `UPDATE results SET (${keys.join(', ')}) = ('${values.join("', '")}') WHERE car_id = ${result.car_id}`;

        return this.pool.query(query);
    }

    getResultById(id) {
        return this.pool.query(`SELECT * FROM results WHERE car_id = ${id}`)
    }

    /** Удалить все записи из таблиц */
    async clearTables() {
        const tables = ['polylines', 'directions', 'cars', 'results'];
        for (let i = 0; i < tables.length; i ++) {
            await this.pool.query(`DELETE FROM ${tables[i]}`);
        }
    }

    async end() {
        await this.pool.end();
    }
}

module.exports = {
    database: new Database()
}
