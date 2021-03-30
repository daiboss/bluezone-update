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

import { StyleSheet } from 'react-native';
import * as fontSize from '../../../../core/fontSize';
import { blue_bluezone, red_bluezone } from '../../../../core/color';
import { isIPhoneX } from '../../../../core/utils/isIPhoneX';
import { large } from '../../../../core/fontSize';
import { RFValue } from '../../../../const/multiscreen';
import { heightPercentageToDP } from '../../../../core/utils/dimension';

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
    fontSize: fontSize.fontSize11,
    flex: 1,
    paddingLeft: RFValue(20, fontSize.STANDARD_SCREEN_HEIGHT),
    fontWeight: '600',
    alignSelf: 'flex-start',
    paddingRight: RFValue(6, fontSize.STANDARD_SCREEN_HEIGHT),
    fontFamily: 'OpenSans-Regular'
  },
  iconInfo: {
    height: RFValue(20, fontSize.STANDARD_SCREEN_HEIGHT),
    width: RFValue(20, fontSize.STANDARD_SCREEN_HEIGHT),
    resizeMode: 'center',
  },
  modalFooter: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
    width: '100%',
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : RFValue(20),
  },

  buttonConfirm: {
    marginBottom: RFValue(45, fontSize.STANDARD_SCREEN_HEIGHT),
    paddingTop: 6,
  },
  colorButtonConfirm: {
    backgroundColor: red_bluezone,
    height: RFValue(46, fontSize.STANDARD_SCREEN_HEIGHT),
    alignSelf: 'center',
    width: RFValue(217, fontSize.STANDARD_SCREEN_HEIGHT),
    borderRadius: 25,
    paddingVertical: 0,
  },

  group: {
    flex: 1,
    paddingHorizontal: RFValue(8, fontSize.STANDARD_SCREEN_HEIGHT),
    justifyContent: 'space-between',
    paddingVertical: RFValue(14, fontSize.STANDARD_SCREEN_HEIGHT),
    // paddingTop: '10%',
  },
  container2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    backgroundColor: '#FFF',
    borderColor: '#00000040',
    borderRadius: 14,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: RFValue(13, fontSize.STANDARD_SCREEN_HEIGHT),
    marginTop: 10,
    height: RFValue(74, fontSize.STANDARD_SCREEN_HEIGHT)
  },

});

export default styles;
