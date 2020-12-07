import React, {useEffect, useState} from 'react';
import {View, ImageBackground, Text} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import message from '../../../../../core/msg/profile';
import styles from './styles/index.css';
import {injectIntl, intlShape} from 'react-intl';
const ResultBmiProgress = ({bmi, intl}) => {
  const {formatMessage} = intl;
  const [fill, setFill] = useState('#015CD0');
  const [status, setStatus] = useState(message.fit);
  useEffect(() => {
    let color;
    let status;
    if (bmi < 18.5) {
      color = '#015CD0';
      status = message.skinny;
    } else if (bmi <= 22.9 && bmi >= 18.5) {
      color = '#00B67E';
      status = message.fit;
    } else if (bmi <= 24.9 && bmi >= 23) {
      color = '#FFD500';
      status = message.overWeight;
    } else if (bmi <= 29.9 && bmi >= 25) {
      color = '#FF8E30';
      status = message.classOneObesity;
    } else if (bmi >= 30) {
      color = '#FE4358';
      status = message.classTwoObesity;
    }
    setStatus(status);
    setFill(color);
  }, [bmi]);
  return (
    <View>
      <ImageBackground
        source={require('../../styles/images/ic_bg.png')}
        style={styles.container}
        resizeMode={'contain'}>
        <View
          style={styles.group}>
          <AnimatedCircularProgress
            size={200}
            width={8}
            fill={100}
            tintColor={fill}
            backgroundColor="#FFF">
            {() => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text
                  style={[
                    styles.textTotalBmi,
                    {
                      color: fill,
                    },
                  ]}>
                  {bmi}
                </Text>
                <Text style={styles.textStatus}>{formatMessage(status)}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
      </ImageBackground>
    </View>
  );
};

export default injectIntl(ResultBmiProgress);
