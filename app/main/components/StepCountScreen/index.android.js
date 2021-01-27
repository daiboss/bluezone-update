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

} from 'react-native';
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
  getResultSteps,
  setResultSteps,
  getAutoChange,
  getIsShowNotification,
  getNotiStep,
  setConfirmAlert,
  getConfirmAlert,
  getFirstTimeSetup,
  setFirstTimeSetup
} from '../../../core/storage';
import ChartLineV from './ChartLineV';
import {
  ResultSteps,
} from '../../../const/storage';
const screenWidth = Dimensions.get('window').width;

import {
  getDistances,
  getStepsTotal,
  getStepsTotalPromise,
} from '../../../core/calculation_steps';

import BackgroundJob from './../../../core/service_stepcounter'
import {
  addStepCounter,
  removeAllStep,
  getListHistory,
  addHistory,
} from './../../../core/db/SqliteDb'

import ButtonIconText from '../../../base/components/ButtonIconText';
import { blue_bluezone, red_bluezone } from '../../../core/color';
import { RFValue } from '../../../const/multiscreen';
import { CommonActions } from '@react-navigation/native';

import { CalculationStepTarget, CalculationStepTargetAndroid } from '../../../core/calculation_step_target';
import ModalChangeTarget from './Components/ModalChangeTarget';

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
    observerStepDrawUI();
    getListHistoryChart();
    scheduler.createWarnningWeightNotification()
  }, [])

  const observerStepDrawUI = async () => {
    getResultBindingUI()
    BackgroundJob.observerStepSaveChange(() => {
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
    let listTime = []
    list.forEach(e => {
      listTime.push(e?.x)
    });
    setDataChart(list)
    setTime(listTime)

    alert7dayLessThan1000(steps)
  }

  const alert7dayLessThan1000 = (steps) => {
    if (steps.length >= 7) {
      let check = true
      steps.forEach(element => {
        let tmp = JSON.parse(element?.resultStep)
        if ((tmp?.step || 0) >= 1000) {
          check = false
        }
      });
      if (check) {
        showNotificationAlert7DayLessThan100()
      }
    }
  }

  const getResultBindingUI = async () => {
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
    // else {
    //   BackgroundJob.stop();
    // }
  }, [BackgroundJob])

  const taskStepCounter = async () => {
    await new Promise(async () => {
      // scheduleLastDay()
      // schedule7PM();
      let isFirst = await getFirstTimeSetup()
      if (isFirst == undefined) {
        await setFirstTimeSetup()
      }

      loopTimeToSchedule()

      getStepsTotal(async total => {
        let targetSteps = await getResultSteps();
        let isShowStep = await getIsShowNotification()
        BackgroundJob.updateNotification({
          ...options,
          currentStep: total || 0,
          targetStep: targetSteps?.step || 10000,
          isShowStep: isShowStep
        })
      })

      BackgroundJob.observerStep(async steps => {
        let targetSteps = await getResultSteps();
        let isShowStep = await getIsShowNotification()

        // console.log('STEP------->>>', steps)

        if (steps.stepCounter) {
          await addStepCounter(steps?.startTime,
            steps?.endTime,
            steps?.stepCounter)
          BackgroundJob.sendEmitSaveSuccess()
        }

        getStepsTotal(total => {
          BackgroundJob.updateNotification({
            ...options,
            currentStep: total || 0,
            targetStep: parseInt(targetSteps?.step || 10000),
            isShowStep: isShowStep,
            valueTarget: 123
          })
        })

      })
    })
  }

  const loopTimeToSchedule = async (oldId) => {
    if (oldId) {
      BackgroundJob.clearTimeout(oldId);
    }
    await switchTimeToSchedule();
    let currentTime = new moment()
    let today7pm = new moment().set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
    let tomorow = new moment(currentTime).add(1, 'days')
    tomorow.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

    let timeDiff = tomorow.diff(currentTime, 'milliseconds')
    let timeDiff7h = 10001
    if (today7pm.isAfter(currentTime)) {
      timeDiff7h = today7pm.diff(currentTime, 'milliseconds')
    }
    let tmpTime = Math.min(timeDiff, timeDiff7h)
    if (tmpTime > 10000) {
      tmpTime = 10000
    }
    const timeoutId = BackgroundJob.setTimeout(() => {
      loopTimeToSchedule(timeoutId);
    }, tmpTime)
  }

  const switchTimeToSchedule = async () => {
    let currentTime = new moment()
    let tmpStart1 = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let tmpEnd1 = new moment().set({ hour: 0, minute: 0, second: 9, millisecond: 59 })
    let tmpStart2 = new moment().set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
    let tmpEnd2 = new moment().set({ hour: 19, minute: 0, second: 9, millisecond: 59 })
    if (currentTime.isAfter(tmpStart1) && currentTime.isBefore(tmpEnd1)) {
      await scheduleLastDay()
    } else if (currentTime.isAfter(tmpStart2) && currentTime.isBefore(tmpEnd2)) {
      await schedule7PM()
    }
  }

  const schedule7PM = async () => {
    await pushNotificationWarning()
  }

  const scheduleLastDay = async () => {
    await saveHistory();
  }

  const pushNotificationWarning = async () => {
    let tmpStep = await getNotiStep() || true
    if (tmpStep) {
      let totalStep = await getStepsTotalPromise();
      scheduler.createWarnningStepNotification(totalStep || 0)
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
    if (listHistory?.length <= 0) return

    let lastTime = await getFirstTimeSetup()
    let firstTime = new moment.unix(lastTime?.time)
    let tmpDay = new moment().diff(firstTime, 'days')

    let stepTarget = await getResultSteps()

    let listData = listHistory.map(element => {
      let resultTmp = JSON.parse(element?.resultStep)
      return (resultTmp?.step || 0)
    })

    let stepTargetNew = CalculationStepTargetAndroid(listData, stepTarget?.step || 10000, tmpDay)
    let resultSave = {
      step: stepTargetNew,
      date: currentTime
    }

    await setResultSteps(resultSave)
    BackgroundJob.updateTypeNotification()
  }

  const saveHistory = async () => {
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

  const { formatMessage, locale } = intl;

  const [time, setTime] = useState([]);
  const [countStep, setCountStep] = useState(null);
  const [countRest, setCountRest] = useState(0);
  const [countCarlo, setCountCarlo] = useState(0);
  const [countTime, setCountTime] = useState(0);
  const [countTimeHour, setCountTimeHour] = useState(0);
  const [distant, setDistant] = useState(0);
  const [totalCount, setTotalCount] = useState(10000);
  const [dataChart, setDataChart] = useState([]);

  const [isShowModalAlert, setIsShowModalAlert] = useState(false)

  const openModalAlert7Day = () => setIsShowModalAlert(true)

  const closeModalAlert7Day = () => setIsShowModalAlert(false)

  useFocusEffect(
    React.useCallback(() => {
      resultSteps();
    }, [])
  );

  const resultSteps = async () => {
    try {
      let resultSteps = await getResultSteps(ResultSteps);
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
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Home' },
            {
              name: 'Welcome',
            },
          ],
        })
      );
    } catch (e) { }
  };

  const onShowMenu = () => {
    navigation.openDrawer();
  };

  const showNotificationAlert7DayLessThan100 = async () => {
    let old = await getConfirmAlert()
    let oldTime = new moment.unix(old?.date)
    if (new moment.diff(oldTime, 'days') >= 7) {
      openModalAlert7Day()
    }
  }

  const confirmStepsTarget = async (type) => {
    await setConfirmAlert(new moment().format('DD/MM/YYYY'))
    let currentTime = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
    if (type == 1) {
      let targetSteps = await getResultSteps();
      let resultSave = {
        step: targetSteps?.step,
        date: currentTime
      }
      await setResultSteps(resultSave)
      closeModalAlert7Day()
    } else {
      let resultSave = {
        step: 10000,
        date: currentTime
      }
      await setResultSteps(resultSave)
      await resultSteps()
      closeModalAlert7Day()
    }
  }

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

      <ModalChangeTarget
        isShowModalAlert={isShowModalAlert}
        closeModalAlert7Day={closeModalAlert7Day}
        confirmStepsTarget={confirmStepsTarget}
        formatMessage={formatMessage}
        message={message}
        numberWithCommas={numberWithCommas}
        totalCount={totalCount}
      />

      <ImageBackground
        resizeMode={'stretch'}
        source={require('./images/bg_step_count.png')}
        style={styles.viewCircular}>
        <Text style={styles.txToday}>{formatMessage(message.today)}</Text>
        <View style={styles.viewBorderCircular}>
          <AnimatedCircularProgress
            size={RFValue(170)}
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
                    width: RFValue(26),
                    height: RFValue(26)
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
      <View style={{ flex: 4 }}>
        <View style={styles.dataHealth}>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_step.png')}
            />
            {locale != 'en' ? <View>
              <Text style={styles.txData}>{`${formatMessage(
                message.stepsToTarget,
              )} ${numberWithCommas((totalCount - countStep) > 0 ? (totalCount - countStep) : 0)}`}</Text>
              <Text style={styles.txUnit}>{`${formatMessage(
                message.stepsNormal,
              )}`}</Text>
            </View> : <View>
                <Text style={styles.txData}>{numberWithCommas((totalCount - countStep) > 0 ? (totalCount - countStep) : 0)} <Text style={[styles.txUnit, { marginTop: 10, fontWeight: '400' }]}>steps</Text> </Text>
                <Text style={styles.txUnit}>to target</Text>
              </View>}


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
            <Text style={styles.txData}>{numberWithCommas(parseInt(countCarlo || 0))}</Text>
            <Text style={styles.txUnit}>{`kcal`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_time.png')}
            />
            <View style={{ flexDirection: 'row' }}>

              {
                countTimeHour > 0 ? (
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={[styles.txData, {
                        marginRight: 4,
                        marginTop: 10
                      }]}>{countTimeHour}</Text>
                      <Text style={[styles.txUnit, { marginTop: 10 }]}>{formatMessage(message.hour)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={[styles.txData, {
                        marginRight: 5,
                        marginTop: 5
                      }]}>{countTime}</Text>
                      <Text style={[styles.txUnit, { marginTop: 5 }]}>{countTime <= 1 ? formatMessage(message.minute) : formatMessage(message.minutes)}</Text>
                    </View>
                  </View>
                ) : (
                    <View>
                      <Text style={styles.txData}>{countTime}</Text>
                      <Text style={styles.txUnit}>{countTime <= 1 ? formatMessage(message.minute) : formatMessage(message.minutes)}</Text>
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
                    dataHealth: {
                      countStep, countRest: (totalCount - countStep) > 0 ? (totalCount - countStep) : 0
                      , countCarlo, distant
                    },
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

      </View>


      <TouchableOpacity
        style={{
          justifyContent: 'center',
          marginBottom: 10,
          alignSelf: 'center'
        }}
        onPress={() => {
          navigation.navigate('DemoTarget')
        }}>
        <Text style={{

        }}>Tính mục tiêu</Text>
      </TouchableOpacity>

      <View style={{ flex: 0.7 }}>

        <ButtonIconText
          onPress={() =>
            navigation.navigate('stepHistory', {
              dataHealth: { countStep, countRest, countCarlo, distant },
            })
          }
          text={formatMessage(message.viewHistory)}
          styleBtn={[styles.colorButtonConfirm]}
          styleText={{ fontSize: fontSize.normal, fontWeight: 'bold' }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  img: {
    width: RFValue(56),
    height: RFValue(56)
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
    // marginTop: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'center',
    flex: 3
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
    marginVertical: RFValue(14),
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
  colorButtonConfirm: {
    backgroundColor: red_bluezone,
    height: 46,
    alignSelf: 'center',
    width: '60%',
    borderRadius: 25,
    paddingVertical: 0,
    marginBottom: 10
  }
});
StepCount.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StepCount);
