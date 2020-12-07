import React, {useState, useEffect} from 'react';
import * as PropTypes from 'prop-types';
import {View, Platform, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
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
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../core/utils/dimension';
function ModalPicker({isVisibleModal, onCloseModal, onSelected, gender}) {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [weight, setWeight] = useState(gender == 1 ? '65' : '50');
  const [index, setIndex] = useState(0);

  const [weight2, setWeight2] = useState('0 kg');
  const [index2, setIndex2] = useState(0);
  useEffect(() => {
    let dataWeight = [];
    let i = 15;
    for (i; i <= 300; i++) {
      dataWeight.push(i.toString());
    }
    let j = 0;
    let data3 = [];
    for (j; j <= 9; j++) {
      data3.push(j.toString() + ' kg');
    }
    setIndex(50);
    setWeight('65');
    setData(dataWeight);
    setData2(data3);
  }, []);
  useEffect(() => {
    if (gender == 1) {
      setIndex(data.findIndex(e => e == '65'));
      setWeight('65');
    } else if (gender == 0) {
      setIndex(data.findIndex(e => e == '55'));
      setWeight('55');
    }
  }, [gender]);

  const selectHeight = () => {
    onSelected && onSelected(weight + ',' + weight2);
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
        <WheelPicker
          selectedItem={index}
          data={data}
          style={{
            width: widthPercentageToDP(50),
            height: heightPercentageToDP(30),
          }}
          onItemSelected={weight => {
            setWeight(data[weight]);
            setIndex(weight);
          }}
        />
        <WheelPicker
          selectedItem={index2}
          data={data2}
          style={{
            width: widthPercentageToDP(50),
            height: heightPercentageToDP(30),
          }}
          onItemSelected={weight => {
            setWeight2(data2[weight]);
            setIndex2(weight);
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
  onCloseModal: () => {},
  styleTitle: {},
  styleDescription: {},
};

export default ModalPicker;
