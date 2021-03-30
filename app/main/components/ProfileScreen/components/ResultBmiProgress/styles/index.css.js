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
import { heightPercentageToDP } from '../../../../../../core/utils/dimension';
import { RFValue } from '../../../../../../const/multiscreen';

const styles = StyleSheet.create({
  textStatus: {
    color: '#949494',
    fontSize: fontSize.smaller,
  },
  group: {
    backgroundColor: '#FFF',
    borderRadius: 200,
    padding: fontSize.smaller,
  },
  textTotalBmi: {
    fontWeight: 'bold',
    fontSize: RFValue(37, fontSize.STANDARD_SCREEN_HEIGHT),
    fontFamily: 'OpenSans-Bold'
  },
  container: {
    height: RFValue(264, fontSize.STANDARD_SCREEN_HEIGHT),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: RFValue(17, fontSize.STANDARD_SCREEN_HEIGHT),
    marginHorizontal: RFValue(10, fontSize.STANDARD_SCREEN_HEIGHT),
  },
});

export default styles;
