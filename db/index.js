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

    updateCar(car) {
        const keys = Object.keys(car);
        const values = Object.values(car);
        const query = `UPDATE cars SET (${keys.join(', ')}) = ('${values.join("', '")}') WHERE id = ${car.id}`;

        return this.pool.query(query);
    }

    cars() {
        return this.pool.query(`SELECT * FROM cars`);
    }

    /** Удалить все записи из таблиц */
    clearTables() {
        const tables = ['polylines', 'directions', 'cars'];
        tables.forEach(table_name => this.pool.query(`DELETE FROM ${table_name}`));
    }

    async saveRoad(road) {
        const keys = Object.keys(road);
        const values = Object.values(road);
        const query = `INSERT INTO roads (${keys.join(', ')}) VALUES ('${values.join("', '")}')`;

        return await this.pool.query(query).then(
            result => {
                console.log('success');
                console.log(result);
            },
            error => {
                console.log(error);
            });
    }

    async end() {
        await this.pool.end();
    }
}

module.exports = {
    database: new Database()
}
