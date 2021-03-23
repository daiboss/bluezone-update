/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import { Platform } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import moment from 'moment'

import { dev } from '../apis/server';

// TODO: Bo sung close db moi khi open:
// https://www.djamware.com/post/5caec76380aca754f7a9d1f1/react-native-tutorial-sqlite-offline-androidios-mobile-app

if (dev) {
  SQLite.DEBUG(true);
}

SQLite.enablePromise(false);

const database_name = 'app_db_3.db';
const database_version = '3.4';
const database_displayname = 'Bluezone health database';
const database_size = 30 * 1024 * 1024;

let db = null;

const open = () => {
  if (db != null) {
    return db;
  }
  if (Platform.OS === 'android') {
    db = SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      () => { },
      () => { },
    );
  } else {
    db = SQLite.openDatabase({
      name: database_name,
      location: 'Documents',
      database_version,
      database_displayname,
      database_size,
    });
  }
  return db;
};

const close = () => {
  if (db) {
    db.close();
    db = null;
  }
};

const initDatabase = (success, failure) => {
  db = open();
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='notify'",
      [],
      function (tx, res) {
        if (res.rows.length === 0) {
          tx.executeSql('DROP TABLE IF EXISTS notify');
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS notify(id INTEGER PRIMARY KEY AUTOINCREMENT, notifyId TEXT, smallIcon TEXT, largeIcon TEXT, title TEXT, text TEXT, bigText TEXT, titleEn TEXT, textEn TEXT, bigTextEn TEXT, _group TEXT, timestamp REAL, unRead REAL, data TEXT, level INTEGER)',
          );
          tx.executeSql(
            'CREATE UNIQUE INDEX idx_positions_title ON notify (notifyId)',
          );
        }
      },
    );
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='devLog'",
      [],
      function (tx, res) {
        if (res.rows.length === 0) {
          tx.executeSql('DROP TABLE IF EXISTS devLog');
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS devLog(id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp REAL, key TEXT, data TEXT)',
          );
        }
      },
    );
    // Step Counter
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='stepcounter'",
      [],
      function (tx, res) {
        if (res.rows.length === 0) {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS stepcounter(id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, starttime INTEGER, endtime INTEGER, step INTEGER)',
            [],
            (tx, results) => {
            }
          );
        }
      },
    );

    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='historyStepcounter'",
      [],
      function (tx, res) {
        if (res.rows.length === 0) {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS historyStepcounter(id INTEGER PRIMARY KEY AUTOINCREMENT, starttime INTEGER, resultStep TEXT)',
          );
        }
      },
    );
  });
};


// TODO Sua bo ham nay di





const removeAllHistory = async () => {
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(function (txn) {
      txn.executeSql(
        'delete from historyStepcounter',
        [],
        resolve,
        reject,
      );
    })
  })
}

const removeAllStep = async () => {
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(function (txn) {
      txn.executeSql(
        'delete from stepcounter',
        [],
        resolve,
        resolve,
      );
    })
  })
}

const removeAllStepDay = async (startDay, endDay) => {

  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(function (txn) {
      txn.executeSql(
        'delete from stepcounter where starttime >= ? and endtime <= ?',
        [startDay, endDay],
        resolve,
        resolve,
      );
    })
  })
}

const getListStepDay = async () => {
  let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix() * 1000
  let currentEndTime = moment().set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).unix() * 1000
  let SQL_QUERY = `SELECT * FROM stepcounter where starttime >= ${currentTime} and starttime < ${currentEndTime}`;
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(tx => {
      tx.executeSql(
        SQL_QUERY,
        [],
        (txTemp, results) => {
          let temp = [];
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          }
          resolve(temp);
        },
        () => {
          resolve([]);
        },
      );
    })
  })
};

// lấy tất cả các bước đi từ trước chưa lưu
const getListStepsBefore = async () => {
  let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
  let SQL_QUERY = `SELECT * FROM stepcounter where  starttime < ${currentTime * 1000}`;
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(tx => {
      tx.executeSql(
        SQL_QUERY,
        [],
        (txTemp, results) => {
          let temp = [];
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          }
          resolve(temp);
        },
        () => {
          resolve([]);
        },
      );
    })
  })
};

// lấy tất cả các bước đi hôm qua
const getListStepDayBefore = async () => {
  let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
  let SQL_QUERY = `SELECT * FROM stepcounter where starttime >= ${(currentTime - 86400) * 1000} and starttime < ${currentTime * 1000}`;
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(tx => {
      tx.executeSql(
        SQL_QUERY,
        [],
        (txTemp, results) => {
          let temp = [];
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          }
          resolve(temp);
        },
        () => {
          resolve([]);
        },
      );
    })
  })
};

const getListHistory = async (start, to) => {
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(function (txn) {
      txn.executeSql(
        'select * from historyStepcounter where starttime >= ? and starttime <= ? order by starttime',
        [start, to],
        (txTemp, results) => {
          let temp = [];
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          }
          resolve(temp);
        },
        () => {
          resolve([]);
        },
      );
    });
  })
}

const getListStartDateHistory = async (currentTime) => {
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(function (txn) {
      txn.executeSql(
        `select starttime from historyStepcounter where starttime < ${currentTime} order by starttime`,
        [],
        (txTemp, results) => {
          let temp = [];
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          }
          resolve(temp);
        },
        () => {
          resolve([]);
        },
      );
    });
  })
}

const addHistory = async (time, value) => {
  let tmpTime = new moment.unix(time)
  let itemExist = await getListHistory(time, time + 86399)
  if (itemExist.length > 0) {
    let item = itemExist[0]
    // let valueOld = JSON.parse(item?.resultStep)
    // valueOld = {
    //   step: valueOld?.step + value?.step,
    //   distance: valueOld?.distance + value?.distance,
    //   calories: valueOld?.calories + value?.calories,
    //   time: valueOld?.time + value?.time
    // }
    return new Promise((resolve, reject) => {
      db = open();
      db.transaction(function (txn) {
        txn.executeSql('UPDATE historyStepcounter set resultStep = ? where id = ?', [
          JSON.stringify(value),
          // JSON.stringify(valueOld),
          item?.id
        ],
          (txTemp, results) => resolve(results),
          () => reject());
      });
    })
  } else
    return new Promise((resolve, reject) => {
      db = open();
      db.transaction(function (txn) {
        txn.executeSql('INSERT INTO historyStepcounter(starttime, resultStep) VALUES (?,?)', [
          time,
          JSON.stringify(value),
        ],
          (txTemp, results) => resolve(results),
          () => reject());
      });
    })
}

const addStepCounter = async (start, end, steps) => {
  return new Promise((resolve, reject) => {
    db = open();
    db.transaction(function (txn) {
      txn.executeSql('INSERT INTO stepcounter(starttime, endtime, step) VALUES (?,?,?)', [
        start,
        end,
        steps
      ],
        () => resolve(),
        () => reject()
      );
    });
  })
}

export {
  open,
  close,
  initDatabase,
  getListHistory,
  getListStepDay,
  addHistory,
  addStepCounter,
  getListStepDayBefore,
  getListStartDateHistory,
  getListStepsBefore,
  removeAllHistory,
  removeAllStep,
  removeAllStepDay,


};
