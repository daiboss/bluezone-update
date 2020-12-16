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

import {StyleSheet} from 'react-native';
import * as fontSize from '../../../../core/fontSize';
import {blue_bluezone, red_bluezone} from '../../../../core/color';
import {isIPhoneX} from '../../../../core/utils/isIPhoneX';
import {large} from '../../../../core/fontSize';
import {heightPercentageToDP} from '../../../../core/utils/dimension';

const MARGIN_TOP_CONTENT = heightPercentageToDP((62 / 720) * 100);
const MARGIN_BOTTOM_CONTENT = heightPercentageToDP((64 / 720) * 100);
const MARGIN_TOP_PHONE = heightPercentageToDP((38 / 720) * 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container3: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    fontSize: fontSize.normal,
    flex: 1,
    paddingLeft: 15,
  },
  iconInfo: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  modalFooter: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    width: '100%',
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },

  buttonConfirm: {
    marginHorizontal: 43,
    marginBottom: 27,
    marginTop: 40,
  },
  colorButtonConfirm: {
    backgroundColor: red_bluezone,
    height: 46,
    alignSelf: 'center',
    width: '80%',
    borderRadius: 25,
    paddingVertical: 0,
  },

  group: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
    paddingTop: '10%',
  },
  container2: {
    shadowColor: '#00000020',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 1,
    elevation: 2,
    shadowRadius: 10,
    backgroundColor: '#FFF',
    borderColor: '#00000040',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 10,
    marginTop: 10,
  },
});

export default styles;
