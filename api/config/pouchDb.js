var PouchDB = require('pouchdb');

var settingsDb = new PouchDB('db/settings');
var organizersDb = new PouchDB('db/organizers');


module.exports = { organizersDb, settingsDb };