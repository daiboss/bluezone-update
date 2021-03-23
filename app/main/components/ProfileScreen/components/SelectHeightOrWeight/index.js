import { injectIntl, intlShape } from 'react-intl';
import React, { useEffect, useState,memo } from 'react';
import AppleHealthKit from 'rn-apple-healthkit';
import styles from './styles/index.css';
import { View, TouchableOpacity, Text } from 'react-native';
import message from '../../../../../core/msg/profile';
import FastImage from 'react-native-fast-image';
import ModalPickerHeight from '../../../../../base/components/ModalPickerHeight';
import ModalPickerWeight from '../../../../../base/components/ModalPickerWeight';
import ChartLineV from '../ChartLineV';
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
  currentHeight,
  currentWeight,
  visiHeight = false,
  visiWeight = false
}) => {
  const { formatMessage } = intl;
  const [isVisibleHeight, setIsVisibleHeight] = useState(visiHeight);
  const [isVisibleWeight, setIsVisibleWeight] = useState(visiWeight);
  const selectGender = () => {
    if (type == 'height') {
      setIsVisibleHeight(true);
    } else {
      setIsVisibleWeight(true);
    }
  };

  useEffect(() => {
    setIsVisibleHeight(visiHeight)
    setIsVisibleWeight(visiWeight)
  }, [visiHeight, visiWeight])

  const onSelectedHeight = (h) => {
    onSelected(h)
  }

  const onSelectedWeight = (w) => {
    onSelected(w)
  }

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
                  {
                    color: (value == 'cm' || value == 'kg') ? '#949494' : '#222'
                  }
                ]}>
                {value}
              </Text>
              <FastImage
                source={require('../../styles/images/ic_next.png')}
                style={[
                  styles.iconNext,
                  type == 'weight' && listProfile?.length
                    ? { transform: [{ rotate: '90deg' }] }
                    : {},
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        {type == 'weight' && listProfile?.length ? (
          <ChartLineV data={listProfile} time={time} />
        ) : null}
      </View>
      {(error && <Text style={[styles.textError]}>{error}</Text>) || null}
      <ModalPickerHeight
        isVisibleModal={isVisibleHeight}
        onCloseModal={() => setIsVisibleHeight(false)}
        gender={gender}
        currentHeight={currentHeight || ''}
        onSelected={onSelectedHeight}
      />

      <ModalPickerWeight
        isVisibleModal={isVisibleWeight}
        onCloseModal={() => setIsVisibleWeight(false)}
        gender={gender}
        currentWeight={currentWeight || ''}
        onSelected={onSelectedWeight}
      />
    </>
  );
};

export default injectIntl(memo(SelectHeightOrWeight));
