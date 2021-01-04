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
} from 'react-native';
import Header from '../Header';
import { RNAddShortcuts } from 'react-native-add-shortcuts'
import message from '../../../core/msg/setting';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import * as scheduler from '../../../core/notifyScheduler';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {
  FCM_CHANNEL_ID,
  FCM_CHANNEL_DES,
  FCM_CHANNEL_NAME,
} from '../../../const/fcm';
import Fitness from '@ovalmoney/react-native-fitness';
import moment, { duration } from 'moment';
import BackgroundFetch, {
  BackgroundFetchStatus,
} from 'react-native-background-fetch';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {
  ResultSteps,
  autoChange,
  realtime,
  notiStep,
  weightWarning,
} from '../../../const/storage';
import {
  getAutoChange,
  setAutoChange,
  getRealtime,
  setRealtime,
  getNotiStep,
  setNotiStep,
  getWeightWarning,
  setWeightWarning,
  getResultSteps,
  setResultSteps
} from '../../../core/storage';
import { scheduleTask, stopScheduleTask } from '../StepCountScreen';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-simple-toast';

import ModalPickerStepsTarget from './../../../base/components/ModalPickerStepsTarget'

import ImgStep from './../StepCountScreen/images/ic_step.png'
import ModalAddShortcut from '../../../base/components/ModalAddShortcut';

Number.prototype.format = function (n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};

const SettingScreen = ({ intl, navigation }) => {
  const { formatMessage } = intl;
  const [autoTarget, setAutoTarget] = useState(true);
  const [alertStep, setAlertStep] = useState(false);
  const [alertTarget, setAlertTarget] = useState(false);
  const [alertBmi, setAlertBmi] = useState(false);
  const [totalStep, setTotalStep] = useState(0);
  const [isShowModalTarget, setIsShowModalTarget] = useState(false)
  const [isShowModalShortcut, setIsShowModalShortcut] = useState(false)

  useEffect(() => {
    getStatus();
  }, []);
  const getStatus = async () => {
    try {
      let result = await getResultSteps()
      console.log('resssss', result)
      setTotalStep(parseInt(result.step))
      let res = await getAutoChange();
      setAutoTarget(res);
      let res1 = (await getRealtime()) || false;
      setAlertStep(res1);

      let res2 = (await getNotiStep()) || false;
      setAlertTarget(res2);
      let res3 = (await getWeightWarning()) || false;
      setAlertBmi(res3);
    } catch (error) { }
  };
  const onBack = () => {
    try {
      navigation.pop();
    } catch (e) { }
  };
  const onShowMenu = () => {
    navigation.openDrawer();
  };
  const autoTargetSwitch = async value => {
    setAutoTarget(!autoTarget);
    setAutoChange(value);
    if (value) {
      await scheduleTask(autoChange);
    } else {
      await stopScheduleTask(autoChange);
    }
  };
  const alertStepSwitch = async value => {
    try {
      PushNotification.requestPermissions()
      setAlertStep(!alertStep);
      setRealtime(value);
      if (value) {
        await scheduleTask(realtime);
      } else {
        await stopScheduleTask(realtime);
      }
    } catch (error) { }
  };
  const alertTargetSwitch = async value => {
    try {
      setAlertTarget(!alertTarget);
      setNotiStep(value);
      if (value) {
        await scheduleTask(notiStep);
      } else {
        await stopScheduleTask(notiStep);
      }
    } catch (error) { }
  };
  const alertBmiSwitch = async value => {
    try {
      setAlertBmi(!alertBmi);
      setWeightWarning(value);
      if (value) {
        await scheduleTask(weightWarning);
      } else {
        await stopScheduleTask(weightWarning);
      }
    } catch (error) { }
  };

  const getListShortcut = () => {
    RNAddShortcuts.GetDynamicShortcuts({
      onDone: shortcuts => {
        console.log('Shortcuts: ' + shortcuts, shortcuts.length);
        if (shortcuts.length > 0) {
          Toast.show('Đã thêm lối tắt vào màn hình chính', Toast.SHORT);
        } else {
          showAlertAddShortcut()
        }
      }
    });
  }

  const openModalTarget = () => setIsShowModalTarget(true)
  const closeModalTarget = () => setIsShowModalTarget(false)

  const saveStepsTarget = (steps) => {
    setTotalStep(steps)
    setResultSteps({ step: steps })
  }

  const showAlertAddShortcut = () => setIsShowModalShortcut(true)
  const closeAlertAddShortcut = () => setIsShowModalShortcut(false)

  const createShortcut = () => {
    RNAddShortcuts.AddDynamicShortcut({
      label: 'Sức khoẻ Bluezone',
      description: 'Sức khoẻ Bluezone',
      icon: ImgStep,
      link: { url: 'mic.bluezone://bluezone/HomeStack/stepCount' },
      onDone: () => {
        closeAlertAddShortcut()
        Toast.show('Đã thêm lối tắt vào màn hình chính', Toast.SHORT);
      },
    });
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <ModalPickerStepsTarget
        intl={intl}
        onSelected={saveStepsTarget}
        onCloseModal={closeModalTarget}
        currentSteps={totalStep}
        isVisibleModal={isShowModalTarget} />

      <ModalAddShortcut
        intl={intl}
        onSelected={createShortcut}
        onCloseModal={closeAlertAddShortcut}
        isVisibleModal={isShowModalShortcut}
      />
      <Header onBack={onBack} onShowMenu={onShowMenu} title={'Cài đặt'} />
      <View style={styles.viewTx}>
        <Text style={styles.txLabel}>
          {formatMessage(message.autoAdjustTarget)}
        </Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={autoTarget ? '#fe4358' : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={autoTargetSwitch}
          value={autoTarget}
        />
      </View>
      <Text style={styles.txContent}>{formatMessage(message.content)}</Text>
      <View style={[styles.viewTx, styles.borderTop, styles.borderBottom]}>
        <Text style={autoTarget ? styles.txTargetGrey : styles.txTarget}>
          {formatMessage(message.stepTarget)}
        </Text>
        <TouchableOpacity
          onPress={openModalTarget}
          disabled={autoTarget}
          activeOpacity={0.8}>
          <Text style={autoTarget ? styles.txLabelGray : styles.txLabelRed}>{totalStep.format()} bước <IconAntDesign name="right" size={14} /></Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.txNotification}>Thông báo</Text>
      <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>Thông báo số bước đi trong ngày</Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={alertStep ? '#fe4358' : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={alertStepSwitch}
          value={alertStep}
        />
      </View>
      <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>
          Thông báo khi chưa hoàn thành mục tiêu
        </Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={alertTarget ? '#fe4358' : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={alertTargetSwitch}
          value={alertTarget}
        />
      </View>
      <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>
          Thông báo cập nhật cân nặng hàng tuần
        </Text>
        <Switch
          trackColor={{ false: '#d8d8d8', true: '#fe435850' }}
          thumbColor={alertBmi ? '#fe4358' : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={alertBmiSwitch}
          value={alertBmi}
        />
      </View>
      {
        Platform.OS == 'android' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={getListShortcut}
            style={[styles.viewTx, styles.borderBottom]}>
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
    fontSize: 15,
    fontWeight: '600',
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
  },
  viewTx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    paddingVertical: 20,
  },
  txContent: {
    marginHorizontal: 20,
    textAlign: 'left',
    fontSize: 14,
    marginTop: -5,
    color: '#00000070',
    marginBottom: 20,
  },
  txNotification: {
    marginHorizontal: 20,
    textAlign: 'left',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
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
    color: '#fe4358',
    fontSize: 14,
  }
});
SettingScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SettingScreen);
