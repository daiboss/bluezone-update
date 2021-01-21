import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  WheelPicker,
  TimePicker,
  DatePicker,
} from 'react-native-wheel-picker-android';

import { DATA_LEFT, DATA_RIGHT } from './data'

// Components
import Text from '../Text';

// Styles
import styles from './styles/index.css';
import ModalComponent from '../ModalComponent';
import CustomSelect from './../../../main/components/ProfileScreen/components/SelectHeightOrWeight/CustomSelect'

function ModalPicker({
  isVisibleModal,
  onCloseModal,
  onSelected,
  gender,
  currentWeight,
}) {
  const [weight, setWeight] = useState(gender == 1 ? '65,' : '50,');
  const [index, setIndex] = useState(0);

  const [weight2, setWeight2] = useState('0 kg');
  const [index2, setIndex2] = useState(0);
  useEffect(() => {
    setWeight('65,');
  }, []);
  useEffect(() => {
    if (gender == 1) {
      setWeight('65,');
    } else if (gender == 0) {
      setWeight('50,');
    }
  }, [gender]);

  const selectHeight = () => {
    onSelected && onSelected(`${weight}${weight2 || '0kg'}`);
    onCloseModal();
  };
  return (
    <ModalComponent
      useNativeDriver={true}
      isVisible={isVisibleModal}
      onBackdropPress={selectHeight}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modal}>
      <View style={styles.content}>
        <CustomSelect
          onValueChange={setWeight}
          dataSource={DATA_LEFT}
          selectedIndex={
            DATA_LEFT.findIndex(e => e == `${weight}`) != -1
              ? DATA_LEFT.findIndex(e => e == `${weight}`)
              : gender == 1
                ? 50
                : gender == 0
                  ? 35
                  : 50
          }
          containerStyle={{
            marginVertical: 30
          }}
          textStyle={{
            alignSelf: 'flex-end',
            marginRight: 14
          }}
        />

        <CustomSelect
          onValueChange={setWeight2}
          dataSource={DATA_RIGHT}
          selectedIndex={
            DATA_RIGHT.findIndex(e => e == weight2) != -1
              ? DATA_RIGHT.findIndex(e => e == weight2)
              : gender == 1
                ? 50
                : gender == 0
                  ? 35
                  : 50
          }
          containerStyle={{
            marginVertical: 30
          }}
          textStyle={{
            alignSelf: 'flex-start',
            marginLeft: 14
          }}
        />
      </View>
    </ModalComponent>
  );
}

ModalPicker.propTypes = {
  isVisibleModal: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.any,
  onCloseModal: PropTypes.func,
  styleTitle: PropTypes.object,
  styleDescription: PropTypes.object,
};

ModalPicker.defaultProps = {
  onCloseModal: () => { },
  styleTitle: {},
  styleDescription: {},
};

export default ModalPicker;
