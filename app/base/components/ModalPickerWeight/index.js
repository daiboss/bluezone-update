import React, { useState, useEffect, } from 'react';
import * as PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/native';
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
import NewSelectedView from './../../../main/components/ProfileScreen/components/NewSelectedView/NewSelectedView'

function ModalPicker({
  isVisibleModal,
  onCloseModal,
  onSelected,
  gender,
  currentWeight,
}) {
  const [weight, setWeight] = useState(gender == 1 ? '65,' : '50,');
  const [weight2, setWeight2] = useState('0 kg');
  useEffect(() => {
    setWeight('65,');
  }, []);

  useEffect(() => {
    if (currentWeight) {
      let index = currentWeight.indexOf(',')
      if (index != -1) {
        let tmp = currentWeight.split(",")
        setWeight(`${tmp[0]},`)
        setWeight2(tmp[1])
      }
    } else {
      if (gender == 1) {
        setWeight('65,');
      } else if (gender == 0) {
        setWeight('50,');
      }
    }

  }, [gender, currentWeight]);

  const selectHeight = () => {
    onSelected && onSelected(`${weight}${weight2 || '0 kg'}`);
    onCloseModal();
  };
  return (
    <ModalComponent
      useNativeDriver={true}
      isVisible={isVisibleModal}
      onBackdropPress={selectHeight}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={1}
      style={styles.modal}>
      <View style={styles.content}>
        <NewSelectedView
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
            marginVertical: 30,
            flex: 1
          }}
          // textStyle={{
          //   alignSelf: 'flex-end',
          //   marginRight: 14
          // }}
        />

        <NewSelectedView
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
            marginVertical: 30,
            flex: 1
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
