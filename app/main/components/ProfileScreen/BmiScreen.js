import React, {useEffect, useState} from 'react';
import * as PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Keyboard,
  Animated,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {injectIntl, intlShape} from 'react-intl';

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import ModalBase from '../../../base/components/ModalBase';

import {blue_bluezone, red_bluezone} from '../../../core/color';
import message from '../../../core/msg/bmi';
import FastImage from 'react-native-fast-image';
// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import SelectGender from './components/SelectGender';
import SelectHeightOrWeight from './components/SelectHeightOrWeight';
import {getProfile, setProfile} from '../../../core/storage';
const TIMEOUT_LOADING = 800;
import moment from 'moment';
import {ButtonClose} from '../../../base/components/ButtonText/ButtonModal';
import ResultBMI from './components/ResultBMI';
const visibleModal = {
  isProcessing: false,
  isVisibleVerifySuccess: false,
  isVisibleVerifyOTPExpired: false,
  isVisibleVerifyOTPInvalid: false,
  isVisibleVerifyError: false,
};

const BmiScreen = ({route, intl, navigation}) => {
  const {formatMessage} = intl;
  const [heightError, setHeightError] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [isVisibleVerifyError, setisVisibleVerifyError] = useState(false);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const onGoBack = () => navigation.goBack();
  const onConfirm = async () => {
    try {
      if (!height) {
        setHeightError(true);
      }
      if (!weight) {
        setWeightError(true);
      }
      if (!height || !weight) return;
      navigation.navigate('resultBmi', {
        height,
        weight,
      });
    } catch (error) {
      setisVisibleVerifyError(true);
    }
  };
  const validateProfile = () => {};
  const onCloseModalProfile = () => setisVisibleVerifyError(false);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBack={onGoBack}
        title={formatMessage(message.title)}
        styleHeader={styles.header}
        styleTitle={{
          color: blue_bluezone,
          fontSize: fontSize.bigger,
        }}
      />
      <View style={styles.group}>
        <View>
          <View style={[styles.container2]}>
            <View style={[styles.container3]}>
              <FastImage
                source={require('./styles/images/ic_info.png')}
                style={[styles.iconInfo]}
              />
              <Text style={styles.textLabel}>
                {formatMessage(message.content)}
              </Text>
            </View>
          </View>
          <SelectHeightOrWeight
            label={formatMessage(message.height)}
            value={height ? height : 'cm'}
            type="height"
            error={heightError ? formatMessage(message.heightError2) : null}
            onSelected={height => {
              setHeightError(false);
              setHeight(height);
            }}
          />
          <SelectHeightOrWeight
            label={formatMessage(message.weight)}
            value={weight ? weight : 'kg'}
            error={weightError ? formatMessage(message.weightError2) : null}
            type="weight"
            onSelected={weight => {
              setWeightError(false);
              setWeight(weight);
            }}
          />
        </View>
        <View style={styles.buttonConfirm}>
          <ButtonIconText
            onPress={onConfirm}
            text={formatMessage(message.finish)}
            styleBtn={[styles.colorButtonConfirm]}
            styleText={{fontSize: fontSize.normal}}
          />
        </View>
      </View>
      <ModalBase
        isVisibleModal={isVisibleVerifyError}
        title={formatMessage(message.titleSendError)}
        description={formatMessage(message.sendError)}>
        <View style={styles.modalFooter}>
          <ButtonClose
            text={formatMessage(message.close)}
            onPress={onCloseModalProfile}
          />
        </View>
      </ModalBase>
    </SafeAreaView>
  );
};

BmiScreen.propTypes = {
  intl: intlShape.isRequired,
  onFinished: PropTypes.func,
};

BmiScreen.defaultProps = {
  disabled: true,
};

export default injectIntl(BmiScreen);
