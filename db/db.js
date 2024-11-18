const sqlite3 = require("sqlite3").verbose();
var path = require("path");

const dbFilePath = path.resolve(process.cwd(), "./db/freaky-fashion.db")

const db = new sqlite3.Database (dbFilePath, sqlite3.OPEN_READWRITE, (err) => {
    if(err) return console.error (err.message)
})

module.exports = db;