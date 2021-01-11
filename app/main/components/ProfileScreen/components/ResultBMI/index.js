import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Animated} from 'react-native';
import styles from './styles/index.css';
import message from '../../../../../core/msg/profile';
import {injectIntl, intlShape} from 'react-intl';
const ResultBMI = ({height, weight, intl, resultScreen}) => {
  const {formatMessage} = intl;
  const [bmi, setBmi] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (height && weight) {
      let h = height.substring(0, height.length - 3) / 100;
      console.log('h: ', h);
      let w = weight.substring(0, weight.length - 4).replace(',', '.');
      console.log('w: ', w);
      let totalBmi = parseFloat(w / (h * h)).toFixed(1);
      console.log('totalBmiiiiiiiiiiii: ', totalBmi);
      setBmi(totalBmi);
    }
    handleAnim();
  }, [height, weight]);
  const handleAnim = () => {
    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false
    }).start();
  };
  const getPositionDot = () => {
    let per = '0%';
    if (bmi < 18.5) {
      per = bmi + '%';
    } else if (bmi <= 22.9 && bmi >= 18.5) {
      per = bmi * 0.6 + 20 + '%';
    } else if (bmi <= 24.9 && bmi >= 23) {
      per = bmi * 0.4 + 40 + '%';
    } else if (bmi <= 29.9 && bmi >= 25) {
      per = bmi * 1 + 40 + '%';
    } else if (bmi >= 30 && bmi <= 34.9) {
      per = '85%';
    } else if (bmi >= 35) {
      per = '98%';
    }
    return per;
  };
  return (
    <View style={[styles.container2, {
      overflow: 'hidden'
    }]}>
      {resultScreen ? (
        <View style={[styles.empty]} />
      ) : (
        <View style={[styles.container3]}>
          <Text style={styles.textLabel}>Kết quả BMI (Kg/m2) của bạn</Text>
          <Text style={styles.textTotalBmi}>{bmi}</Text>
        </View>
      )}
      <View style={styles.container4}>
        <View style={[styles.flex, styles.group]}>
          <View style={[styles.flex]}>
            <Text style={styles.textValue}>18.5</Text>
            <View
              style={[styles.line1, styles.line, styles.borderRadiusLeft]}
            />
          </View>
          <Text style={[styles.textWarning, styles.textWarning1]}>
            {formatMessage(message.skinny)}
          </Text>
        </View>
        <View style={[styles.flex, styles.group]}>
          <View style={[styles.flex]}>
            <Text style={styles.textValue}>22.9</Text>
            <View style={[styles.line2, styles.line]} />
          </View>
          <Text style={[styles.textWarning, styles.textWarning2]}>
            {formatMessage(message.fit)}
          </Text>
        </View>
        <View style={[styles.flex, styles.group]}>
          <View style={[styles.flex]}>
            <Text style={styles.textValue}>24.9</Text>
            <View style={[styles.line3, styles.line]} />
          </View>
          <Text style={[styles.textWarning, styles.textWarning3]}>
            {formatMessage(message.overWeight)}
          </Text>
        </View>
        <View style={[styles.flex, styles.group]}>
          <View style={[styles.flex]}>
            <Text style={styles.textValue}>29.9</Text>
            <View style={[styles.line4, styles.line]} />
          </View>
          <Text style={[styles.textWarning, styles.textWarning4]}>
            {formatMessage(message.classOneObesity)}
          </Text>
        </View>
        <View style={[styles.flex, styles.group]}>
          <View style={[styles.flex]}>
            <View
              style={[styles.line5, styles.line, styles.borderRadiusRight]}
            />
          </View>
          <Text style={[styles.textWarning, styles.textWarning5]}>
            {formatMessage(message.classTwoObesity)}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.dot,
            {
              left: getPositionDot(),
              transform: [
                {
                  translateX: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-150, 0], // 0 : 150, 0.5 : 75, 1 : 0
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

export default injectIntl(ResultBMI);
