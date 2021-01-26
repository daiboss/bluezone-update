import React, { useEffect, useState, useRef, memo, useMemo } from 'react';
import { View, Text, Animated,Dimensions } from 'react-native';
import styles from './styles/index.css';
import message from '../../../../../core/msg/profile';
import NumberAnimate from './../../components/ResultBmiProgress/AnimateNumber'
import { Position } from './PositionDot';
import { injectIntl, intlShape } from 'react-intl';
const {width,height} = Dimensions.get('window')
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
  return (
    <View style={[styles.container2, {
      // overflow: 'hidden'
    }]}>
      {resultScreen ? (
        <View style={[styles.empty]} />
      ) : (
          <View style={[styles.container3]}>
            <Text style={styles.textLabel}>{formatMessage(message.result)}</Text>
            <NumberAnimate
              steps={30}
              interval={1300 / (30)}
              formatter={(val) => {
                return parseFloat(val).toFixed(1)
              }}
              styleText={{
                fontSize: 10
              }}
              value={bmi} />
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
            <View style={[styles.line1, styles.line]}/>
            <View style={[styles.line2, styles.line]} />
            <View style={[styles.line3, styles.line]} />
            <View style={[styles.line4, styles.line]} />
            <View style={[styles.line5, styles.line]} />
          </View>

          <Animated.View
            style={[
              styles.dot,
              {
                left: Position(bmi),
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
