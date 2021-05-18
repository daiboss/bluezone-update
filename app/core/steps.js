import {
  getProfile,
  getResultSteps,
  getStepChange,
  setResultSteps,
  setStepChange,
} from './storage';
import moment from 'moment';
let count = 0;
var timeout;
export const gender = [0.413, 0.415];
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
export const getAllDistance = (data, sex, height, weight) => {
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
      return { timeEnd: item, data: new_list };
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
  let totalStep = data.reduce((acc, e) => (acc > e.step ? acc : e.step), 0);
  return {
    step: totalStep,
    distance: distance ? parseFloat(distance / 1000).toFixed(3) : 0,
    calories: parseInt(calories / 1000),
    time: parseInt(time),
  };
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
    let height = Number(profile?.height?.replace('cm', '')?.trim() || 0);
    let weight = Number(
      profile?.weight
        ?.replace('kg', '')?.replace(',', '.')?.replace(' ', '') || 0
    );

    if (step.length) {
      let data = step.filter(
        e => new Date(e.time).compareDate(new Date()) == 0,
      );
      let result = getAllDistance(data, sex, height, weight);
      return {
        step: result?.step,
        distance: result?.distance,
        calories: result?.calories,
        time: result?.time,
      };
    }
    return {};
  } catch (error) {
    return {};
  }
};
export const getStepsTotal = async (start, end) => {
  try {
    let res = (await getStepChange()) || [];

    let result = await getResultSteps();
    let totalStep = result?.step || 10000;
    if (res.length) {
      let date = new Date(result.date);
      let step = res
        .filter(
          e =>
            getTimeDate(date.getTime(), e.time) < 0 &&
            getTimeDate(date.getTime(), e.time) >= -1,
        )
        .reduce((current, obj) => (current > obj.step ? current : obj.step), 0);

      if (step > totalStep) {
        let a = parseInt((step / totalStep) * 100);

        if (a >= 150) {
          let resultNew = totalStep + (20 / 100) * (step - totalStep);

          setResultSteps({
            step: parseInt(resultNew),
            date: new Date().getTime(),
          });
        } else if (a < 150 && a > 100) {
          let resultNew = totalStep + (10 / 100) * (step - totalStep);

          setResultSteps({
            step: parseInt(resultNew),
            date: new Date().getTime(),
          });
        } else {
          setResultSteps({
            step: parseInt(totalStep),
            date: new Date().getTime(),
          });
        }
      } else {
        let resultNew = totalStep - (20 / 100) * (totalStep - step);

        setResultSteps({ step: parseInt(resultNew), date: new Date().getTime() });
      }
    }
  } catch (error) {
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
