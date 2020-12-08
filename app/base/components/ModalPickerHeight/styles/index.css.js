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

import {StyleSheet} from 'react-native';
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
    marginBottom:0
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    // justifyContent: 'center'
  },

  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },

  title: {
    fontSize: fontSize.larger,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  description: {
    fontSize: fontSize.fontSize16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default styles;
