import {injectIntl, intlShape} from 'react-intl';
import React, {useState} from 'react';
import styles from './styles/index.css';
import {View, TouchableOpacity, Text} from 'react-native';
import message from '../../../../../core/msg/profile';
import FastImage from 'react-native-fast-image';
import ModalPickerHeight from '../../../../../base/components/ModalPickerHeight';
import ModalPickerWeight from '../../../../../base/components/ModalPickerWeight';
import ChartLine from '../ChartLine';
const SelectHeightOrWeight = ({
  intl,
  onSelected,
  type,
  label,
  value,
  error,
  listProfile,
  time,
  gender,
}) => {
  const {formatMessage} = intl;
  const [isVisibleHeight, setIsVisibleHeight] = useState(false);
  const [isVisibleWeight, setIsVisibleWeight] = useState(false);
  const selectGender = () => {
    // onSelected && onSelected(gender);
    if (type == 'height') {
      setIsVisibleHeight(true);
    } else {
      setIsVisibleWeight(true);
    }
  };
  return (
    <>
      <View style={[styles.container2, error ? styles.borderError : {}]}>
        <View style={[styles.container3]}>
          <Text style={styles.textLabel}>{label}</Text>
          <View style={styles.containerSelectGender}>
            <TouchableOpacity
              onPress={selectGender}
              style={[styles.buttonSelect]}>
              <Text
                style={[
                  styles.textGender,
                  value?.substr(0, value?.length - 2) ? {color: '#000'} : {},
                ]}>
                {value}
              </Text>
              <FastImage
                source={require('../../styles/images/ic_next.png')}
                style={[styles.iconNext]}
              />
            </TouchableOpacity>
          </View>
        </View>
        {type == 'weight' && listProfile?.length ? (
          <ChartLine data={listProfile} time={time} />
        ) : null}
      </View>
      {(error && <Text style={[styles.textError]}>{error}</Text>) || null}
      <ModalPickerHeight
        isVisibleModal={isVisibleHeight}
        onCloseModal={() => setIsVisibleHeight(false)}
        gender={gender}
        onSelected={height => {
          onSelected(height);
        }}
      />

      <ModalPickerWeight
        isVisibleModal={isVisibleWeight}
        onCloseModal={() => setIsVisibleWeight(false)}
        gender={gender}
        onSelected={weight => {
          onSelected(weight);
        }}
      />
    </>
  );
};

export default injectIntl(SelectHeightOrWeight);
