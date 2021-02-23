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
    minHeight: 75,
  },
  colorUnSelected: {
    color: '#949494',
  },

  container: {
    width: RFValue(100),
    backgroundColor: '#fff',
    height: SIZE * 0.48,
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
    width: '100%',
    height: (SIZE * 1) / 2,
  },
  smallZero: {
    color: '#949494',
    fontSize: RFValue(11),
    paddingLeft: SIZE * 0.16
  },
  smallOne: {
    color: '#949494',
    fontSize: RFValue(11),
    textAlign: 'right',
  },
  overLay:
  {
    height: SIZE * 0.4,
    backgroundColor: red_bluezone,
    borderRadius: SIZE * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  overLayOne: {
    color: '#fff',
    fontSize: RFValue(11),
    position: "absolute",
  },
  overLayZero: {
    color: '#fff',
    fontSize: RFValue(11),
    position: "absolute",
  },
});

export default styles;
