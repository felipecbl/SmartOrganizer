var PouchDB = require('pouchdb');
let dbPath = process.env.DATABASE_PATH ?? 'db';
console.log(`Database path: ${dbPath}`);
var settingsDb = new PouchDB(`${dbPath}/settings`);
var organizersDb = new PouchDB(`${dbPath}/organizers`);

module.exports = { organizersDb, settingsDb };