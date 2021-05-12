import Realm from 'realm'

import moment from 'moment'

const TABLE_STEPCOUNTER = 'stepcounter'
const TABLE_STEPHISTORY = 'historyStepcounter'

const StepCounterSchema = {
    name: TABLE_STEPCOUNTER,
    primaryKey: 'id',
    properties: {
        id: 'string',
        starttime: 'double',
        endtime: 'double',
        step: 'int'
    }
}

const StepCounterHistorySchema = {
    name: TABLE_STEPHISTORY,
    primaryKey: 'id',
    properties: {
        id: 'string',
        starttime: 'double',
        resultStep: 'string',
    }
}

const realmConfig = {
    schema: [StepCounterSchema, StepCounterHistorySchema],
    schemaVersion: 1.1,
    path: 'BluezoneSteps.realm',
};

// Thêm giá trị bước đi được
const addStepCounter = async (start, end, steps) => {
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            realmDb.write(() => {
                let obj = {
                    id: start?.toString(),
                    starttime: start,
                    endtime: end,
                    step: steps
                }
                realmDb.create(TABLE_STEPCOUNTER, obj);
                resolve(obj);
            });
        }).catch((error) => reject(error));
    })
}

// Lấy danh sách bước đi trong ngày
const getListStepDay = async () => {
    let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix() * 1000
    let currentEndTime = moment().set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).unix() * 1000

    console.log('getListStepDay', currentTime, currentEndTime)

    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            let filterQuery = realmDb.objects(TABLE_STEPCOUNTER)
                .filtered(`starttime >= ${currentTime} && starttime < ${currentEndTime}`);
                console.log('filterQuery', filterQuery)
            resolve(Array.from(filterQuery));
        }).catch((error) => reject(error));
    })
};

// Lấy danh sách lịch sử từ ngày tới ngày
const getListHistory = async (start, to) => {
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            let filterQuery = realmDb.objects(TABLE_STEPHISTORY)
                .filtered(`starttime >= ${start} && starttime <= ${to}`)
                .sorted('starttime');

            resolve(Array.from(filterQuery));
        }).catch((error) => reject(error));
    })
}

// Thêm vào lịch sử, nếu tồn tại sẽ update giá trị mới nhất
const addHistory = async (time, value) => {
    let itemExist = await getListHistory(time, time + 86399)
    if (itemExist.length > 0) {
        let item = itemExist[0]
        return new Promise((resolve, reject) => {
            Realm.open(realmConfig).then(realmDb => {
                realmDb.write(() => {
                    let valueQuery = realmDb.objectForPrimaryKey(TABLE_STEPHISTORY, item.id);
                    valueQuery.resultStep = JSON.stringify(value);
                    resolve(valueQuery);
                });
            }).catch((error) => reject(error));
        })
    } else {
        return new Promise((resolve, reject) => {
            Realm.open(realmConfig).then(realmDb => {
                realmDb.write(() => {
                    let obj = {
                        id: time?.toString(),
                        starttime: time,
                        resultStep: JSON.stringify(value),
                    }
                    realmDb.create(TABLE_STEPHISTORY, obj);
                    resolve(obj);
                });
            }).catch((error) => reject(error));
        })
    }
}

// lấy tất cả các bước đi hôm qua
const getListStepDayBefore = async () => {
    let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            let filterQuery = realmDb.objects(TABLE_STEPCOUNTER)
                .filtered(`starttime >= ${(currentTime - 86400) * 1000} && starttime < ${currentTime * 1000}`)
                .sorted('starttime');
            resolve(Array.from(filterQuery));
        }).catch((error) => reject(error));
    })
};

// Lấy danh lịch sử của những ngày trước ngày hôm nay
const getListStartDateHistory = async (currentTime) => {
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            let filterQuery = realmDb.objects(TABLE_STEPHISTORY)
                .filtered(`starttime < ${currentTime}`)
                .sorted('starttime');
            resolve(Array.from(filterQuery));
        }).catch((error) => reject(error));
    })
}

// lấy tất cả các bước đi từ trước chưa lưu
const getListStepsBefore = async () => {
    let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            let filterQuery = realmDb.objects(TABLE_STEPCOUNTER)
                .filtered(`starttime < ${currentTime * 1000}`);
            resolve(Array.from(filterQuery));
        }).catch((error) => reject(error));
    })
};

// lấy tất cả các bước đi
const getListStepsAll = async () => {
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            let filterQuery = realmDb.objects(TABLE_STEPCOUNTER);
            resolve(Array.from(filterQuery));
        }).catch((error) => reject(error));
    })
};

// Xoá hết lịch sử trong db
const removeAllHistory = async () => {
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            realmDb.write(() => {
                let allHistory = realmDb.objects(TABLE_STEPHISTORY);
                realmDb.delete(allHistory);
                resolve();
            });
        }).catch((error) => reject(error));
    })
}

// Xoá hết só bước đi
const removeAllStep = async () => {
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            realmDb.write(() => {
                let allSteps = realmDb.objects(TABLE_STEPCOUNTER);
                realmDb.delete(allSteps);
                resolve();
            });
        }).catch((error) => reject(error));
    })
}

// Xoá hết số bước đi từ ngày tới ngày
const removeAllStepDay = async (startDay, endDay) => {
    return new Promise((resolve, reject) => {
        Realm.open(realmConfig).then(realmDb => {
            realmDb.write(() => {
                let filterQuery = realmDb.objects(TABLE_STEPCOUNTER)
                    .filtered(`starttime >= ${startDay} and endtime <= ${endDay}`);
                realmDb.delete(filterQuery);
                resolve();
            });
        }).catch((error) => reject(error));
    })
}

export {
    addStepCounter,
    getListStepDay,
    getListHistory,
    addHistory,
    getListStepDayBefore,
    getListStartDateHistory,
    getListStepsBefore,
    removeAllHistory,
    removeAllStep,
    removeAllStepDay,
    getListStepsAll
}

export default new Realm(realmConfig);
