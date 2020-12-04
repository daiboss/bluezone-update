import React, {useEffect, useState} from 'react';
import * as PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Keyboard,
  Animated,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {injectIntl, intlShape} from 'react-intl';

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import Text from '../../../base/components/Text';
import ButtonText from '../../../base/components/ButtonText';
import ModalBase from '../../../base/components/ModalBase';

// Utils
import configuration, {
  setPhoneNumber,
  syncTokenFirebase,
} from '../../../configuration';
import {blue_bluezone, red_bluezone} from '../../../core/color';
import {createPhoneNumberReminder} from '../../../core/announcement';
import {messageNotifyOTPSuccess} from '../../../core/data';
import message from '../../../core/msg/profile';

// Api
import {CreateAndSendOTPCode, VerifyOTPCode} from '../../../core/apis/bluezone';
import {ConfirmOTPCodeErrorCode} from '../../../core/apis/errorCode';
import {clearScheduleRegisterNotification} from '../../../core/notifyScheduler';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import SelectGender from './components/SelectGender';
import SelectHeightOrWeight from './components/SelectHeightOrWeight';
import {getProfile, setProfile} from '../../../core/storage';
const TIMEOUT_LOADING = 800;
import moment from 'moment';
import {ButtonClose} from '../../../base/components/ButtonText/ButtonModal';
const visibleModal = {
  isProcessing: false,
  isVisibleVerifySuccess: false,
  isVisibleVerifyOTPExpired: false,
  isVisibleVerifyOTPInvalid: false,
  isVisibleVerifyError: false,
};

const ProfileScreen = ({route, intl, navigation}) => {
  const {formatMessage} = intl;
  const [gender, setGender] = useState(0);
  const [heightError, setHeightError] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [isVisibleVerifyError, setisVisibleVerifyError] = useState(false);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const onGoBack = () => navigation.goBack();
  const onSelectGender = gender => setGender(gender);
  const getListProfile = async () => {
    try {
      let profiles = (await getProfile()) || [];
      let profile = profiles.find(
        item => moment(item.date).diff(moment(), 'M') == 0,
      );

      if (profile) {
        setGender(profile.gender);
        setHeight(profile.height);
        setWeight(profile.weight);
      }
    } catch (error) {}
  };
  // useEffect(() => {
  //   getListProfile();
  // }, []);
  const onConfirm = async () => {
    try {
      validateProfile();
      let profiles = (await getProfile()) || [];

      let index = profiles.findIndex(
        profile => moment(profile.date).diff(moment(), 'M') == 0,
      );
      let obj = {
        gender,
        height,
        weight,
        date: new Date().getTime(),
      };
      if (index != -1) {
        profiles.splice(index, 1, obj);
      } else {
        profiles.push(obj);
      }
      setProfile(profiles);
    } catch (error) {
      console.log('error: ', error);
      setisVisibleVerifyError(true);
    }
  };
  const validateProfile = () => {
    if (!height) {
      console.log('height: ', height);
      setHeightError(true);
    }
    if (!weight) {
      setWeightError(true);
    }
    if (!height || !weight) return;
  };
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
          <SelectGender gender={gender} onSelectGender={onSelectGender} />
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

ProfileScreen.propTypes = {
  intl: intlShape.isRequired,
  onFinished: PropTypes.func,
};

ProfileScreen.defaultProps = {
  disabled: true,
};

export default injectIntl(ProfileScreen);
