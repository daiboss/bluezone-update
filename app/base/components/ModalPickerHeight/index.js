import React, {useState, useEffect, useCallback} from 'react';
import * as PropTypes from 'prop-types';
import {View, Platform, TouchableOpacity, Dimensions} from 'react-native';
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
import DynamicallySelectedPicker from '../DynamicallySelectedPicker/DynamicallySelectedPicker';
const windowWidth = Dimensions.get('window').width;
let dataHeight = [];
let i = 100;
for (i; i <= 300; i++) {
  dataHeight.push({
    label: i + ' cm',
    value: i,
  });
}
function ModalPicker({
  isVisibleModal,
  onCloseModal,
  onSelected,
  gender,
  currentHeight,
}) {
  const [data, setData] = useState([]);
  const [height, setHeight] = useState(() => {
    if (currentHeight) {
      return currentHeight.subString(0, currentHeight.length - 3);
    } else {
      return 165;
    }
  });
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    setData(dataHeight);
    // setIndex(dataHeight.findIndex(e => e.label == currentHeight));
    // 
  }, []);

  useEffect(() => {
    if (gender == 1) {
      setHeight(165);
    } else if (gender == 0) {
      setHeight(155);
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
        <DynamicallySelectedPicker
          items={data}
          initialSelectedIndex={
            dataHeight.findIndex(e => e.label == currentHeight) != -1
              ? dataHeight.findIndex(e => e.label == currentHeight)
              : gender == 1
              ? 65
              : gender == 0
              ? 55
              : 65
          }
          onScroll={({index, item}) => {
            setHeight(item.label);
          }}
          height={300}
          width={'100%'}
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
