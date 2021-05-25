import {
    getProfile,
} from './storage';
import moment from 'moment';
import { getListStepDay } from './db/NativeDB'

let count = 0;
var timeout;
export const gender = [0.413, 0.415];
var startTimeMS = 0;
var data = [];

export function getAbsoluteMonths(momentDate) {
    var months = Number(momentDate.format('MM'));
    var years = Number(momentDate.format('YYYY'));
    return months + years * 12;
};

export const getTimeDate = (date1, date2) => {
    let Difference_In_Time = date2 - date1;

    // To calculate the no. of days between two dates
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
};

export const getAllDistance = (data, sex, height, weight) => {
    let data2 = data.map((item, i) => {
        let time = (item?.endtime - item?.starttime) || 0;
        if (time <= 0) {
            time = 1000;
        }
        let lenght = sex * height * getStepRateFactor((item?.step * 2) / time, 2);
        let distance = lenght * item?.step;
        let speed = (distance / 2) * 3.6;
        let calories = 0;
        if (speed <= 5.5) {
            calories = (((0.1 * 1000 * speed) / 60 + 3.5) * weight * 2) / 12000;
        } else {
            calories = (((0.2 * 1000 * speed) / 60 + 3.5) * weight * 2) / 12000;
        }
        return {
            ...item,
            distance: distance / 100,
            calories,
            time: time / 1000,
            step: item?.step
        };
    });

    let distance = data2.reduce((total, item) => item.distance + total, 0);
    let calories = data2.reduce((total, item) => item.calories + total, 0);
    let time = data2.reduce((total, item) => total + item.time, 0);
    let totalStep = data2.reduce((acc, e) => acc + e?.step, 0);
    return {
        step: totalStep,
        distance: distance ? parseFloat(distance / 1000) : 0,
        calories: parseInt(calories / 100),
        time: time,
    };
};

export const getDistances = async () => {
    try {
        let stepData = [];
        const res = await getListStepDay()
        Array.prototype.push.apply(stepData, res);
        let profiles = (await getProfile()) || [];
        let profile = profiles.find(
            item =>
                getAbsoluteMonths(moment(item.date)) - getAbsoluteMonths(moment()) == 0,
        );
        if (profile == undefined && profiles.length > 0) {
            profile = profiles[0]
        }
        let sex = gender[profile?.gender || 0];
        let height = Number(profile?.height?.replace('cm', '')?.trim() || 0);
        let weight = Number(
            profile?.weight?.replace('kg', '')?.replace(',', '.')?.replace(' ', '') || 0
        );
        if (stepData.length) {
            let result = getAllDistance(stepData, sex, height, weight);
            return {
                step: result?.step,
                distance: result?.distance,
                calories: result?.calories,
                time: result?.time || 1,
            };
        }
        return {
            step: 0,
            distance: 0.00,
            calories: 0,
            time: 0,
        };
    } catch (error) {
        return {
            step: 0,
            distance: 0.00,
            calories: 0,
            time: 0,
        };
    }
};

export const getDistancesWithData = async (res) => {
    try {
        let stepData = [];
        Array.prototype.push.apply(stepData, res);

        let profiles = (await getProfile()) || [];
        let profile = profiles.find(
            item =>
                getAbsoluteMonths(moment(item.date)) - getAbsoluteMonths(moment()) == 0,
        );
        if (profile == undefined && profiles.length > 0) {
            profile = profiles[0]
        }
        let sex = gender[profile?.gender || 0];
        let height = Number(profile?.height?.replace('cm', '')?.trim() || 0);
        let weight = Number(
            profile?.weight?.replace('kg', '')?.replace(',', '.')?.replace(' ', '') || 0
        );
        if (stepData.length) {
            let result = getAllDistance(stepData, sex, height, weight);
            return {
                step: result?.step,
                distance: result?.distance,
                calories: result?.calories,
                time: result?.time || 1,
            };
        }
        return {
            step: 0,
            distance: 0.00,
            calories: 0,
            time: 0,
        };
    } catch (error) {
        return {
            step: 0,
            distance: 0.00,
            calories: 0,
            time: 0,
        };
    }
};

export const getStepsTotal = async (callback) => {
    getListStepDay().then(res => {
        let total = res?.reduce((t, e) => t + e?.step, 0)
        callback(total)
    })
};

export const getStepsTotalPromise = async () => {
    return new Promise((resolve, reject) => {
        getListStepDay().then(res => {
            let total = res?.reduce((t, e) => t + e?.step, 0)
            resolve(total)
        }).catch(() => resolve(0))
    })
};

const getStepRateFactor = (deltaSteps, time) => {
    let stepRate = deltaSteps / time;
    let stepRateFactor = 0;
    if (stepRate < 1.6) stepRateFactor = 0.82;
    else if (stepRate >= 1.6 && stepRate < 1.8) stepRateFactor = 0.88;
    else if (stepRate >= 1.8 && stepRate < 2.0) stepRateFactor = 0.96;
    else if (stepRate >= 2.0 && stepRate < 2.35) stepRateFactor = 1.06;
    else if (stepRate >= 2.35 && stepRate < 2.6) stepRateFactor = 1.35;
    else if (stepRate >= 2.6 && stepRate < 2.8) stepRateFactor = 1.55;
    else if (stepRate >= 2.8 && stepRate < 4.0) stepRateFactor = 1.85;
    else if (stepRate >= 4.0) stepRateFactor = 2.3;
    return stepRateFactor;
};
