let fs = require('fs');

let sql = fs.readFileSync('_1.sql').toString();
console.log(sql);
