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
  iconNext: {
    height: 17,
    width: 17,
    resizeMode: 'cover',
    marginTop:2,
    marginLeft:10,
  },
  textGender: {
    fontSize: fontSize.normal,
    color: '#949494',
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
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
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
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    elevation: 2,
  },
  container3: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    minHeight: 55,
  },
  borderError: {
    borderColor: 'red',
  },
  textError: {
    color: 'red',
    paddingLeft: 15,
    paddingTop: 5,
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
