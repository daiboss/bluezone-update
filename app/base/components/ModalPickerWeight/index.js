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
function ModalPicker({isVisibleModal, onCloseModal, onSelected}) {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
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
    setData(dataWeight);
    setData2(data3);
  }, []);
  const [weight, setWeight] = useState('15');
  const [index, setIndex] = useState(0);

  const [weight2, setWeight2] = useState('0 kg');
  const [index2, setIndex2] = useState(0);

  const selectHeight = () => {
    onSelected && onSelected(weight + ',' + weight2);
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
      <View style={styles.container}>
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
        <TouchableOpacity onPress={selectHeight} style={styles.buttonSelect}>
          <Text>Chọn</Text>
        </TouchableOpacity>
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
