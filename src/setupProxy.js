/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// The node version of PouchDB (without browser stuff)
const PouchDB = require("pouchdb-node");
const expressPouchDB = require("express-pouchdb");

const PrefixedPouch = PouchDB.defaults({
  prefix: "db/", // All PouchDB data will be stored in the directory ./db/*
});

module.exports = function (app) {
  // app is the Create-React-App dev server.
  // Our databases will be available at http://localhost:3000/db/*
  app.use("/db", expressPouchDB(PrefixedPouch));
};