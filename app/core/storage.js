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

import AsyncStorage from '@react-native-community/async-storage';

import {
  ResourceLanguage,
  Configuration,
  TokenForDeclaration,
  JobImmediately,
  HistoryDays,
  IsFirstLoading,
  InfoDeclare,
  TimespanNotification,
  TimesOpenApp,
  FirstTimeOpen,
  TokenFirebase,
  PhoneNumber,
  Language,
  StatusNotifyRegister,
  VersionCurrent,
  LatestVersionApp,
  TimeAnalyticsBle,
  LastTimeClearLog,
  DateOfWelcome,
  DisplayOriginalImg,
  QuestionFAQ,
  Profile,
  ResultSteps,
  ResultStepsTarget,
  autoChange,
  realtime,
  notiStep,
  weightWarning,
  stepChange,
  IsShowNotification
} from '../const/storage';
import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';
import { parse } from 'react-native-svg';
import { Platform } from 'react-native';
// TODO Can sua de moi du lieu ghi vao storage deu dung JSON.stringify, va lay ra deu dung JSON.parse. Dam bao tuong tich ban cu. thay vi ben ngoai phan tu convert nhu gio.
const _processInput = input => {
  if (input instanceof Date) {
    return JSON.stringify(input.getTime());
  }
  return JSON.stringify(input);
};

const _processOutput = output => {
  if (output === null) {
    return output;
  }
  let result;
  try {
    result = JSON.parse(output.toString());
    // return JSON.parse(output)
  } catch (e) {
    // Cac truong hop string duoc luu thang vao storage ma khong qua JSON.stringify truoc day se tam thoi nhay vao catch nay.
    result = output
    // return output;
  }
  return result;
};

const getResourceLanguage = async () => {
  const result = await AsyncStorage.getItem(ResourceLanguage);
  return _processOutput(result);
};

const setResourceLanguage = (resourceLanguage = {}) => {
  const _resource = _processInput(resourceLanguage);
  AsyncStorage.setItem(ResourceLanguage, _resource);
};

const getConfiguration = async () => {
  const result = await AsyncStorage.getItem(Configuration);
  return _processOutput(result);
};

const setConfiguration = (configurationString = {}) => {
  const _resource = _processInput(configurationString);
  AsyncStorage.setItem(Configuration, _resource);
};

const getTokenForDeclaration = async () => {
  const result = await AsyncStorage.getItem(TokenForDeclaration);
  return _processOutput(result);
};

const setTokenForDeclaration = (tokenForDeclaration = '') => {
  const _resource = _processInput(tokenForDeclaration);
  AsyncStorage.setItem(TokenForDeclaration, _resource);
};

const getJobImmediately = async () => {
  const result = await AsyncStorage.getItem(JobImmediately);
  return _processOutput(result);
};

const setJobImmediately = (job = []) => {
  const _resource = _processInput(job);
  AsyncStorage.setItem(JobImmediately, _resource);
};

const getHistoryDays = async () => {
  const result = await AsyncStorage.getItem(HistoryDays);
  return _processOutput(result);
};

const setHistoryDays = (historyDays = []) => {
  const _resource = _processInput(historyDays);
  AsyncStorage.setItem(HistoryDays, _resource);
};

const getIsFirstLoading = async () => {
  const result = await AsyncStorage.getItem(IsFirstLoading);
  return _processOutput(result);
};

const setIsFirstLoading = (firstLoading = true) => {
  const _resource = _processInput(firstLoading);
  AsyncStorage.setItem(IsFirstLoading, _resource);
};

const getInfoDeclare = async () => {
  const result = await AsyncStorage.getItem(InfoDeclare);
  return _processOutput(result);
};

const setInfoDeclare = (infoDeclare = {}) => {
  const _resource = _processInput(infoDeclare);
  AsyncStorage.setItem(InfoDeclare, _resource);
};

const getTimespanNotification = async () => {
  const result = await AsyncStorage.getItem(TimespanNotification);
  return _processOutput(result);
};

const setTimespanNotification = (timespanNotification = 0) => {
  const _resource = _processInput(timespanNotification);
  AsyncStorage.setItem(TimespanNotification, _resource);
};

const getTimesOpenApp = async () => {
  const result = await AsyncStorage.getItem(TimesOpenApp);
  return _processOutput(result);
};

const setTimesOpenApp = (timesOpenApp = 0) => {
  const _resource = _processInput(timesOpenApp);
  AsyncStorage.setItem(TimesOpenApp, _resource);
};

const getFirstTimeOpen = async () => {
  const result = await AsyncStorage.getItem(FirstTimeOpen);
  return _processOutput(result);
};

const setFirstTimeOpen = (firstTimeOpen = 0) => {
  const _resource = _processInput(firstTimeOpen);
  AsyncStorage.setItem(FirstTimeOpen, _resource);
};

const getTokenFirebase = async () => {
  const result = await AsyncStorage.getItem(TokenFirebase);
  return _processOutput(result);
};

const setTokenFirebase = (tokenFirebase = '') => {
  const _resource = _processInput(tokenFirebase);
  AsyncStorage.setItem(TokenFirebase, _resource);
};

const getPhoneNumber = async () => {
  const result = await AsyncStorage.getItem(PhoneNumber);
  return _processOutput(result);
};

const setPhoneNumber = (phoneNumber = 0) => {
  const _resource = _processInput(phoneNumber);
  AsyncStorage.setItem(PhoneNumber, _resource);
};

const getLanguage = async () => {
  const result = await AsyncStorage.getItem(Language);
  return _processOutput(result);
};

const setLanguage = (language = 'vi') => {
  const _language = _processInput(language);
  AsyncStorage.setItem(Language, _language);
};

const getStatusNotifyRegister = async () => {
  const result = await AsyncStorage.getItem(StatusNotifyRegister);
  return _processOutput(result);
};

const setStatusNotifyRegister = (statusNotifyRegister = 0) => {
  const _resource = _processInput(statusNotifyRegister);
  AsyncStorage.setItem(StatusNotifyRegister, _resource);
};

const getVersionCurrent = async () => {
  const result = await AsyncStorage.getItem(VersionCurrent);
  return _processOutput(result);
};

const setVersionCurrent = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(VersionCurrent, _resource);
};

const getLatestVersionApp = async () => {
  const result = await AsyncStorage.getItem(LatestVersionApp);
  return _processOutput(result);
};

const setLatestVersionApp = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(LatestVersionApp, _resource);
};

const multiGet = async keys => {
  const _keys = await AsyncStorage.multiGet(keys);
  const result = {};
  _keys.forEach(item => {
    Object.assign(result, { [item[0]]: _processOutput(item[1]) });
  });

  return result;
};

const setTimeAnalyticsBle = value => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(TimeAnalyticsBle, _resource);
};

const getTimeAnalyticsBle = async () => {
  const result = await AsyncStorage.getItem(TimeAnalyticsBle);
  return _processOutput(result);
};

const getLastTimeClearLog = async () => {
  const result = await AsyncStorage.getItem(LastTimeClearLog);
  return _processOutput(result);
};

const setLastTimeClearLog = value => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(LastTimeClearLog, _resource);
};

const getDateOfWelcome = async () => {
  const result = await AsyncStorage.getItem(DateOfWelcome);
  return _processOutput(result);
};

const setDateOfWelcome = (infoDates = {}) => {
  const _resource = _processInput(infoDates);
  AsyncStorage.setItem(DateOfWelcome, _resource);
};

const getDisplayOriginalImg = async () => {
  const result = await AsyncStorage.getItem(DisplayOriginalImg);
  return _processOutput(result);
};

const setDisplayOriginalImg = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(DisplayOriginalImg, _resource);
};

const getQuestionFAQ = async () => {
  const result = await AsyncStorage.getItem(QuestionFAQ);
  return _processOutput(result);
};

const setQuestionFAQ = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(QuestionFAQ, _resource);
};

const getProfile = async () => {
  const result = await AsyncStorage.getItem(Profile);
  // console.log('resultresultresultresult',result)
  return _processOutput(result);
};

const setProfile = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(Profile, _resource);
};

const getResultSteps = async () => {
  const result = await AsyncStorage.getItem(ResultSteps);
  return _processOutput(result);
};

const setResultSteps = async (value = '') => {
  const _resource = _processInput(value);
  await AsyncStorage.setItem(ResultSteps, _resource);
};

const getIsShowNotification = async () => {
  const result = await AsyncStorage.getItem(IsShowNotification);
  return _processOutput(result);
};

const setIsShowNotification = (value = false) => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(IsShowNotification, _resource);
};

const setEvents = async data => {
  try {
    return AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(data));
  } catch (e) { }
};

const getEvents = async () => {
  try {
    const value = await AsyncStorage.getItem(EVENTS_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) { }
  return Promise.resolve(null);
};
const getTimestamp = () =>
  new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
const getStepsTotal = async (start, end) => {
  try {
    let res = await Fitness.getSteps({
      startDate: moment(start)
        .format('YYYY-MM-DD')
        .toString(),
      endDate: moment(end)
        .format('YYYY-MM-DD')
        .toString(),
    });
    let result = await getResultSteps(ResultSteps);
    let totalStep = result?.step || 10000;
    if (res.length) {
      let step = res.reduce((current, obj) => current + obj.quantity, 0);

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
  } catch (error) { }
};
const getSteps = (start, end) => {
  if(Platform.OS == 'android')
  return []
  return new Promise(async (resolve, reject) => {
    try {
      let res = await Fitness.getSteps({
        startDate: moment(start)
          .format('YYYY-MM-DD')
          .toString(),
        endDate: moment(end)
          .format('YYYY-MM-DD')
          .toString(),
      });

      let step = res.reduce((current, obj) => current + obj.quantity, 0);
      resolve({ step, data: res });
    } catch (error) {
      reject(error);
    }
  });
};
const getStepChange = async () => {
  const result = await AsyncStorage.getItem(stepChange);
  return _processOutput(result);
};

const setStepChange = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(stepChange, _resource);
};
const getAutoChange = async () => {
  const result = await AsyncStorage.getItem(autoChange);
  return _processOutput(result);
};

const setAutoChange = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(autoChange, _resource);
};

const getRealtime = async () => {
  const result = await AsyncStorage.getItem(realtime);
  return _processOutput(result);
};

const setRealtime = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(realtime, _resource);
};

const getNotiStep = async () => {
  const result = await AsyncStorage.getItem(notiStep);
  return _processOutput(result);
};

const setNotiStep = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(notiStep, _resource);
};

const getWeightWarning = async () => {
  const result = await AsyncStorage.getItem(weightWarning);
  return _processOutput(result);
};

const setWeightWarning = (value = '') => {
  const _resource = _processInput(value);
  AsyncStorage.setItem(weightWarning, _resource);
};

export {
  setStepChange,
  getStepChange,
  getAutoChange,
  setAutoChange,
  getRealtime,
  setRealtime,
  getNotiStep,
  setNotiStep,
  getWeightWarning,
  setWeightWarning,
  getSteps,
  getStepsTotal,
  getTimestamp,
  getEvents,
  setEvents,
  setProfile,
  getProfile,
  getResourceLanguage,
  setResourceLanguage,
  getConfiguration,
  setConfiguration,
  getTokenForDeclaration,
  setTokenForDeclaration,
  getJobImmediately,
  setJobImmediately,
  getHistoryDays,
  setHistoryDays,
  getIsFirstLoading,
  setIsFirstLoading,
  getInfoDeclare,
  setInfoDeclare,
  getTimespanNotification,
  setTimespanNotification,
  getTimesOpenApp,
  setTimesOpenApp,
  getFirstTimeOpen,
  setFirstTimeOpen,
  getTokenFirebase,
  setTokenFirebase,
  getPhoneNumber,
  setPhoneNumber,
  getLanguage,
  setLanguage,
  getStatusNotifyRegister,
  setStatusNotifyRegister,
  getVersionCurrent,
  setVersionCurrent,
  getLatestVersionApp,
  setLatestVersionApp,
  multiGet,
  setTimeAnalyticsBle,
  getTimeAnalyticsBle,
  getLastTimeClearLog,
  setLastTimeClearLog,
  getDateOfWelcome,
  setDateOfWelcome,
  getDisplayOriginalImg,
  setDisplayOriginalImg,
  getQuestionFAQ,
  setQuestionFAQ,
  setResultSteps,
  getResultSteps,
  getIsShowNotification,
  setIsShowNotification
};
