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

    async test() {
        const res = await this.pool.query('SELECT $1::text as message', ['Hello world!'])
        console.log(res.rows[0].message) // Hello world!
    }

    async addUser() {
        await this.pool.query("INSERT into users (name, count) VALUES ('Andrew', 1)");
    }

    async users() {
        return await this.pool.query("SELECT * FROM users");
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
