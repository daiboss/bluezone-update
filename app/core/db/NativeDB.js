import { NativeModules } from 'react-native';

const { RNStepCounterModule } = NativeModules;

// Lấy danh sách bước đi trong ngày
const getListStepDay = async () => {
    return RNStepCounterModule.getStepsToday();
};

// Lấy danh sách lịch sử từ ngày tới ngày
const getListHistory = async (start, to) => {
    return RNStepCounterModule.getListHistory(start, to);
}

// Thêm vào lịch sử, nếu tồn tại sẽ update giá trị mới nhất
const addHistory = async (time, value) => {
    return RNStepCounterModule.saveHistoryDay(time, value);
}

// Lấy danh lịch sử của những ngày trước ngày hôm nay
const getListStartDateHistory = async () => {
    return RNStepCounterModule.getListStartDateHistory()
}

// lấy tất cả các bước đi từ trước chưa lưu
const getListStepsBefore = async () => {
    return RNStepCounterModule.getListStepsBefore();
};

// lấy tất cả các bước đi
const getListStepsAll = async () => {
    return RNStepCounterModule.getAllStepCounter();
};

// Xoá hết lịch sử trong db
const removeAllHistory = async () => {
    return RNStepCounterModule.removeAllHistory()
}

// Xoá hết só bước đi
const removeAllStep = async () => {
    return RNStepCounterModule.removeAllStep()
}

// Xoá hết số bước đi từ ngày tới ngày
const removeAllStepDay = async (startDay, endDay) => {
    return RNStepCounterModule.removeAllStepDay(startDay, endDay)
}

export {
    getListStepDay,
    getListHistory,
    addHistory,
    getListStartDateHistory,
    getListStepsBefore,
    removeAllHistory,
    removeAllStep,
    removeAllStepDay,
    getListStepsAll
}

