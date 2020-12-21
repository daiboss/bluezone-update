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

import {RemoteMessage} from 'react-native-firebase';
import * as scheduler from './app/core/notifyScheduler';

const _XHR = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : (GLOBAL.XMLHttpRequest =
      GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest);
XMLHttpRequest = _XHR;

import {AppRegistry} from 'react-native';
// import './app/core/log/console';

// Components
import App from './App';
import {name as appName} from './app.json';

import {remoteMessageListener} from './app/core/push';
import {
  getEvents,
  getLanguage,
  getTimestamp,
  setEvents,
} from './app/core/storage';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundFetch from 'react-native-background-fetch';
import {scheduleTask} from './app/main/components/SettingScreen';
import {onBackgroundFetchEvent} from './app/main/components/StepCountScreen';

BackgroundFetch.registerHeadlessTask(onBackgroundFetchEvent);
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
