import React, { useEffect, useMemo, useState ,memo} from 'react';
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
import { injectIntl, intlShape } from 'react-intl';

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import ModalBase from '../../../base/components/ModalBase';

import { blue_bluezone, red_bluezone } from '../../../core/color';
import message from '../../../core/msg/profile';

// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import SelectGender from './components/SelectGender';
import SelectHeightOrWeight from './components/SelectHeightOrWeight';
import { getProfile, setProfile, getWeightWarning } from '../../../core/storage';
const TIMEOUT_LOADING = 800;
import moment from 'moment';
import { ButtonClose } from '../../../base/components/ButtonText/ButtonModal';
import * as scheduler from '../../../core/notifyScheduler';
import ResultBMI from './components/ResultBMI';
import PushNotification from 'react-native-push-notification';
import { CommonActions } from '@react-navigation/native';

const visibleModal = {
  isProcessing: false,
  isVisibleVerifySuccess: false,
  isVisibleVerifyOTPExpired: false,
  isVisibleVerifyOTPInvalid: false,
  isVisibleVerifyError: false,
};

const ProfileScreen = ({ route, intl, navigation }) => {
  const { formatMessage } = intl;
  const [gender, setGender] = useState(1);
  const [listProfile, setListProfile] = useState([]);
  const [listTime, setListTime] = useState([]);

  const [isAutoOpen, setIsAutoOpen] = useState(route?.params?.isAutoOpen || false)

  const [heightError, setHeightError] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [isVisibleVerifyError, setisVisibleVerifyError] = useState(false);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [timeWeight, setTimeWeight] = useState(0)
  const onGoBack = () => navigation.goBack();
  const onSelectGender = gender => setGender(gender);
  const getProfileList = async profiles => {
    let data = profiles
      .sort((a, b) => b.date - a.date)
      .reduce((r, a) => {
        r['values'] = r['values'] || [];
        r['values'].unshift({
          y: Number(
            a?.weight?.replace('kg', '')?.replace(',', '.')?.replace(' ', '') || 0,
          ),
          marker: a.weight,
          year: moment(a.date).format('YYYY'),
        });
        return r;
      }, Object.create(null));

    if (profiles?.length) {
      let time = profiles
        .sort((a, b) => a.date - b.date)
        .map(e => moment(e.date)?.format('DD/MM'));
      setListTime(time);
      setListProfile([data]);
    } else {
      // setListTime([]);
      // setListProfile([]);
    }
  };

  const getListProfile = async () => {
    try {
      let profiles = (await getProfile()) || [];
      getProfileList(profiles);
      let profile = profiles.find(
        item =>
          getAbsoluteMonths(moment(item.date)) == getAbsoluteMonths(moment())
      );
      if (profile == undefined && profiles.length > 0) {
        profile = profiles[profiles.length - 1]
      }
      if (profile) {
        setGender(profile.gender);
        setHeight(profile.height);
        setWeight(profile.weight);
      }
    } catch (error) { }
  };
  useEffect(() => {
    // setGender(1);
    getListProfile();
  }, []);
  // useEffect(() => {
  //   updateData();
  // }, [weight]);
  function getAbsoluteMonths(momentDate) {
    var days = String(momentDate.format('DD'))
    var months = String(momentDate.format('MM'));
    var years = String(momentDate.format('YYYY'));
    return days + months + years ;
  }
  const onConfirm = async () => {
    try {
      await PushNotification.cancelAllLocalNotifications()
      if (!height) {
        setHeightError(true);
      }
      if (!weight) {
        setWeightError(true);
      }
      if (!height || !weight) return;
      let profiles = (await getProfile()) || [];
      let getWeighiNoti = await getWeightWarning()
      let index = profiles.findIndex(
        profile => getAbsoluteMonths(moment(profile.date)) == getAbsoluteMonths(moment())
      );

      let obj = {
        gender,
        height,
        weight,
        date: moment()
          .toDate()
          .getTime(),
      };
      getWeighiNoti && scheduler.createScheduleWarnningWeightNotification(obj.date)
      if (index != -1) {
        profiles.splice(index, 1, obj);
      } else {
        profiles.push(obj);
      }
      setProfile(profiles);
      navigation.navigate('stepCount');
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 1,
      //     routes: [
      //       { name: 'stepCount' },
      //     ],
      //   })
      // );
    } catch (error) {
      setisVisibleVerifyError(true);
    }
  };
  const onCloseModalProfile = () => setisVisibleVerifyError(false);
  const onSelectWeight = async weight => {
    try {
      setWeightError(false);
      setWeight(weight);
      let profiles = (await getProfile()) || [];

      let index = profiles.findIndex(
        profile => 
          // console.log('getAbsoluteMonths(moment(profile.date)) == getAbsoluteMonths(moment())',getAbsoluteMonths(moment(profile.date)) == getAbsoluteMonths(moment()))
         getAbsoluteMonths(moment(profile.date)) == getAbsoluteMonths(moment())
        // }
      );
      let obj = {
        weight,
        date: moment()
          .toDate()
          .getTime(),
      };
      if (index != -1) {
        profiles.splice(index, 1, obj);
      } else {
        profiles.push(obj);
      }
      getProfileList(profiles);
    } catch (error) { }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        // onBack={onGoBack}
        colorIcon={'#FE4358'}
        title={formatMessage(message.title)}
        styleHeader={styles.header}
        styleTitle={{
          color: '#000',
          fontSize: fontSize.bigger,
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.group}>
          <View>
            <SelectGender gender={gender} onSelectGender={onSelectGender} />
            <SelectHeightOrWeight
              label={formatMessage(message.height)}
              value={height ? height : 'cm'}
              gender={gender}
              type="height"
              currentHeight={height}
              error={heightError ? formatMessage(message.heightError2) : null}
              onSelected={height => {
                setHeightError(false);
                setHeight(height);
              }}
            />
            <SelectHeightOrWeight
              visiWeight={isAutoOpen}
              label={formatMessage(message.weight)}
              value={weight ? weight : 'kg'}
              error={weightError ? formatMessage(message.weightError2) : null}
              type="weight"
              currentWeight={weight}
              gender={gender}
              listProfile={listProfile}
              time={listTime}
              onSelected={onSelectWeight}
            />
            {height && weight ? (
              <ResultBMI height={height} weight={weight} />
            ) : null}
          </View>
          <View style={styles.buttonConfirm}>
            <ButtonIconText
              onPress={onConfirm}
              text={formatMessage(message.finish)}
              styleBtn={[styles.colorButtonConfirm]}
              styleText={{ fontSize: fontSize.normal, fontWeight: 'bold' }}
            />
          </View>
        </View>
      </ScrollView>
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

export default injectIntl(memo(ProfileScreen));
