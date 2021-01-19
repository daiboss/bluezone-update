import React, { useEffect, useState, useRef, memo, useMemo } from 'react';
import { View, Text, Animated } from 'react-native';
import styles from './styles/index.css';
import message from '../../../../../core/msg/profile';
import NumberAnimate from './../../components/ResultBmiProgress/AnimateNumber'
import { injectIntl, intlShape } from 'react-intl';
const ResultBMI = ({ height, weight, intl, resultScreen }) => {
  const { formatMessage } = intl;
  const [bmi, setBmi] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (height && weight) {
      let h = Number(height?.replace('cm', '')?.trim() || 0) / 100;
      let w = Number(weight?.replace('kg', '')?.replace(',', '.')?.replace(' ', '') || 0);
      let totalBmi = parseFloat(w / (h * h)).toFixed(1);
      setBmi(totalBmi);
    }
    handleAnim();
  }, [height, weight]);
  const handleAnim = () => {
    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
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
      // overflow: 'hidden'
    }]}>
      {resultScreen ? (
        <View style={[styles.empty]} />
      ) : (
          <View style={[styles.container3]}>
            <Text style={styles.textLabel}>{formatMessage(message.result)}</Text>
            {/* <Text style={styles.textTotalBmi}>{bmi}</Text> */}
            {/* <NumberAnimate steps={0.3}
              interval={2000 / (30)}
              formatter={(val) => {
                return parseFloat(val).toFixed(1)
              }}
              // textBlueNumber={styles.textTotalBmi}
              style={[
                styles.textTotalBmi,
                // {
                //   color: fill,
                // },
              ]}
              value={parseInt(bmi)} /> */}
            <NumberAnimate
              styleText={{
                fontSize: 10
              }}
              interval={1400 / (30)}
              value={bmi}
              countBy={Math.floor(bmi / 40)}
              // timing="easeOut"
              formatter={val => {
                return parseFloat(val).toFixed(1);
              }}
            />
          </View>
        )}
      <View style={styles.container4}>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          paddingBottom: 2
        }}>
          <Text style={styles.textValue}>18.5</Text>
          <Text style={styles.textValue}>22.9</Text>
          <Text style={styles.textValue}>24.9</Text>
          <Text style={styles.textValue}>29.9</Text>
          <Text style={styles.textValue}></Text>
        </View>
        <View style={{
          overflow: 'visible',
          height: 14,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            borderRadius: 10,
            overflow: 'hidden',
            height: 6,
          }}>
            <View style={[styles.line1, styles.line]} />
            <View style={[styles.line2, styles.line]} />
            <View style={[styles.line3, styles.line]} />
            <View style={[styles.line4, styles.line]} />
            <View style={[styles.line5, styles.line]} />
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

        <View style={{
          flexDirection: 'row',
          width: '100%',
          paddingBottom: 20
        }}>
          <Text style={[styles.textWarning, styles.textWarning1]}>
            {formatMessage(message.skinny)}
          </Text>
          <Text style={[styles.textWarning, styles.textWarning2]}>
            {formatMessage(message.fit)}
          </Text>
          <Text style={[styles.textWarning, styles.textWarning3]}>
            {formatMessage(message.overWeight)}
          </Text>
          <Text style={[styles.textWarning, styles.textWarning4]}>
            {formatMessage(message.classOneObesity)}
          </Text>
          <Text style={[styles.textWarning, styles.textWarning5]}>
            {formatMessage(message.classTwoObesity)}
          </Text>
        </View>

      </View>
    </View>
  );
};

export default injectIntl(memo(ResultBMI));
