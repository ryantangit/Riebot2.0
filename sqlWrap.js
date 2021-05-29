'use strict'

const sql = require('sqlite3');
const util = require('util');

const db = new sql.Database("general.db");

let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='AnimateTable' ";

db.get(cmd, function (err, val) {
  if (typeof val == "undefined") {
        console.log("No Animate database file - creating one");
        createAnimateTable();
  } else {
        console.log("Animate Database file found");
  }
});

function createAnimateTable() {
  const cmd = 'CREATE TABLE AnimateTable (rowIdNum INTEGER PRIMARY KEY, link TEXT UNIQUE)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database Creation Failure", err.message);
    } else {
      console.log("Created Animate Database");
    }
  });
}


cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='TokenTable' ";

db.get(cmd, function (err, val) {
  if (typeof val == "undefined") {
        console.log("No Token database file - creating one");
        createTokenTable();
  } else {
        console.log("Token Database file found");
  }
});

function createTokenTable() {
  const cmd = 'CREATE TABLE TokenTable (rowIdNum INTEGER PRIMARY KEY, name TEXT, token TEXT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database Creation Failure", err.message);
    } else {
      console.log("Created Token Database");
    }
  });
}

cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='EXPTable' ";

db.get(cmd, function (err, val) {
  if (typeof val == "undefined") {
        console.log("No EXP database file - creating one");
        createEXPTable();
  } else {
        console.log("EXP Database file found");
  }
});

function createEXPTable() {
  const cmd = 'CREATE TABLE EXPTable (rowIdNum INTEGER PRIMARY KEY, id INTEGER, exp INTEGER, time TEXT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database Creation Failure", err.message);
    } else {
      console.log("Created EXP Database");
    }
  });
}


// wrap all database commands in promises
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

// empty all data from db
db.deleteEverything = async function() {
    await db.run("delete from ActivityTable");
    db.run("vacuum");
}

// allow code in index.js to use the db object
module.exports = db;
module.exports.createAnimateTable = createAnimateTable;
