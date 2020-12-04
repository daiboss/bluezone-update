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
import {widthPercentageToDP} from '../../../core/utils/dimension';
function ModalPicker({isVisibleModal, onCloseModal, onSelected}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let dataHeight = [];
    let i = 100;
    for (i; i <= 300; i++) {
      dataHeight.push(i.toString() + ' cm');
    }
    setData(dataHeight);
  }, []);
  const [height, setHeight] = useState('100 cm');
  const [index, setIndex] = useState(0);
  const selectHeight = () => {
    onSelected && onSelected(height);
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
              height: widthPercentageToDP(Platform.OS === 'ios' ? 50 : 40),
            }}
            onItemSelected={height => {
              setHeight(data[height]);
              setIndex(height);
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
