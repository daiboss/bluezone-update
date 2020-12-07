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
function ModalPicker({isVisibleModal, onCloseModal, onSelected, gender}) {
  const [data, setData] = useState([]);
  const [height, setHeight] = useState(gender == 1 ? '165 cm' : '155 cm');
  const [index, setIndex] = useState(0);
  useEffect(() => {
    let dataHeight = [];
    let i = 100;
    for (i; i <= 300; i++) {
      dataHeight.push(i.toString() + ' cm');
    }
    setData(dataHeight);
    setIndex(65);
    setHeight('165 cm');
  }, []);

  useEffect(() => {
    if (gender == 1) {
      setHeight('165 cm');
      setIndex(data.findIndex(e => e == '165 cm'));
    } else if (gender == 0) {
      setHeight('155 cm');
      setIndex(data.findIndex(e => e == '155 cm'));
    }
  }, [gender]);
  const selectHeight = () => {
    onSelected && onSelected(height);
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
            height: widthPercentageToDP(Platform.OS === 'ios' ? 50 : 40),
          }}
          onItemSelected={height => {
            setHeight(data[height]);
            setIndex(height);
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
