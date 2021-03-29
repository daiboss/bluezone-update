import { injectIntl, intlShape } from 'react-intl';
import React, { useEffect, useRef } from 'react';
import styles from './styles/index.css';
import { View, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import message from '../../../../../core/msg/profile';
import { RFValue } from '../../../../../const/multiscreen';
import { STANDARD_SCREEN_HEIGHT } from '../../../../../core/fontSize';

const SIZE = RFValue(128, STANDARD_SCREEN_HEIGHT)

const SelectGender = ({ intl, onSelectGender, gender }) => {
  const { formatMessage, locale } = intl;
  const translateX = useRef(new Animated.Value(0)).current;

  const selectGender = gender => () => {
    onSelectGender && onSelectGender(gender);
  };

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: gender ? 0 : SIZE * 1,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.in,
    }).start();
  }, [gender]);


  return (
    <View style={styles.container2}>
      <Text style={styles.textLabel}>{formatMessage(message.gender)}</Text>

      <TouchableOpacity
        onPress={selectGender(gender == 1 ? 0 : 1)}
        activeOpacity={0.8}
        style={styles.containerSelectGender}>
        <Animated.View style={styles.container}>

          <View style={styles.absoluteLayer}>
            <Text style={styles.smallZero}>{formatMessage(message.male)}</Text>
            <Text style={styles.smallOne}>{formatMessage(message.female)}</Text>
          </View>

          <Animated.View style={[styles.overLay, {
            width: translateX.interpolate({
              inputRange: [0, SIZE * 0.5, SIZE * 1],
              outputRange: [SIZE * 0.5, SIZE * 1, SIZE * 0.5],
            }),
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [0, SIZE * 0.5, SIZE * 1],
                  outputRange: [0, 0, SIZE * 0.5],
                }),
              },
            ],
          },]}>
            <Animated.Text style={[styles.overLayOne, {
              opacity: translateX.interpolate({
                inputRange: [0, SIZE * 0.5, SIZE * 1],
                outputRange: [0, 0, 1],
              }),
            }]} >{formatMessage(message.female)}</Animated.Text>

            <Animated.Text style={[styles.overLayZero, {
              opacity: translateX.interpolate({
                inputRange: [0, SIZE * 0.5, SIZE * 1],
                outputRange: [1, 0, 0],
              }),
            }]} >{formatMessage(message.male)}</Animated.Text>

          </Animated.View>

        </Animated.View>
      </TouchableOpacity>

    </View>
  );
};

export default injectIntl(SelectGender);
