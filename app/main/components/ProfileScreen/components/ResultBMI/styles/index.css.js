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

import { StyleSheet, Platform } from 'react-native';
import * as fontSize from '../../../../../../core/fontSize';
import { blue_bluezone, red_bluezone } from '../../../../../../core/color';
import { heightPercentageToDP } from '../../../../../../core/utils/dimension';
import { RFValue } from '../../../../../../const/multiscreen';

const styles = StyleSheet.create({
  empty: {
    height: 30,
  },
  textTotalBmi: {
    color: '#00B67E',
    fontWeight: '500',
    fontSize: fontSize.normal,
  },
  textGender: {
    fontSize: fontSize.normal,
    color: '#949494',
  },
  textLabel: {
    fontSize: fontSize.normal,
    marginTop: RFValue(21, fontSize.STANDARD_SCREEN_HEIGHT),
    marginBottom: RFValue(18, fontSize.STANDARD_SCREEN_HEIGHT),
    fontWeight: '700'
  },
  container2: {
    shadowColor: "black",
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
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: RFValue(16, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(106, fontSize.STANDARD_SCREEN_HEIGHT),
  },
  container3: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  container4: {

  },
  flex: {
    flex: 1,
  },
  textValue: {
    // position: 'absolute',
    // right: -10,
    // top: -20,
    fontSize: fontSize.fontSize11,
    flex: 1,
    textAlign: 'right',
    marginRight: -12
  },
  group: {
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  borderRadiusLeft: {
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
  },
  borderRadiusRight: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  line: {
    height: RFValue(4, fontSize.STANDARD_SCREEN_HEIGHT),
    width: '100%',
    marginBottom: 10,
  },
  line1: {
    backgroundColor: '#015CD0',
    flex: 1
  },
  line2: {
    backgroundColor: '#00B67E',
    flex: 1
  },
  line3: {
    backgroundColor: '#FFD500',
    flex: 1
  },
  line4: {
    backgroundColor: '#FF8E30',
    flex: 1
  },
  line5: {
    backgroundColor: '#FE4358',
    flex: 1
  },
  textWarning1: {
    color: '#015CD0',
  },
  textWarning2: {
    color: '#00B67E',
  },
  textWarning3: {
    color: '#FFD500',
  },
  textWarning4: {
    color: '#FF8E30',
  },
  textWarning5: {
    color: '#FE4358',
  },
  dot: {
    backgroundColor: '#FFF',
    borderColor: '#015CD0',
    borderWidth: 1,
    height: RFValue(12, fontSize.STANDARD_SCREEN_HEIGHT),
    width: RFValue(12, fontSize.STANDARD_SCREEN_HEIGHT),
    borderRadius: RFValue(6, fontSize.STANDARD_SCREEN_HEIGHT),
    position: 'absolute',
    // top: Platform.OS == 'android' ? '17%' : '13%',
  },
  textWarning: {
    textAlign: 'center',
    flex: 1,
    fontSize: fontSize.fontSize11,
    paddingHorizontal: RFValue(6, fontSize.STANDARD_SCREEN_HEIGHT)
  },
});

export default styles;
