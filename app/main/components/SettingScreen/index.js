import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
// import Header from '../Header';
import Header from '../../../base/components/Header';
import { isIPhoneX } from '../../../core/utils/isIPhoneX';

// import { RNAddShortcuts } from 'react-native-add-shortcuts'
import message from '../../../core/msg/setting';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
// import * as scheduler from '../../../core/notifyScheduler';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import moment from 'moment';

import {
  getAutoChange,
  setAutoChange,
  getRealtime,
  setRealtime,
  getNotiStep,
  setNotiStep,
  getWeightWarning,
  getProfile,
  setWeightWarning,
  getResultSteps,
  setResultSteps,
  getIsShowNotification,
  setIsShowNotification,
  setIsOnOfApp,
  getIsOnOfApp
} from '../../../core/storage';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-simple-toast';

import ModalPickerStepsTarget from './../../../base/components/ModalPickerStepsTarget'

import ImgHealth from './../StepCountScreen/images/ic_health.png'
import ModalAddShortcut from '../../../base/components/ModalAddShortcut';
import MyShortcut from './CreateShortcut'
import * as scheduler from '../../../core/notifyScheduler';
import BackgroundJob from './../../../core/service_stepcounter'
import { red_bluezone } from '../../../core/color';
import { RFValue } from '../../../const/multiscreen';

Number.prototype.format = function (n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};

const SettingScreen = ({ intl, navigation }) => {

  const { formatMessage } = intl;
  const [autoTarget, setAutoTarget] = useState(undefined);
  const [alertStep, setAlertStep] = useState(undefined);
  const [alertTarget, setAlertTarget] = useState(false);
  const [alertBmi, setAlertBmi] = useState(false);
  const [onOffApp, setOnOffApp] = useState(true)
  const [totalStep, setTotalStep] = useState(0);
  const [timeWeight, setTimeWeight] = useState(0)
  const [isShowModalTarget, setIsShowModalTarget] = useState(false)
  const [isShowModalShortcut, setIsShowModalShortcut] = useState(false)
  const [isSupportShortcut, setIsSupportShortcut] = useState(true)

  useEffect(() => {
    getIsOnOffAppFromStorage()
  }, [])

  useEffect(() => {
    if (Platform.OS == 'android') {
      MyShortcut.CheckSupportShortcut((t) => {
        setIsSupportShortcut(t)
      })
    }
  }, [])

  const getIsOnOffAppFromStorage = async () => {
    try {
      let res = await getIsOnOfApp()
      if (res == undefined) {
        res = true
      }
      setOnOffApp(res)
    } catch (error) {
      console.log('getIsOnOffAppFromStorage error', error)
    }
  }

  useEffect(() => {
    getStatus();
    getProfileUser()
    // scheduler.createScheduleWarnningWeightNotification(alertStep)
  }, [timeWeight]);
  useEffect(() => {
    alertBmi ? scheduler.createScheduleWarnningWeightNotification(timeWeight) : PushNotification.cancelAllLocalNotifications()
  }, [alertBmi])

  useEffect(() => {
    if (onOffApp == false) {
      PushNotification.cancelAllLocalNotifications()
    } else {
      if (alertBmi)
        scheduler.createScheduleWarnningWeightNotification(timeWeight)
    }
  }, [onOffApp])

  const getProfileUser = async () => {
    let profiles = (await getProfile()) || [];
    const time = profiles?.[profiles.length - 1]?.date
    setTimeWeight(time)
  }
  
  const alertPermission = (type) => {
    if (type == 'step') setAlertStep(!alertStep)
    if (type == 'target') setAlertTarget(!alertTarget);
    if (type == 'bmi') setAlertBmi(!alertBmi);
    Alert.alert(`"Bluezone" muốn gửi thông báo cho bạn`, 'Thông báo có thể bao gồm cảnh báo, âm thanh và biểu tượng. Bạn có thể định cấu hình chúng trong Cài đặt', [
      {
        text: "Từ chối",
        onPress: () => {
          if (type == 'step') setAlertStep(false)
          if (type == 'target') setAlertTarget(false);
          if (type == 'bmi') setAlertBmi(false);
        },
        style: "cancel"
      },
      { text: "Cho phép", onPress: () => Linking.openURL('app-settings:{3}') }
    ])
  }

  const getStatus = async () => {
    try {
      let result = await getResultSteps()
      setTotalStep(parseInt(result.step))
      let res = await getAutoChange();
      if (res == undefined) {
        res = { value: true, time: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix() };
      }
      setAutoTarget(res?.value == undefined ? true : res.value);
      let res1 = (await getIsShowNotification());
      setAlertStep(res1 || false);

      let res2 = (await getNotiStep()) || false;
      setAlertTarget(res2);
      let res3 = (await getWeightWarning()) || false;
      setAlertBmi(res3);
    } catch (error) { }
  };

  const onShowMenu = () => {
    navigation.openDrawer();
  };

  const autoTargetSwitch = async value => {
    setAutoTarget(!autoTarget);
  };

  useEffect(() => {
    if (autoTarget != undefined) {
      setAutoChange({ value: autoTarget, time: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix() });
    }
  }, [autoTarget])

  const alertStepSwitch = async value => {
    if (Platform.OS == 'android') {
      await setAlertStep(value);
    } else
      try {
        PushNotification.requestPermissions().then(res => {
          if (res.notificationCenter) {
            setAlertStep(!alertStep);
          }
          else {
            alertPermission('step')
          }
        }).catch(er => console.log('er: ', er))
        setRealtime(value);

      } catch (error) { }
  };

  const alertTargetSwitch = async value => {
    if (Platform.OS == 'android') {
      await setAlertTarget(value);
      await setNotiStep(value)
    } else
      try {
        PushNotification.requestPermissions().then(res => {
          if (res.notificationCenter) {
            setAlertTarget(!alertTarget);
          }
          else {
            alertPermission('target')
          }
        }).catch(er => console.log('errerjeirjeijre', er))
        setNotiStep(value);

      } catch (error) { }
  };

  const alertBmiSwitch = async value => {
    if (Platform.OS == 'android') {
      await setAlertBmi(value);
      await setWeightWarning(value);
    } else
      try {
        PushNotification.requestPermissions().then(res => {
          if (res.notificationCenter) {
            setAlertBmi(!alertBmi);
          }
          else {
            alertPermission('bmi')
          }
        }).catch(er => console.log('errerjeirjeijre', er))
        setWeightWarning(value);

      } catch (error) { }
  };

  useEffect(() => {
    saveStepAlert()
  }, [alertStep])

  const saveStepAlert = async () => {
    if (alertStep == undefined) {
      return;
    }
    if (alertStep) {
      await setIsShowNotification(true);
    } else {
      await setIsShowNotification(false)
    }
    // if (Platform.OS == 'android')
    //   BackgroundJob.updateTypeNotification()
    try {
      if (Platform.OS == 'android')
        BackgroundJob.updateTypeNotification()
    } catch (_) { }
  }

  const getListShortcut = () => {
    MyShortcut.GetAllShortcut({
      onDone: shortcuts => {
        if (shortcuts.toString().length > 2) {
          Toast.show('Đã thêm lối tắt vào màn hình chính', Toast.SHORT);
        } else {
          showAlertAddShortcut()
        }
      },
      onCancel: e => {
        console.log('shortcutsshortcuts error', e)
      }
    });
  }

  const openModalTarget = () => setIsShowModalTarget(true)
  const closeModalTarget = () => setIsShowModalTarget(false)

  const saveStepsTarget = async (steps) => {
    setTotalStep(steps)
    let currentTime = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate().getTime()
    await setResultSteps({ step: steps, date: currentTime })
    if (Platform.OS == 'android') {
      try {
        BackgroundJob.updateTypeNotification()
      } catch (_) { }
    }
  }

  const showAlertAddShortcut = () => setIsShowModalShortcut(true)

  const closeAlertAddShortcut = () => setIsShowModalShortcut(false)

  const createShortcut = () => {
    MyShortcut.AddPinnedShortcut({
      label: 'Sức khoẻ Bluezone',
      description: 'Sức khoẻ Bluezone',
      icon: ImgHealth,
      link: { url: 'mic.bluezone://bluezone/HomeStack/stepCount' },
      onDone: () => {
        closeAlertAddShortcut()
        Toast.show('Đã thêm lối tắt vào màn hình chính', Toast.SHORT);
      },
    });
  }

  const actionOnOffApp = async (value) => {
    try {
      setIsOnOfApp(value)
      setOnOffApp(value)
      navigation.goBack()
    } catch (err) {
      console.log('actionOnOffApp error', error)
    }
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <ModalPickerStepsTarget
        intl={intl}
        onSelected={saveStepsTarget}
        onCloseModal={closeModalTarget}
        currentSteps={10000}
        isVisibleModal={isShowModalTarget} />

      <ModalAddShortcut
        intl={intl}
        onSelected={createShortcut}
        onCloseModal={closeAlertAddShortcut}
        isVisibleModal={isShowModalShortcut}
      />
      <Header
        // onBack={onBack}
        onShowMenu={onShowMenu}
        title={formatMessage(message.title)}
        colorIcon={red_bluezone}
        styleHeader={styles.header}
        styleTitle={{
          color: '#000',
          fontSize: fontSize.fontSize17,
        }}
        // showMenu={true}
        onShowMenu={onShowMenu}
      />
      <View style={styles.viewTx}>
        <Text style={[styles.txLabel, { fontWeight: '700' }]}>
          {formatMessage(message.autoAdjustTarget)}
        </Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={autoTarget ? red_bluezone : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={autoTargetSwitch}
          value={autoTarget || false}
        />
      </View>
      <Text style={styles.txContent}>{formatMessage(message.content)}</Text>
      <TouchableOpacity
        onPress={openModalTarget}
        disabled={autoTarget}
        activeOpacity={0.5}
        style={[styles.viewTx, styles.borderTop, styles.borderBottom]}>
        <Text style={autoTarget ? styles.txTargetGrey : styles.txTarget}>
          {formatMessage(message.stepTarget)}
        </Text>
        <View>
          <Text style={autoTarget ? styles.txLabelGray : styles.txLabelRed}>
            {autoTarget ? '10.000' : totalStep.format()} {formatMessage(message.steps)} <IconAntDesign name="right" size={14} />
          </Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.txNotification}>{formatMessage(message.Notification)}</Text>
      <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>{formatMessage(message.OnOffApp)}</Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={onOffApp ? red_bluezone : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={actionOnOffApp}
          value={onOffApp}
        />
      </View>
      {Platform.OS == 'android' && <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>{formatMessage(message.NotificationRealtime)}</Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={alertStep ? red_bluezone : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={alertStepSwitch}
          value={alertStep || false}
        />
      </View>}
      {Platform.OS == 'android' && <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>{formatMessage(message.NotificationTarget)}</Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={alertTarget ? red_bluezone : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={alertTargetSwitch}
          value={alertTarget}
        />
      </View>}
      <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>{formatMessage(message.NotificationWeight)}</Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={alertBmi ? red_bluezone : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={alertBmiSwitch}
          value={alertBmi}
        />
      </View>

      {
        Platform.OS == 'android' && isSupportShortcut && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={getListShortcut}
            style={[styles.viewTx
              // , styles.borderBottom
            ]}>
            <Text
              style={styles.txLabel}>
              {formatMessage(message.AddShortcut)}
            </Text>
          </TouchableOpacity>
        )
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  txLabel: {
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    // fontWeight: '600',
    fontFamily: 'OpenSans-Bold',
    color: '#000',
    width: '70%',
  },
  borderTop: {
    borderTopColor: '#00000020',
    borderTopWidth: 1,
  },
  borderBottom: {
    borderBottomColor: '#00000020',
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  viewTx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 0,
    paddingVertical: RFValue(20, fontSize.STANDARD_SCREEN_HEIGHT),

  },
  txContent: {
    marginHorizontal: 20,
    textAlign: 'left',
    fontSize: RFValue(13, fontSize.STANDARD_SCREEN_HEIGHT),
    marginTop: RFValue(-15),
    fontFamily: 'OpenSans-Regular',
    color: '#00000070',
    paddingBottom: RFValue(25),
  },
  txNotification: {
    marginHorizontal: 20,
    textAlign: 'left',
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    fontWeight: 'bold',
    marginTop: RFValue(20, fontSize.STANDARD_SCREEN_HEIGHT),
    color: '#000000',
  },
  txTarget: {
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  txTargetGrey: {
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00000070',
  },
  txLabelGray: {
    color: '#00000070',
    fontSize: 14,
  },
  txLabelRed: {
    color: red_bluezone,
    fontFamily: 'OpenSans-Bold',
    fontSize: RFValue(15),
  },
  header: {
    // backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
});

SettingScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SettingScreen);
