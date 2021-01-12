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

import {StyleSheet} from 'react-native';
import * as fontSize from '../../../../../../core/fontSize';
import {blue_bluezone, red_bluezone} from '../../../../../../core/color';

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
    paddingVertical:7,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 20,
    borderColor: '#00000060',
    borderWidth: 1,
  },
  container2: {
    shadowColor: '#00000040',
    shadowOffset: {width: 0.3,height:0.3},
    shadowOpacity: 0.8,
    backgroundColor: '#FFF',
    borderColor: '#00000040',
    borderWidth: 1,
    borderRadius: 10,
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
});

export default styles;
