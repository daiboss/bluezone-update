import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map, filter} from 'rxjs/operators';
import {getProfile, getStepChange, setStepChange} from './storage';
import moment from 'moment';
let count = 0;
var timeout;
const gender = [0.413, 0.415];
var startTimeMS = 0;
var data = [];
const STEP_IN_METERS = 0.762;
setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms
export function getAbsoluteMonths(momentDate) {
  var months = Number(momentDate.format('MM'));
  var years = Number(momentDate.format('YYYY'));
  return months + years * 12;
}
export const getTimeDate = (date1, date2) => {
  // To calculate the time difference of two dates
  let Difference_In_Time = date2 - date1;

  // To calculate the no. of days between two dates
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
};
export const getDistances = async () => {
  try {
    let step = (await getStepChange()) || [];
    let profiles = (await getProfile()) || [];
    let profile = profiles.find(
      item =>
        getAbsoluteMonths(moment(item.date)) - getAbsoluteMonths(moment()) == 0,
    );
    let sex = gender[profile?.gender || 0];
    let height = profile?.height?.substring(0, profile?.height?.length - 3);
    let weight = Number(
      profile?.weight
        ?.substring(0, profile?.weight?.length - 3)
        .replace(', ', '.'),
    );

    if (step.length) {
      let data = step.filter(
        e =>
          getTimeDate(e.time, new Date().getTime()) < 1 &&
          getTimeDate(e.time, new Date().getTime()) >= 0,
      );
      console.log('data: ', data);

      var final = [];
      function groupValues(t, v, i, a) {
        if (
          t.hasOwnProperty('time') &&
          new Date(v.time).getSeconds() <= new Date(t.time).getSeconds() + 2
        ) {
          t.timeArray.push(v.time);
          t.time = v.time;
          t.step.push(v.step);
        } else {
          if (t.hasOwnProperty('time')) final.push(t);
          t = {
            timeArray: [v.time],
            time: v.time,
            step: [v.step],
          };
        }
        if (i == a.length - 1) final.push(t);
        return t;
      }
      data.reduce(groupValues, {});
      let data2 = final.map((item, i) => {
        let lenght = sex * height * getStepRateFactor(item?.step?.length, 2);
        let distance = lenght * item?.step?.length;
        let speed = (distance / 2) * 3.6;
        let calories = 0;
        if (speed <= 5.5) {
          calories = (((0.1 * 1000 * speed) / 60 + 3.5) * weight * 2) / 12000;
        } else {
          calories = (((0.2 * 1000 * speed) / 60 + 3.5) * weight * 2) / 12000;
        }
        return {
          ...item,
          distance: distance / 1000,
          calories,
        };
      });
      let distance = data2.reduce((total, item) => item.distance + total, 0);
      let calories = data2.reduce((total, item) => item.calories + total, 0);
      let timeList = data
        .map(item => item?.timeEnd)
        .filter((item, i, ar) => ar.indexOf(item) == i)
        .map((item, index) => {
          let new_list = data.filter(itm => itm?.timeEnd == item);
          return {timeEnd: item, data: new_list};
        });
      let time = timeList.reduce((total, item) => {
        let data = item.data.sort((a, b) => a.timeStart - b.timeStart);
        if (data.length) {
          let start = data[0];
          let end = data[data.length - 1];
          return total + ((end?.timeEnd || 0) - (start?.timeStart || 0));
        }
        return total;
      }, 0);
      let totalStep = data.sort((a, b) => b.step - a.step)[0];
      return {
        step: totalStep?.step,
        distance,
        calories,
        time: parseInt(time),
      };
    }
    return {};
  } catch (error) {
    console.log('error: ', error);
    return {};
  }
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
