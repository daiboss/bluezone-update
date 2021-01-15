import React, { useState, useEffect } from 'react';
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

// Styles
import styles from './styles/index.css';
import ModalComponent from '../ModalComponent';
import CustomSelect from './../../../main/components/ProfileScreen/components/SelectHeightOrWeight/CustomSelect'

let dataWeight = [];
let i = 15;
let j = 0;
let data3 = [];
for (i; i <= 300; i++) {
  dataWeight.push(i.toString() + ',');
}
for (j; j <= 9; j++) {
  data3.push(j.toString() + ' kg');
}
function ModalPicker({
  isVisibleModal,
  onCloseModal,
  onSelected,
  gender,
  currentWeight,
}) {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [weight, setWeight] = useState(gender == 1 ? '65,' : '50,');
  const [index, setIndex] = useState(0);

  const [weight2, setWeight2] = useState('0 kg');
  const [index2, setIndex2] = useState(0);
  useEffect(() => {
    setWeight('65,');
    setData(dataWeight);

    setData2(data3);
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
      isVisible={isVisibleModal}
      onBackdropPress={selectHeight}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modal}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}>
      <View style={styles.content}>
        <CustomSelect
          onValueChange={setWeight}
          dataSource={data}
          selectedIndex={
            data.findIndex(e => e == `${weight}`) != -1
              ? data.findIndex(e => e == `${weight}`)
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
          dataSource={data2}
          selectedIndex={
            data2.findIndex(e => e == weight2) != -1
              ? data2.findIndex(e => e == weight2)
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
