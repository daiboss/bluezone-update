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
import { RFValue } from '../../../../../../const/multiscreen';

const SIZE = RFValue(80)

const styles = StyleSheet.create({
  textGender: {
    fontSize: fontSize.normal,
    fontWeight: '500',
  },
  textLabel: {
    fontSize: fontSize.normal,
    fontWeight: 'bold',
  },
  buttonSelectGender: {
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 15,
    overflow: 'hidden'
  },
  backgroundColorGenderSelected: {
    backgroundColor: red_bluezone,
  },
  colorGenderSelected: {
    color: '#FFF',
  },
  containerSelectGender: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // padding: 3,
    // borderRadius: 20,
    // borderColor: '#00000020',
    // borderWidth: 1,
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
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 10,
    minHeight: RFValue(66, fontSize.STANDARD_SCREEN_HEIGHT),
  },
  colorUnSelected: {
    color: '#949494',
  },

  container: {
    width: RFValue(134, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(41, fontSize.STANDARD_SCREEN_HEIGHT),
    backgroundColor: '#fff',
    borderRadius: SIZE * 0.25,
    // elevation: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    paddingHorizontal: RFValue(3),
    borderColor: '#00000020'
  },
  absoluteLayer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: RFValue(134, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(41, fontSize.STANDARD_SCREEN_HEIGHT),
  },
  smallZero: {
    color: '#949494',
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    paddingLeft: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
  },
  smallOne: {
    color: '#949494',
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    paddingLeft: RFValue(23, fontSize.STANDARD_SCREEN_HEIGHT),
  },
  overLay:
  {
    height: SIZE * 0.4,
    backgroundColor: red_bluezone,
    borderRadius: SIZE * 0.25,
    width: RFValue(63, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(33, fontSize.STANDARD_SCREEN_HEIGHT),
    alignItems: 'center',
    justifyContent: 'center'
  },
  overLayOne: {
    color: '#fff',
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    position: "absolute",
  },
  overLayZero: {
    color: '#fff',
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    position: "absolute",
  },
});

export default styles;
