import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, ImageBackground, Text, Animated, Easing } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import message from '../../../../../core/msg/profile';
import styles from './styles/index.css';
import { injectIntl, intlShape } from 'react-intl';
import LinearGradient from './LinearGradient';
import AnimateNumber from './AnimateNumber';
import { RFValue } from '../../../../../const/multiscreen';
import { STANDARD_SCREEN_HEIGHT } from '../../../../../core/fontSize';
// import Animated, { Easing } from 'react-native-reanimated';

const TIME_ANIM = 2000

const ResultBmiProgress = ({ bmi, intl }) => {
  const { formatMessage } = intl;
  const [fill, setFill] = useState('#015CD0');
  const [status, setStatus] = useState(message.fit);
  const [listColorBackground, setListColorBackground] = useState([])
  const animShow = useRef(new Animated.Value(0)).current

  const animShowText = Animated.timing(animShow, {
    toValue: 1,
    useNativeDriver: true,
    duration: 100,
    delay: TIME_ANIM,
    easing: Easing.linear,
  })

  useEffect(() => {
    let color;
    let status;
    if (bmi < 18.5) {
      color = '#015CD0';
      setListColorBackground([
        '#015CD0',
        'rgb(76, 39, 216)',
        'rgb(23, 1, 208)',
        '#015CD0',
        '#015CD0',
      ])
      status = message.skinny;
    } else if (bmi <= 22.9 && bmi >= 18.5) {
      color = '#00B67E';
      setListColorBackground([
        '#00B67E',
        'rgb(76, 39, 216)',
        '#015CD0',
        'rgb(0, 165, 182)',
        '#00B67E',
        '#00B67E',
      ])
      status = message.fit;
    } else if (bmi <= 24.9 && bmi >= 23) {
      color = '#FFD500';
      setListColorBackground([
        '#FFD500',
        'rgb(76, 39, 216)',
        '#015CD0',
        '#00B67E',
        'rgb(180, 255, 0)',
        '#FFD500',
        '#FFD500',
      ])
      status = message.overWeight;
    } else if (bmi <= 29.9 && bmi >= 25) {
      color = '#FF8E30';
      setListColorBackground([
        '#FF8E30',
        '#015CD0',
        '#00B67E',
        '#FFD500',
        '#FF8E30',
        '#FF8E30',
      ])
      status = message.classOneObesity;
    } else if (bmi >= 30) {
      color = '#FE4358';
      setListColorBackground([
        '#FE4358',
        '#015CD0',
        '#00B67E',
        '#FFD500',
        '#FF8E30',
        '#FE4358',
        '#FE4358',
      ])
      status = message.classTwoObesity;
    }
    setStatus(status);
    setFill(color);
    animShowText.start()
  }, [bmi]);

  const renderCircle = () => {
    if (listColorBackground.length > 0) {
      return (
        <View style={{
          width: '100%',
          height: '100%',
          position: 'absolute'
        }}>
          <LinearGradient
            points={{
              start: { x: 0.2, y: 0 },
              end: { x: 0.8, y: 0.6 }
            }}
            customColors={listColorBackground}
            speed={TIME_ANIM} >
          </LinearGradient>
        </View>
      )
    }
  }

  return (
    <View>
      <ImageBackground
        source={require('../../styles/images/ic_bg.png')}
        style={styles.container}
        resizeMode={'stretch'}>
        <View
          style={styles.group}>
          <View style={{
            width: RFValue(192, STANDARD_SCREEN_HEIGHT),
            height: RFValue(192, STANDARD_SCREEN_HEIGHT),
            borderRadius: RFValue(192 / 2, STANDARD_SCREEN_HEIGHT),
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>

            {
              renderCircle()
            }

            <View style={{
              width: RFValue(178, STANDARD_SCREEN_HEIGHT),
              height: RFValue(178, STANDARD_SCREEN_HEIGHT),
              backgroundColor: '#fff',
              borderRadius: RFValue(178 / 2, STANDARD_SCREEN_HEIGHT),
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <AnimateNumber
                steps={30}
                interval={TIME_ANIM / (30)}
                formatter={(val) => {
                  return parseFloat(val).toFixed(1)
                }}
                style={[
                  styles.textTotalBmi,
                  {
                    color: fill,
                  },
                ]}
                value={bmi} />

              <Animated.Text 
              numberOfLines={1}
              style={[styles.textStatus, {
                width: '100%',
                textAlign: 'center',
                opacity: animShow,
                fontFamily: 'OpenSans-Bold',
                fontWeight: '600',
              }]}>{formatMessage(status)}</Animated.Text>

            </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
};

export default injectIntl(ResultBmiProgress);
