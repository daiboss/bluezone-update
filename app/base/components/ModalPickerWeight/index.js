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
function ModalPicker({isVisibleModal, onCloseModal, onSelected, gender,currentWeight}) {
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
      dataWeight.push({value: i, label: i.toString() + ','});
    }
    let j = 0;
    let data3 = [];
    for (j; j <= 9; j++) {
      data3.push({value: i, label: j.toString() + ' kg'});
    }
    setWeight('65');
    setData(dataWeight);

    setData2(data3);
  }, []);
  useEffect(() => {
    if (gender == 1) {
      setWeight('65,');
    } else if (gender == 0) {
      setWeight('55,');
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
          initialSelectedIndex={gender == 1 ? 50 : gender == 0 ? 40 : 50}
          onScroll={({index, item}) => {
            setWeight(item.label);
          }}
          height={300}
          style={{
            alignItems: 'flex-end',
            paddingRight: 20,
          }}
          width={windowWidth / 2}
        />
        <DynamicallySelectedPicker
          items={data2}
          style={{
            alignItems: 'flex-start',
            paddingLeft: 20,
          }}
          onScroll={({index, item}) => {
            setWeight2(item.label);
          }}
          height={300}
          width={windowWidth / 2}
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
