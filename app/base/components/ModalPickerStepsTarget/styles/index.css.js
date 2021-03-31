/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 8/19/20.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */
'use strict';

import { StyleSheet } from 'react-native';
import { RFValue } from '../../../../const/multiscreen';
import { red_bluezone } from '../../../../core/color';
import * as fontSize from '../../../../core/fontSize';

const styles = StyleSheet.create({
  container: {

  },
  buttonSelect: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    marginHorizontal: 0,
    marginBottom: 0,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30,
    // justifyContent: 'center'
  },

  body: {
    paddingHorizontal: 0,
    paddingTop: RFValue(20),
    paddingBottom: RFValue(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBoundSelect: {
    width: '100%'
  },
  viewSeelct: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30,
  },
  txButton: {
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold'
  },

  btnSave: {
    backgroundColor: red_bluezone,
    width: RFValue(188, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(46, fontSize.STANDARD_SCREEN_HEIGHT),
    borderRadius: 40,
    marginBottom: RFValue(25, fontSize.STANDARD_SCREEN_HEIGHT),
    marginTop: RFValue(30, fontSize.STANDARD_SCREEN_HEIGHT),
    justifyContent: 'center',
    alignItems: 'center'
  },

  txRed: {
    fontSize: fontSize.smaller,
    fontWeight: '700',
    color: red_bluezone,
  },
  txRecomends: {
    fontSize: fontSize.small,
    color: '#989898'
  }
});

export default styles;
