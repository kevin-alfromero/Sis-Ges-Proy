const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/db.json");

// Lee toda la base de datos
function readDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

// Guarda toda la base de datos
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Genera un ID único simple
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

module.exports = { readDB, writeDB, generateId };
