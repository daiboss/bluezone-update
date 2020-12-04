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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
    borderColor: '#00000060',
    borderWidth: 1,
  },
  container2: {
    shadowColor: '#00000020',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.6,
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
    minHeight: 65,
  },
  colorUnSelected: {
    color: '#949494',
  },
});

export default styles;
