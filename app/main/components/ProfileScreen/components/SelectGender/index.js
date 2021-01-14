import { injectIntl, intlShape } from 'react-intl';
import React from 'react';
import styles from './styles/index.css';
import { View, TouchableOpacity, Text } from 'react-native';
import message from '../../../../../core/msg/profile';
const SelectGender = ({ intl, onSelectGender, gender }) => {
  const { formatMessage } = intl;
  const selectGender = gender => () => {
    onSelectGender && onSelectGender(gender);
  };
  return (
    <View style={styles.container2}>
      <Text style={styles.textLabel}>{formatMessage(message.gender)}</Text>
      <TouchableOpacity
        onPress={selectGender(gender == 1 ? 0 : 1)}
        activeOpacity={0.8}
        style={styles.containerSelectGender}>
        <View
          style={[
            styles.buttonSelectGender,
            gender == 1 ? styles.backgroundColorGenderSelected : {},
          ]}>
          <Text
            style={[
              styles.textGender,
              gender == 1 ? styles.colorGenderSelected : styles.colorUnSelected,
            ]}>
            {formatMessage(message.male)}
          </Text>
        </View>
        <View
          style={[
            styles.buttonSelectGender,
            gender == 0 ? styles.backgroundColorGenderSelected : {},
          ]}>
          <Text
            style={[
              styles.textGender,
              gender == 0 ? styles.colorGenderSelected : styles.colorUnSelected,
            ]}>
            {formatMessage(message.female)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default injectIntl(SelectGender);
