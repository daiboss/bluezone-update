import React, {useState, useEffect} from 'react';
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
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../core/utils/dimension';
const windowWidth = Dimensions.get('window').width;
import DynamicallySelectedPicker from '../DynamicallySelectedPicker/DynamicallySelectedPicker';
let dataWeight = [];
let i = 15;
let j = 0;
let data3 = [];
for (i; i <= 300; i++) {
  dataWeight.push({value: i, label: i.toString() + ', '});
}
for (j; j <= 9; j++) {
  data3.push({value: i, label: j.toString() + ' kg'});
}
function ModalPicker({
  isVisibleModal,
  onCloseModal,
  onSelected,
  gender,
  currentWeight,
}) {
  console.log('currentWeight: ', currentWeight);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [weight, setWeight] = useState(gender == 1 ? '65, ' : '50, ');
  const [index, setIndex] = useState(0);

  const [weight2, setWeight2] = useState('0 kg');
  const [index2, setIndex2] = useState(0);
  useEffect(() => {
    setWeight('65, ');
    setData(dataWeight);

    setData2(data3);
  }, []);
  useEffect(() => {
    if (gender == 1) {
      setWeight('65, ');
    } else if (gender == 0) {
      setWeight('50, ');
    }
  }, [gender]);

  const selectHeight = () => {
    onSelected && onSelected(weight + (weight2 || '0kg'));
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
            dataWeight.findIndex(
              e =>
                e.label == currentWeight.substring(0, currentWeight.length - 4),
            ) !== -1
              ? dataWeight.findIndex(
                  e =>
                    e.label ==
                    currentWeight.substring(0, currentWeight.length - 4),
                )
              : gender == 1
              ? 50
              : gender == 0
              ? 35
              : 50
          }
          onScroll={({index, item}) => {
            setWeight(item.label);
          }}
          height={300}
          style={{
            alignItems: 'flex-end',
            paddingRight: 20,
          }}
          width={'50%'}
        />
        <DynamicallySelectedPicker
          items={data2}
          initialSelectedIndex={
            data3.findIndex(
              e =>
                e.label ==
                currentWeight.substring(
                  currentWeight.length - 4,
                  currentWeight.length,
                ),
            )
              ? data3.findIndex(
                  e =>
                    e.label ==
                    currentWeight.substring(
                      currentWeight.length - 4,
                      currentWeight.length,
                    ),
                )
              : 0
          }
          style={{
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onScroll={({index, item}) => {
            setWeight2(item.label);
          }}
          height={300}
          width={'50%'}
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
