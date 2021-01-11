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

import { RemoteMessage } from 'react-native-firebase';

const _XHR = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : (GLOBAL.XMLHttpRequest =
    GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest);
XMLHttpRequest = _XHR;

import { AppRegistry, Platform } from 'react-native';
// import './app/core/log/console';

// Components
import App from './App';
import { name as appName } from './app.json';

import { remoteMessageListener } from './app/core/push';
import {
  getAutoChange,
  getEvents,
  getLanguage,
  getProfile,
  getResultSteps,
  getSteps,
  getStepsTotal,
  getTimestamp,
  setAutoChange,
  setEvents,
} from './app/core/storage';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundFetch from 'react-native-background-fetch';
// import { scheduleTask } from './app/main/components/SettingScreen';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Fitness from '@ovalmoney/react-native-fitness';
import {
  autoChange,
  notiStep,
  realtime,
  weightWarning,
} from './app/const/storage';
const permissions = [
  {
    kind: Fitness.PermissionKinds.Steps,
    access: Fitness.PermissionAccesses.Read,
  },
  {
    kind: Fitness.PermissionKinds.Calories,
    access: Fitness.PermissionAccesses.Read,
  },
  {
    kind: Fitness.PermissionKinds.Distances,
    access: Fitness.PermissionAccesses.Read,
  },
];
// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened

  // // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  // onAction: function (notification) {
  //   console.log("ACTION:", notification.action);
  //   console.log("NOTIFICATION:", notification);

  //   // process the action
  // },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    // console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

function getAbsoluteMonths(momentDate) {
  var months = Number(momentDate.format('MM'));
  var years = Number(momentDate.format('YYYY'));
  return months + years * 12;
}
// const onBackgroundFetchEvent = async taskId => {
//   // console.log('taskId: ', taskId?.taskId);
//   try {
//     let end = new Date();
//     let start = new Date();
//     end.setDate(end.getDate() + 1);
//     if (Platform.OS == 'ios') {
//     let resPermissions = await Fitness.requestPermissions(permissions);
//     console.log('resPermissions: ', resPermissions);
//       let resAuth = await Fitness.isAuthorized(permissions);
//       console.log('resAuth: ', resAuth);
//     }
//     let step = await getSteps(start, end);
//     console.log('step: ', step);
//     let today = moment();
//     let resultSteps = await getResultSteps();
//     console.log('resultSteps: ', resultSteps);

//     switch (taskId?.taskId) {
//       case autoChange:
//         if (resultSteps) {
//           let storageDate = moment(resultSteps?.date).format('DD');
//           if (storageDate != today.format('DD')) {
//             if (Platform.OS == 'ios')
//               getStepsTotal(start, end);
//           }
//         }
//         break;
//       case weightWarning:
//         let profiles = (await getProfile()) || [];
//         let profile = profiles.find(
//           item =>
//             getAbsoluteMonths(moment(item.date)) == getAbsoluteMonths(today),
//         );

//         if (profile) {
//           let nextWeek = new Date().getTime();
//           let isWarning = parseInt(
//             (nextWeek - profile?.date) / (1000 * 3600 * 24),
//           );

//           if (isWarning >= 7) {
//             scheduler.createWarnningWeightNotification();
//           }
//         }
//         break;
//       case notiStep:
//         if (resultSteps) {
//           if (today.format('HH') >= 19) {
//             scheduler.createWarnningStepNotification(step?.step);
//           }
//         }
//         break;
//       case realtime:
//         scheduler.createShowStepNotification(step?.step);
//         break;
//       default:
//         break;
//     }
//     if (taskId?.taskId === 'react-native-background-fetch') {
//       // Test initiating a #scheduleTask when the periodic fetch event is received.
//       let auto = await getAutoChange();
//       console.log('auto: ', auto);
//       if (auto == undefined || auto == null) {
//         await scheduleTask(autoChange);
//         setAutoChange(true);
//       }
//     }
//   } catch (e) {
//     console.log('e: aaaaaaaaaaaaaaaaaaa', e);
//   }
//   // Required: Signal completion of your task to native code
//   // If you fail to do this, the OS can terminate your app
//   // or assign battery-blame for consuming too much background-time
//   BackgroundFetch.finish(taskId?.taskId);
// };
// BackgroundFetch.registerHeadlessTask(onBackgroundFetchEvent);
async function handleBackgroundMessage(message: RemoteMessage) {
  const language = await getLanguage();
  await remoteMessageListener(message, language);
  return Promise.resolve();
}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => handleBackgroundMessage,
);
