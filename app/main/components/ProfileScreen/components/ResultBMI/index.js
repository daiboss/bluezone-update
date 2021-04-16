import React, { useEffect, useState, useRef, memo, useMemo } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import styles from './styles/index.css';
import message from '../../../../../core/msg/profile';
import NumberAnimate from './../../components/ResultBmiProgress/AnimateNumber'
import { Position } from './PositionDot';
import { injectIntl, intlShape } from 'react-intl';
import { RFValue } from '../../../../../const/multiscreen';
import { fontSize14, STANDARD_SCREEN_HEIGHT } from '../../../../../core/fontSize';
const { width, height } = Dimensions.get('window')

const WIDTH_ITEM = (width - ((RFValue(15) + 20) * 2)) / 5

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
      handleAnim(totalBmi);
    }
  }, [height, weight]);

  const handleAnim = (bmii) => {
    fadeAnim.setValue(0)

    let valueX = Position(Number(bmii), WIDTH_ITEM)

    Animated.timing(fadeAnim, {
      toValue: valueX,
      duration: 1500,
      useNativeDriver: false
    }).start();
  };

  return (
    <View style={[styles.container2, {
      // overflow: 'hidden'
      height: resultScreen ? RFValue(102, STANDARD_SCREEN_HEIGHT) : RFValue(129, STANDARD_SCREEN_HEIGHT)
    }]}>
      {resultScreen ? (
        <View style={[styles.empty]} />
      ) : (
          <View style={[styles.container3]}>
            <Text style={styles.textLabel}>{formatMessage(message.result)}</Text>
            <NumberAnimate
              steps={40}
              interval={1500 / (40)}
              formatter={(val) => {
                return parseFloat(val).toFixed(1)
              }}
              styleText={{
                fontSize: fontSize14,
                fontWeight: '700',
                fontFamily: 'OpenSans-Bold'
              }}
              value={bmi} />
          </View>
        )
      }

      <View style={styles.container4}>
        <View style={{
          flexDirection: 'row',
          width: '100%',
          paddingBottom: RFValue(4, STANDARD_SCREEN_HEIGHT)
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
            borderRadius: RFValue(2, STANDARD_SCREEN_HEIGHT),
            overflow: 'hidden',
            height: RFValue(4, STANDARD_SCREEN_HEIGHT)
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
                left: 0,
                transform: [
                  {
                    translateX: fadeAnim
                  },
                ],
              },
            ]}
          />
        </View>

        <View style={{
          flexDirection: 'row',
          width: '100%',
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
            {formatMessage(message.classOneObesity2Line)}
          </Text>
          <Text style={[styles.textWarning, styles.textWarning5]}>
            {formatMessage(message.classTwoObesity2Line)}
          </Text>
        </View>

      </View>

    </View>
  );
};

export default injectIntl(memo(ResultBMI));
