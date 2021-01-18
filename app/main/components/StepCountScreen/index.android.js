import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  DeviceEventEmitter,
  Platform,
  ScrollView,
  BackHandler,

} from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import { useFocusEffect } from '@react-navigation/native';

import { isIPhoneX } from '../../../core/utils/isIPhoneX';
import { Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import { LineChart, Grid } from 'react-native-svg-charts'
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import Header from '../../../base/components/Header';
import message from '../../../core/msg/stepCount';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import * as scheduler from '../../../core/notifyScheduler';
import {
  getProfile,
  getResultSteps,
  setResultSteps,
  setEvents,
  getEvents,
  getTimestamp,
  getSteps,
  setAutoChange,
  getAutoChange,
  setStepChange,
  getStepChange,
  getIsShowNotification,
  getNotiStep,
  getWeightWarning,
} from '../../../core/storage';
import ChartLine from './ChartLine';
import ChartLineV from './ChartLineV';
import {
  ResultSteps,
  autoChange,
  realtime,
  notiStep,
  weightWarning,
} from '../../../const/storage';
const screenWidth = Dimensions.get('window').width;

import {
  getAbsoluteMonths,
  getDistances,
  getStepCount,
  getStepsTotal,
  getStepsTotalPromise,
  getTimeDate,
} from '../../../core/calculation_steps';

import BackgroundJob from './../../../core/service_stepcounter'
import {
  addStepCounter,
  getListStepDay,
  removeAllStepDay,
  removeAllStep,
  getListHistory,
  addHistory,
  removeAllHistory
} from './../../../core/db/SqliteDb'

import KKK from './lll'

const options = {
  taskName: 'Bluezone',
  taskTitle: 'Bluezone - Tiện ích sức khoẻ',
  taskDesc: 'Bluezone đếm bước chân',
  taskIcon: {
    name: 'icon_bluezone',
    type: 'mipmap',
  },
  linkingURI: 'mic.bluezone://bluezone/HomeStack/stepCount',
  parameters: {
    delay: 1000,
  },
  targetStep: 10000,
  currentStep: 0,
  isShowStep: true,
  valueTarget: 1021
};

const StepCount = ({ props, intl, navigation }) => {

  useEffect(() => {
    // removeAllStep()
    // removeAllHistory()
    observerStepDrawUI();
    getListHistoryChart();

  }, [])

  const observerStepDrawUI = async () => {
    getResultBindingUI()
    BackgroundJob.observerStep(steps => {
      // console.log('STEP------->>>', steps)
      getResultBindingUI()
    })
  }

  const getListHistoryChart = async () => {
    let start = new moment().subtract(8, 'days').unix()
    let end = new moment().subtract(1, 'days').unix()
    let steps = await getListHistory(start, end)
    let list = steps.map(item => {
      let tmp = JSON.parse(item?.resultStep || {})
      return {
        x: moment.unix(item?.starttime).format('DD/MM'),
        y: tmp?.step || 0,
      }
    });
    // console.log('List hiustory', list, start, end)
    let listTime = []
    list.forEach(e => {
      listTime.push(e?.x)
    });
    setDataChart(list)
    // console.log('listTime', listTime)
    setTime(listTime)
  }

  useEffect(() => {
    saveDataDemo()
  }, [])

  const saveDataDemo = async () => {
    // await removeAllHistory()
    // let tmp = new moment().startOf('years')
    let tmp = new moment('2020-01-01')
    let listHistory = await getListHistory(tmp.unix(), new moment().unix())
    if (listHistory?.length > 10) {
      return
    }
    // save data example
    KKK.forEach(async element => {
      await addHistory(element.starttime, element?.resultStep || {})
    });
  }

  const getResultBindingUI = async () => {
    // let profi = await getProfile()
    // console.log('profiprofiprofi', profi)
    let result = await getDistances();
    let time = result?.time || 0;
    let h = parseInt(time / 3600)
    let m = parseInt((time % 3600) / 60)
    setDistant(result?.distance || 0);
    setCountCarlo(result?.calories || 0);
    setCountTime(m);
    setCountTimeHour(h)
    setCountStep(result?.step || 0);
  }

  useEffect(() => {
    let isRun = BackgroundJob.isRunning();
    if (!isRun) {
      BackgroundJob.start(taskStepCounter, options);
    }
    else {
      BackgroundJob.stop();
    }
  }, [BackgroundJob])

  const taskStepCounter = async () => {
    await new Promise(async () => {
      scheduleLastDay()
      schedule7PM();

      getStepsTotal(async total => {
        let targetSteps = await getResultSteps();
        let isShowStep = await getIsShowNotification()
        // console.log('isShowStepisShowStepisShowStep', isShowStep)
        BackgroundJob.updateNotification({ ...options, currentStep: total || 0, targetStep: targetSteps?.step || 10000, isShowStep: isShowStep })
      })

      BackgroundJob.observerStep(async steps => {
        let targetSteps = await getResultSteps();
        let isShowStep = await getIsShowNotification()

        // console.log('STEP------->>>', steps)

        getStepsTotal(total => {
          // console.log('isShowStepisShowStepisShowStep', parseInt(targetSteps?.step))
          BackgroundJob.updateNotification({
            ...options,
            currentStep: total || 0,
            targetStep: parseInt(targetSteps?.step || 10000),
            isShowStep: isShowStep,
            valueTarget: 123
          })
        })
        if (steps.stepCounter) {
          addStepCounter(steps?.startTime,
            steps?.endTime,
            steps?.stepCounter)
        }
      })
    })
  }

  const schedule7PM = async () => {
    let currentTime = new moment()
    let timePush = new moment(currentTime).set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
    if (timePush.isBefore(currentTime)) {
      timePush.add(1, 'days')
    }
    let timeDiff = timePush.diff(currentTime, 'milliseconds')
    // console.log('timeDifftimeDiff', timeDiff)

    BackgroundJob.setTimeout(() => {
      pushNotificationWarning()
      schedule7PM()
    }, timeDiff)
  }

  const scheduleLastDay = () => {
    let currentTime = new moment()
    let tomorow = new moment(currentTime).add(1, 'days')
    tomorow.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let timeDiff = tomorow.diff(currentTime, 'milliseconds')
    // console.log('timeDifftimeDiff', timeDiff)
    BackgroundJob.setTimeout(async () => {
      await saveHistory();
      scheduleLastDay();
    }, timeDiff)
  }

  const pushNotificationWarning = async () => {
    let tmpStep = await getNotiStep() || true
    if (tmpStep) {
      let totalStep = await getStepsTotalPromise();
      scheduler.createWarnningStepNotification(totalStep || 0)
    }
    let tmpWeight = await getWeightWarning()
    let profiles = (await getProfile()) || [];
    let profile = profiles.find(
      item =>
        getAbsoluteMonths(moment(item.date)) - getAbsoluteMonths(moment()) == 0,
    );
    if (!profile) {
      return
    }
    let tmpTime = new moment.unix(profile?.date)
    if (tmpWeight && (new moment().diff(tmpTime, 'days') >= 7)) {
      scheduler.createWarnningWeightNotification()
    }
  }

  const autoChangeStepsTarget = async () => {
    let auto = await getAutoChange();
    if (auto != undefined && auto == false) {
      return
    }
    let startDay = new moment().subtract(4, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let currentTime = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
    let listHistory = await getListHistory(startDay.unix(), new moment().unix())
    if (listHistory?.length < 2) return

    let stepTarget = await getResultSteps()

    let resultSave = {}

    if (listHistory?.length == 2) {
      let itemLast = listHistory[1]
      let resultTmp = JSON.parse(itemLast?.resultStep)
      if ((resultTmp?.step || 0) < 10000) {
        let newTarget = (itemLast?.step || 0) + 250
        resultSave = {
          step: newTarget,
          date: currentTime
        }
      }
    } else {
      let itemLast = listHistory[listHistory?.length - 1]
      let resultTmp = JSON.parse(itemLast?.resultStep)
      if (resultTmp?.step <= 1000) {
        resultSave = {
          step: 1000,
          date: currentTime
        }
      } else if (resultTmp?.step > stepTarget?.step && (resultTmp?.step - stepTarget?.step) <= 5000) {
        let newTarget = (itemLast?.step || 0) + 250
        resultSave = {
          step: newTarget,
          date: currentTime
        }
      } else {
        if (resultTmp?.step < stepTarget?.step) {
          let tmp = stepTarget?.step - resultTmp?.step
          let newTarget = parseInt(Math.abs(stepTarget?.step - 0.2 * tmp))
          resultSave = {
            step: newTarget,
            date: currentTime
          }
        } else {
          let tmp = resultTmp?.step - stepTarget?.step
          let k = tmp / stepTarget?.step * 100
          if (k >= 50) {
            let newTarget = parseInt(Math.abs(stepTarget?.step + 0.2 * tmp))
            resultSave = {
              step: newTarget,
              date: currentTime
            }
          } else {
            let newTarget = parseInt(Math.abs(stepTarget?.step + 0.1 * tmp))
            resultSave = {
              step: newTarget,
              date: currentTime
            }
          }
        }
      }
    }
    await setResultSteps(resultSave)
    BackgroundJob.updateTypeNotification()
  }

  const saveHistory = async () => {
    // await removeAllHistory()
    let tmp = new moment().subtract(1, 'days')
    let yesterdayStart = tmp.clone().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
    let yesterdayEnd = tmp.clone().set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).unix()
    let listHistory = await getListHistory(yesterdayStart, yesterdayEnd)
    if (listHistory?.length > 0) {
      return
    }
    let result = await getDistances();
    if (Object.keys(result).length <= 0) {
      return;
    }

    await addHistory(yesterdayStart, result)

    await removeAllStep()
    BackgroundJob.updateTypeNotification()

    await autoChangeStepsTarget()
  }

  const { formatMessage } = intl;

  const [time, setTime] = useState([]);
  const [countStep, setCountStep] = useState(null);
  const [countRest, setCountRest] = useState(0);
  const [countCarlo, setCountCarlo] = useState(0);
  const [countTime, setCountTime] = useState(0);
  const [countTimeHour, setCountTimeHour] = useState(0);
  const [distant, setDistant] = useState(0);
  const [totalCount, setTotalCount] = useState(10000);
  const [dataChart, setDataChart] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      resultSteps();
    }, [])
  );

  const resultSteps = async () => {
    try {
      let resultSteps = await getResultSteps(ResultSteps);
      // console.log('resultStepsresultSteps', resultSteps)
      if (!resultSteps) {
        setResultSteps({ step: totalCount, date: new Date().getTime() });
      } else {
        setTotalCount(resultSteps.step);
      }
    } catch (error) { }
  };

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const onBack = () => {
    try {
      if (navigation.canGoBack())
        navigation.pop();
    } catch (e) { }
  };

  const onShowMenu = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <Header
        // onBack={onBack}
        colorIcon={'#FE4358'}
        title={formatMessage(message.title)}
        styleHeader={styles.header}
        styleTitle={{
          color: '#000',
          fontSize: fontSize.bigger,
        }}
        showMenu={true}
        onShowMenu={onShowMenu}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* <View>
                    <Text>Thống kê bước chân</Text>
                </View> */}
        <ImageBackground
          resizeMode={'stretch'}
          source={require('./images/bg_step_count.png')}
          style={styles.viewCircular}>
          <Text style={styles.txToday}>{formatMessage(message.today)}</Text>
          <View style={styles.viewBorderCircular}>
            <AnimatedCircularProgress
              size={180}
              style={styles.circular}
              width={6}
              lineCap="round"
              rotation={0}
              fill={
                ((totalCount -
                  (totalCount - countStep > 0 ? totalCount - countStep : 0)) /
                  totalCount) *
                100
              }
              tintColor="#FE4358"
              backgroundColor="#e5e5e5">
              {fill => (
                <View style={styles.viewFill}>
                  <Image
                    source={require('./images/ic_run.png')}
                    resizeMode={'contain'}
                    style={{
                      width: 30,
                      height: 30
                    }}
                  />
                  <Text style={styles.txCountStep}>{numberWithCommas(countStep || 0)}</Text>
                  <Text style={styles.txCountTarget}>
                    {formatMessage(message.target)} {numberWithCommas(totalCount || 0)}
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        </ImageBackground>
        <View style={styles.dataHealth}>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_step.png')}
            />
            <Text style={styles.txData}>{`${formatMessage(
              message.stepsToTarget,
            )} ${numberWithCommas((totalCount - countStep) > 0 ? (totalCount - countStep) : 0)}`}</Text>
            <Text style={styles.txUnit}>{`${formatMessage(
              message.stepsNormal,
            )}`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_distance.png')}
            />
            <Text style={styles.txData}>{distant.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.txUnit}>{`km`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_calories.png')}
            />
            <Text style={styles.txData}>{countCarlo}</Text>
            <Text style={styles.txUnit}>{`kcal`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_time.png')}
            />
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={styles.txData}>{countTime}</Text>
                <Text style={styles.txUnit}>{formatMessage(message.minute)}</Text>
              </View>
              {
                countTimeHour > 0 && (
                  <View style={{ marginLeft: 4 }}>
                    <Text style={styles.txData}>{countTimeHour}</Text>
                    <Text style={styles.txUnit}>{formatMessage(message.hour)}</Text>
                  </View>
                )
              }

            </View>
          </View>
        </View>
        <View style={styles.viewLineChart}>
          {(dataChart.length && (
            <View>
              <ChartLineV totalCount={totalCount} data={dataChart} time={time} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('stepHistory', {
                    dataHealth: { countStep, countRest, countCarlo, distant },
                  })
                }
                style={{
                  zIndex: 10000,
                  position: 'absolute',
                  width: '100%',
                  height: '100%'
                }}>
              </TouchableOpacity>
            </View>
          )

          ) || null}
        </View>
        {/* <View style={styles.viewHeight} /> */}
      </ScrollView>
      <TouchableOpacity
        style={styles.btnHistory}
        onPress={() =>
          navigation.navigate('stepHistory', {
            dataHealth: { countStep, countRest, countCarlo, distant },
          })
        }>
        <Text style={styles.txHistory}>
          {formatMessage(message.viewHistory)}
        </Text>
      </TouchableOpacity>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  img: {
    width: 64,
    height: 64
  },
  chart: {
    flex: 1,
  },
  viewLineChart: {
    // marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewHeight: {
    height: 50,
  },
  viewImgData: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txData: {
    color: '#fe4358',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  txUnit: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fe4358',
    marginTop: 5,
  },
  dataHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 20,
  },

  viewCircular: {
    paddingBottom: 30,
    marginTop: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  viewBorderCircular: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 200,
  },
  circular: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFill: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txCountStep: {
    color: '#fe4358',
    fontSize: 37,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  txCountTarget: {
    color: '#949494',
    fontSize: 14,
  },
  chart: {
    flex: 1,
    height: 300,
  },
  btnHistory: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: 41,
    backgroundColor: '#fe4358',
    borderRadius: 20,
    marginBottom: 20,
  },
  txHistory: {
    color: '#fff',
    fontSize: 14,
  },
  txToday: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 20,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
});
StepCount.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StepCount);
