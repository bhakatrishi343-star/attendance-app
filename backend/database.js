const Datastore = require('nedb-promises');
const path = require('path');

// Initialize Datastores
const users = Datastore.create({ filename: path.join(__dirname, 'data/users.db'), autoload: true });
const attendance = Datastore.create({ filename: path.join(__dirname, 'data/attendance.db'), autoload: true });

module.exports = {
  users,
  attendance
};
