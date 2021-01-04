import React, { useState, useEffect, useCallback } from 'react';
import * as PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  WheelPicker,
  TimePicker,
  DatePicker,
} from 'react-native-wheel-picker-android';
// Components
import Text from '../Text';
import DynamicallySelectedPicker from '../DynamicallySelectedPicker/DynamicallySelectedPicker';
// Styles
import styles from './styles/index.css';
import ModalComponent from '../ModalComponent';
import message from './../../../core/msg/setting'
const windowWidth = Dimensions.get('window').width;
let dataSteps = [];
let i = 0;
Number.prototype.format = function (n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};
for (i; i <= 100000; i += 250) {
  dataSteps.push({
    label: i.format() + ' bước',
    value: i,
  });
}
function ModalPickerStepsTarget({
  isVisibleModal,
  onCloseModal,
  onSelected,
  intl,
  currentSteps = 10000
}) {
  const { formatMessage } = intl;
  const [steps, setSteps] = useState(() => {
    if (currentSteps) {
      return currentSteps;
    } else {
      return 165;
    }
  })

  const selectHeight = () => {
    onSelected && onSelected(steps);
    onCloseModal();
  };

  return (
    <ModalComponent
      isVisible={isVisibleModal}
      onBackdropPress={onCloseModal}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modal}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}>
      <View style={styles.content}>
        <View style={styles.body}>

          <DynamicallySelectedPicker
            items={dataSteps}
            initialSelectedIndex={
              dataSteps.findIndex(e => e.value == currentSteps) != -1
                ? dataSteps.findIndex(e => e.value == currentSteps)
                : 10000
            }
            onScroll={({ index, item }) => {
              setSteps(item.value);
            }}
            height={300}
            width={'100%'}
          />

          <TouchableOpacity
            onPress={selectHeight}
            activeOpacity={0.8}
            style={styles.btnSave}>
            <Text style={styles.txButton}>
              {formatMessage(message.Save)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.txRecomends}>
            {formatMessage(message.stepRecommends)} <Text style={styles.txRed}>10,000</Text> {formatMessage(message.stepsADay)}</Text>
        </View>
      </View>
    </ModalComponent>
  );
}

ModalPickerStepsTarget.propTypes = {
  isVisibleModal: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.any,
  onCloseModal: PropTypes.func,
  styleTitle: PropTypes.object,
  styleDescription: PropTypes.object,
};

ModalPickerStepsTarget.defaultProps = {
  onCloseModal: () => { },
  styleTitle: {},
  styleDescription: {},
};

export default ModalPickerStepsTarget;
