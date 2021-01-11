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
import BackgroundFetch from 'react-native-background-fetch';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { map, filter } from 'rxjs/operators';
// import {
//   getAbsoluteMonths,
//   getDistances,
//   getStepCount,
//   getStepsTotal,
//   getTimeDate,
// } from '../../../core/steps';

import {
  getAbsoluteMonths,
  getDistances,
  getStepCount,
  getStepsTotal,
  getTimeDate,
} from '../../../core/calculation_steps';

let count = 0;
var timeout;
var data = [];

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
  isShowStep: true
};

export const scheduleTask = async name => {
  try {
    await BackgroundFetch.scheduleTask({
      taskId: name,
      stopOnTerminate: false,
      enableHeadless: true,
      delay: 5000, // milliseconds (5s)
      forceAlarmManager: true, // more precise timing with AlarmManager vs default JobScheduler
      periodic: true, // Fire once only.
    })
      .then(res => { })
      .catch(err => { });
  } catch (e) { }
};

export const stopScheduleTask = async task => {
  try {
    let res = await BackgroundFetch.stop(task);
  } catch (e) { }
};

export const onBackgroundFetchEvent = async taskId => {
  try {
    let end = new Date();
    let start = new Date();
    end.setDate(end.getDate() + 1);

    let today = moment();
    let resultSteps = await getResultSteps();

    switch (taskId) {
      case autoChange:
        if (resultSteps) {
          let storageDate = moment(resultSteps?.date).format('DD');
          if (storageDate != today.format('DD')) {
            // getStepsTotal();
          }
        }
        break;
      case weightWarning:
        let profiles = (await getProfile()) || [];
        let profile = profiles.find(
          item =>
            getAbsoluteMonths(moment(item.date)) == getAbsoluteMonths(today),
        );

        if (profile) {
          let nextWeek = new Date().getTime();
          let isWarning = parseInt(
            (nextWeek - profile?.date) / (1000 * 3600 * 24),
          );

          if (isWarning >= 7) {
            scheduler.createWarnningWeightNotification();
          }
        }
        break;
      case notiStep:
        if (resultSteps) {
          if (today.format('HH') >= 19) {
            // scheduler.createWarnningStepNotification(step?.step);
          }
        }
        break;
      case realtime:
        // scheduler.createShowStepNotification(step?.step);
        break;
      default:
        break;
    }
    if (taskId === 'react-native-background-fetch') {
      // Test initiating a #scheduleTask when the periodic fetch event is received.
      let auto = await getAutoChange();

      if (auto == undefined || auto == null) {
        await scheduleTask(autoChange);
        setAutoChange(true);
      }
    }
  } catch (e) { }
  // Required: Signal completion of your task to native code
  // If you fail to do this, the OS can terminate your app
  // or assign battery-blame for consuming too tiêuh background-time
  BackgroundFetch.finish(taskId);
};

const StepCount = ({ props, intl, navigation }) => {

  useEffect(() => {
    // removeAllStep()
    // removeAllHistory()
    observerStepDrawUI();
    getListHistoryChart();
  }, [])

  const observerStepDrawUI = () => {
    getResultBindingUI()
    BackgroundJob.observerStep(steps => {
      // console.log('STEP------->>>', steps)
      getResultBindingUI()
    })
  }

  const getListHistoryChart = async () => {
    let start = new moment().subtract(8, 'days').unix()
    let end = new moment().unix()
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
    console.log('listTime', listTime)
    setTime(listTime)
  }

  const getResultBindingUI = async () => {
    let result = await getDistances();
    let time = result?.time || 0;
    let h = parseInt(time / 3600)
    let m = parseInt((time % 3600) / 60)
    let timeString = ''
    if (h > 0) {
      timeString += `${h} - Giờ,\n${m} - Phút`
    } else
      timeString += `${m}\nPhút`
    setDistant(result?.distance || 0);
    setCountCarlo(result?.calories || 0);
    setCountTime(timeString);
    setCountStep(numberWithCommas(result?.step || 0));
  }

  useEffect(() => {
    let isRun = BackgroundJob.isRunning();
    if (!isRun) {
      BackgroundJob.start(taskStepCounter, options);
    } else {
      BackgroundJob.stop();
    }
  }, [BackgroundJob])

  const taskStepCounter = async () => {
    await new Promise(async () => {
      scheduleLastDay()

      getStepsTotal(async total => {
        let targetSteps = await getResultSteps();
        let isShowStep = await getIsShowNotification()
        // console.log('isShowStepisShowStepisShowStep', isShowStep)
        BackgroundJob.updateNotification({ ...options, currentStep: total || 0, targetStep: targetSteps, isShowStep: isShowStep })
      })

      BackgroundJob.observerStep(async steps => {
        let targetSteps = await getResultSteps();
        let isShowStep = await getIsShowNotification()
        // console.log('STEP------->>>', steps)

        getStepsTotal(total => {
          BackgroundJob.updateNotification({ ...options, currentStep: total || 0, targetStep: targetSteps, isShowStep: isShowStep })
        })
        if (steps.stepCounter) {
          addStepCounter(steps?.startTime, steps?.endTime, steps?.stepCounter)
        }
      })
    })
  }

  const scheduleLastDay = () => {
    let currentTime = new moment()
    let tomorow = new moment(currentTime).add(1, 'days')
    tomorow.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let timeDiff = tomorow.diff(currentTime, 'seconds')
    BackgroundJob.setTimeout(() => {
      saveHistory();
      scheduleLastDay();
    }, timeDiff)
  }

  const autoChangeStepsTarget = async () => {
    let auto = await getAutoChange();
    if (!auto) {
      return
    }
    let startDay = new moment().subtract(4).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let listHistory = await getListHistory(startDay.unix(), new moment().unix())
    if (listHistory?.length < 3) {
      return
    }
    startDay = new moment().subtract(1).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    listHistory = await getListHistory(startDay.unix(), new moment().unix())

    let stepTarget = await getResultSteps()
    if (!listHistory || listHistory.length <= 0) {
      return
    }
    let tm = JSON.parse(listHistory[0]?.resultStep)
    let totalSteps = tm?.step || 0
    let tmp = totalSteps / (stepTarget?.step || 10000) * 100;
    let configurationStep = stepTarget?.step || 10000;
    let stepDifferen = Math.abs(totalSteps - (stepTarget?.step || 10000))
    if (tmp >= 150) {
      configurationStep += parseInt(stepDifferen * 0.2)
    } else if (tmp >= 100) {
      configurationStep += parseInt(stepDifferen * 0.1)
    } else {
      configurationStep -= parseInt(stepDifferen * 0.2)
    }
    await setResultSteps({
      step: configurationStep,
      date: new moment().unix()
    })
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


    // save data example
    // KKK.forEach(async element => {
    //   await addHistory(element.starttime, element?.resultStep || {})
    // });
  }

  const { formatMessage } = intl;

  const [time, setTime] = useState([]);
  const [countStep, setCountStep] = useState(null);
  const [countRest, setCountRest] = useState(0);
  const [countCarlo, setCountCarlo] = useState(0);
  const [countTime, setCountTime] = useState(0);
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
        onBack={onBack}
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
                    height={30}
                  />
                  <Text style={styles.txCountStep}>{countStep}</Text>
                  <Text style={styles.txCountTarget}>
                    {formatMessage(message.target)} {totalCount}
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
            )} ${totalCount - countStep > 0 ? totalCount - countStep : 0
              }`}</Text>
            <Text style={styles.txUnit}>{`${formatMessage(
              message.stepsNormal,
            )}`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_distance.png')}
            />
            <Text style={styles.txData}>{distant.toFixed(3)}</Text>
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

            <Text style={styles.txData}>{countTime}</Text>
            {/* <Text style={styles.txUnit}>{formatMessage(message.minute)}</Text> */}
          </View>
        </View>
        <View style={styles.viewLineChart}>
          {(dataChart.length && <ChartLineV totalCount={totalCount} data={dataChart} time={time} />) || null}
          {/* <LineChart style={styles.chart}
                        data={dataChart}
                        style={styles.chart}
                        // data={this.state.data}
                        xAxis={xAxis}
                        highlights={[{ x: 3 }, { x: 6 }]}
                        animation={{
                            durationY: 500,
                        }}
                        chartDescription={{
                            text: '',
                        }}

                        yAxis={{
                            left: {
                                enabled: false,
                            },
                            right: {
                                enabled: false,
                            },
                        }}
                        touchEnabled={true}
                        dragEnabled={true}
                        scaleEnabled={true}
                        syncX={true}
                        scaleXEnabled={true}
                        legend={{
                            enabled: false,
                        }}
                        marker={{
                            enabled: true,
                            markerColor: processColor('#fe4358'),
                            textColor: processColor('#FFF'),
                            markerFontSize: 14,
                        }}
                        scaleYEnabled={true}
                        visibleRange={{ x: { max: 6 } }}
                        dragDecelerationEnabled={false}
                        // ref="chart"
                        onSelect={handleSelect}
                    /> */}
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  img: {},
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
    borderRadius: 6,
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
