'use strict'

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap');

async function printDB() {
  let result = await db.all("select * from EXPTable");
  console.log("Token", result);
}

async function tokenUpdate(name, token) {
  const cmd_1 = "select * from TokenTable where name=?";
  let result = await db.all(cmd_1, [name]);
  if(result.length == 0) {
    const cmd_2 = "insert into TokenTable (name, token) values (?,?)";
    await db.run(cmd_2, [name, token]);
  } else {
    const cmd_3 = "update TokenTable set token=? where name=?";
    await db.run(cmd_3, [token, name]);
  }
}

async function EXPUpdate(id, num, time) {
  const cmd_1 = "select * from EXPTable where id=?";
  let result = await db.all(cmd_1, [id]);
  if(result.length == 0) {
    const cmd_2 = "insert into EXPTable (id, exp, time) values (?,?,?)";
    await db.run(cmd_2, [id, num, time]);
  } else {
    if((Number(time) - Number(result[0].time)) >= 60000) {
      const cmd_3 = "update EXPTable set exp=?, time=? where id=?";
      await db.run(cmd_3, [result[0].exp + num, time, id]);
    }
  }
}

async function tokenRetrieve(name) {
  const cmd = "select * from TokenTable where name=?";
  let result = await db.all(cmd, [name]);
  return result[0];
}

async function EXPRetrieve(id) {
  const cmd = "select * from EXPTable where id=?";
  let result = await db.all(cmd, [id]);
  return result[0];
}

async function newAnimate(link) {
  const cmd = "insert into AnimateTable (link) values (?)";
  await db.run(cmd, [link]);
}

async function sizeDB() {
  let result = await db.all("select * from AnimateTable order by rowIdNum desc limit 1");
  if(typeof result[0] == "undefined") {
    return 0;
  } else {
    return result[0].rowIdNum;
  }
}

async function retrieveGif(id) {
  const cmd = "select * from AnimateTable where rowIdNum = ?";
  let result = await db.get(cmd, [id]);
  if(typeof result == "undefined") {
    throw `Gif [${id}] does not exist`;
  }
  return result.link;
}

async function deleteGif(id) {
  let cmd_3 = "select * from AnimateTable where rowIdNum = ?"
  let san = await db.all(cmd_3, [id]);
  if(san.length == 0) {
    throw `Gif [${id}] does not exist!`;
  }
  console.log(san.length);
  const cmd_1 = "delete from AnimateTable where rowIdNum = ?";
  await db.run(cmd_1, [id]);
  let temp = await db.all("select * from AnimateTable");
  const cmd_2 = "drop table AnimateTable";
  await db.run(cmd_2);
  db.run("CREATE TABLE AnimateTable (rowIdNum INTEGER PRIMARY KEY, link TEXT)")
  .then(() => {
    for(let i = 0; i < temp.length; i++) {
      newAnimate(temp[i].link);
    }
  });
}

async function deleteTable() {
  const cmd = "drop table EXPTable";
  await db.run(cmd);
}

module.exports.printDB = printDB;
module.exports.newAnimate = newAnimate;
module.exports.sizeDB = sizeDB;
module.exports.retrieveGif = retrieveGif;
module.exports.deleteGif = deleteGif;
module.exports.tokenUpdate = tokenUpdate;
module.exports.tokenRetrieve = tokenRetrieve;
module.exports.EXPUpdate = EXPUpdate;
module.exports.EXPRetrieve = EXPRetrieve;
module.exports.deleteTable = deleteTable;
