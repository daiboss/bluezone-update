import React, { useState, useEffect, useCallback } from 'react';
import * as PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity, Dimensions } from 'react-native';
// Components
import Text from '../Text';
// Styles
import styles from './styles/index.css';
import ModalComponent from '../ModalComponent';
import NewSelectedView from './../../../main/components/ProfileScreen/components/NewSelectedView/NewSelectedView'

let dataHeight = [];
let i = 100;
for (i; i <= 300; i++) {
  dataHeight.push(i + ' cm');
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
      return currentHeight
    } else {
      return '165 cm';
    }
  });

  useEffect(() => {
    setData(dataHeight);
  }, []);

  useEffect(() => {
    if (gender == 1) {
      setHeight('165 cm');
    } else if (gender == 0) {
      setHeight('155 cm');
    }
  }, [gender]);
  const selectHeight = () => {
    onSelected && onSelected(height);
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
      style={styles.modal}
      backdropTransitionInTiming={1}
      backdropTransitionOutTiming={1}
    >
      <View style={styles.content}>
        <NewSelectedView
          // isRemoveSub={false}
          onValueChange={setHeight}
          dataSource={data}
          selectedIndex={
            data.findIndex(e => e == currentHeight) != -1
              ? data.findIndex(e => e == currentHeight)
              : gender == 1
                ? 65
                : gender == 0
                  ? 55
                  : 65
          }
          containerStyle={{
            marginVertical: 30,
            flex: 1
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
