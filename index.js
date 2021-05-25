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

import { taskPushNotificationStepWarning7Pm, taskStepCounter } from './app/main/components/StepCountScreen/TaskStepcounter'
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
import BackgroundJob from './app/core/service_stepcounter'
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  autoChange,
  notiStep,
  realtime,
  weightWarning,
} from './app/const/storage';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  onRegister: function (token) {
  },
  onRegistrationError: function (err) {
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
BackgroundJob.observerTimeWarningStepCounter(async () => {
  taskPushNotificationStepWarning7Pm()
})