/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 9/12/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import { StyleSheet } from 'react-native';
import * as fontSize from '../../../../../../core/fontSize';
import { blue_bluezone, red_bluezone } from '../../../../../../core/color';
import { MSCALE, RFValue, FS } from '../../../../../../const/multiscreen';

const styles = StyleSheet.create({
  iconNext: {
    height: MSCALE(12),
    width: MSCALE(12),
    resizeMode: 'contain',
    marginTop: 2,
    marginLeft: 10,
  },
  textGender: {
    fontSize: fontSize.normal,
    fontFamily: 'OpenSans-Bold'
  },
  textLabel: {
    fontSize: fontSize.normal,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold'
  },
  buttonSelectGender: {
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 10,
  },
  backgroundColorGenderSelected: {
    backgroundColor: red_bluezone,
  },
  colorGenderSelected: {
    color: '#FFF',
  },
  containerSelectGender: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
  },
  container2: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginHorizontal: 10,
    paddingHorizontal: RFValue(16, fontSize.STANDARD_SCREEN_HEIGHT),
    marginTop: RFValue(16, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(52, fontSize.STANDARD_SCREEN_HEIGHT),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  container3: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    minHeight: 55,
  },
  borderError: {
    borderColor: red_bluezone,
    borderWidth: 1,
  },
  textError: {
    color: 'red',
    paddingLeft: 15,
    paddingTop: RFValue(5, fontSize.STANDARD_SCREEN_HEIGHT),
    fontFamily: 'OpenSans-Regular',
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT)
  },
  buttonSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: '30%',
  },
  textLabel: {
    fontSize: fontSize.normal,
    fontWeight: 'bold',
  },
});

export default styles;
