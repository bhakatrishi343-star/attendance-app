const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  console.log("Data directory not found. Creating it:", dataDir);
  fs.mkdirSync(dataDir);
}

// Initialize Datastores
const users = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true });
const attendance = Datastore.create({ filename: path.join(dataDir, 'attendance.db'), autoload: true });

console.log("Database Initialized.");

module.exports = {
  users,
  attendance
};
