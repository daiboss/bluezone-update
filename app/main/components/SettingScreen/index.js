import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../Header';
// import { RNAddShortcuts } from 'react-native-add-shortcuts'
import message from '../../../core/msg/setting';
import {injectIntl, intlShape} from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import * as scheduler from '../../../core/notifyScheduler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  FCM_CHANNEL_ID,
  FCM_CHANNEL_DES,
  FCM_CHANNEL_NAME,
} from '../../../const/fcm';
import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';
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
  getResultSteps
} from '../../../core/storage';
import {scheduleTask, stopScheduleTask} from '../StepCountScreen';

const SettingScreen = ({intl, navigation}) => {
  const {formatMessage} = intl;
  const [autoTarget, setAutoTarget] = useState(true);
  const [alertStep, setAlertStep] = useState(false);
  const [alertTarget, setAlertTarget] = useState(false);
  const [alertBmi, setAlertBmi] = useState(false);
  const [totalStep, setTotalStep] = useState(0);
  useEffect(() => {
    getStatus();
  }, []);
  const getStatus = async () => {
    try {
      let result = await getResultSteps()
      setTotalStep(result.step)
      let res = await getAutoChange();
      setAutoTarget(res);
      let res1 = (await getRealtime()) || false;
      setAlertStep(res1);

      let res2 = (await getNotiStep()) || false;
      setAlertTarget(res2);
      let res3 = (await getWeightWarning()) || false;
      setAlertBmi(res3);
    } catch (error) {}
  };
  const onBack = () => {
    try {
      navigation.pop();
    } catch (e) {}
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
      setAlertStep(!alertStep);
      setRealtime(value);
      if (value) {
        await scheduleTask(realtime);
      } else {
        await stopScheduleTask(realtime);
      }
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <Header onBack={onBack} onShowMenu={onShowMenu} title={'Cài đặt'} />
      <View style={styles.viewTx}>
        <Text style={styles.txLabel}>
          {formatMessage(message.autoAdjustTarget)}
        </Text>
        <Switch
          trackColor={{false: '#d8d8d8', true: '#fe435850'}}
          thumbColor={autoTarget ? '#fe4358' : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={autoTargetSwitch}
          value={autoTarget}
        />
      </View>
      <Text style={styles.txContent}>{formatMessage(message.content)}</Text>
      <View style={[styles.viewTx, styles.borderTop, styles.borderBottom]}>
        <Text style={styles.txLabelGray}>
          {formatMessage(message.stepTarget)}
        </Text>
        <Text style={styles.txLabelGray}>{totalStep} bước</Text>
      </View>
      <Text style={styles.txNotification}>Thông báo</Text>
      <View style={[styles.viewTx, styles.borderBottom]}>
        <Text style={styles.txLabel}>Thông báo số bước đi trong ngày</Text>
        <Switch
          trackColor={{false: '#d8d8d8', true: '#fe435850'}}
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
          trackColor={{false: '#d8d8d8', true: '#fe435850'}}
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
          trackColor={{false: '#d8d8d8', true: '#fe435850'}}
          thumbColor={alertBmi ? '#fe4358' : '#a5a5a5'}
          ios_backgroundColor="#fff"
          onValueChange={alertBmiSwitch}
          value={alertBmi}
        />
      </View>
      {/* <TouchableOpacity >
                <Text>
                    Thêm tiện ích
                </Text>
            </TouchableOpacity> */}
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
  txLabelGray: {
    color: '#00000070',
    fontSize: 14,
  },
});
SettingScreen.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SettingScreen);
