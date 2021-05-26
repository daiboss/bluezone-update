import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { AnimatedCircularProgress } from 'react-native-circular-progress';

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
  setFirstTimeSetup,
  getIsOnOfApp,
  getIsFirstTimeOpenApp,
  setIsFirstTimeOpenApp
} from '../../../core/storage';
import ChartLineV from './ChartLineV';
import {
  ResultSteps,
} from '../../../const/storage';

import {
  getDistances,
  getDistancesWithData
} from '../../../core/calculation_steps';

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import BackgroundJob from './../../../core/service_stepcounter'

import {
  addHistory,
  getListHistory,
  getListStartDateHistory,
  getListStepsBefore,
  removeAllStepDay,
} from './../../../core/db/NativeDB'

import ButtonIconText from '../../../base/components/ButtonIconText';
import { red_bluezone } from '../../../core/color';
import { FS, RFValue } from '../../../const/multiscreen';

import { CalculationStepTargetAndroid } from '../../../core/calculation_step_target';
import ModalChangeTarget from './Components/ModalChangeTarget';
import { StartServiceStepCounter, StopServiceStepCounter } from './TaskStepcounter';
import ModalFirstOpenApp from './Components/ModalFirstOpenApp';

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

  const [isVisiblePermissionHealth, setIsVisiblePermissionHealth] = useState(undefined)
  const [isPermissionGranted, setIsPermissionGranted] = useState(false)

  const [isShowModalAlert, setIsShowModalAlert] = useState(false)

  const openModalAlert7Day = () => setIsShowModalAlert(true)

  const closeModalAlert7Day = () => setIsShowModalAlert(false)

  useEffect(() => {
    checkFirstOpenApp()
    observerStepDrawUI();
    // scheduler.createWarnningWeightNotification()
    syncValueAndChangeTarget();
    return () => {
      BackgroundJob.removeTargetChange();
      BackgroundJob.removeObserverHistoryChange();
    }
  }, [])

  const syncValueAndChangeTarget = async () => {
    await synchronizeDatabaseStepsHistory()
    await autoChangeStepsTarget()
  }

  useFocusEffect(
    React.useCallback(() => {
      // startOrOffApp();
      resultSteps();
      getListHistoryChart();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (isPermissionGranted) {
        startOrOffApp();
      }
    }, [isPermissionGranted])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (isVisiblePermissionHealth == false) {
        checkPermissionStepCounter();
      }
    }, [isVisiblePermissionHealth])
  );

  const checkFirstOpenApp = async () => {
    let isFirst = await getIsFirstTimeOpenApp()

    if (isFirst == undefined || isFirst == true) {
      setIsVisiblePermissionHealth(true)
    } else {
      setIsVisiblePermissionHealth(false)
    }
  }

  const closeModalFirstOpenApp = async () => {
    await setIsFirstTimeOpenApp(false)
    setIsVisiblePermissionHealth(false)
  }

  const checkPermissionStepCounter = async () => {
    check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(status => {
      switch (status) {
        case RESULTS.DENIED: {
          requestPermissionStepCounter()
          break;
        }
        case RESULTS.GRANTED:
        case RESULTS.UNAVAILABLE: {
          setIsPermissionGranted(true)
          break;
        }
      }
    });
  }

  const requestPermissionStepCounter = async () => {
    request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(status => {
      switch (status) {
        case RESULTS.GRANTED: {
          setIsPermissionGranted(true)
          break;
        }
      }
    });
  }

  const autoChangeStepsTarget = async () => {
    try {
      let stepTarget = await getResultSteps()
      let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      let lastUpdateTarget = moment(new Date(stepTarget?.date)).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      console.log('lastUpdateTarget', lastUpdateTarget)
      if (stepTarget != undefined) {
        if (currentTime.toDate().getTime() <= stepTarget?.date ||
          (currentTime.format('DD/MM/YYYY') == lastUpdateTarget.format('DD/MM/YYYY'))) {
          return
        }
      }

      let lastTime = await getFirstTimeSetup()
      let firstTime = new moment.unix(lastTime?.time)
      let tmpDay = new moment().diff(firstTime, 'days')

      if (tmpDay < 2) {
        return
      }

      let auto = await getAutoChange();

      if ((auto != undefined && auto?.value == false) ||
        (auto?.value == true && auto?.time == currentTime.unix())
      ) {
        return
      }

      currentTime = currentTime.toDate().getTime()
      let startDay = lastUpdateTarget
      let listHistory = await getListHistory(startDay.unix() * 1000, new moment().unix() * 1000)
      if (listHistory?.length <= 0) return

      let listData = listHistory.map(element => {
        let resultTmp = JSON.parse(element?.resultStep)
        return (resultTmp?.step || 0)
      })

      let stepTargetNew = CalculationStepTargetAndroid(listData, stepTarget?.step || 10000, tmpDay)
      let resultSave = {
        step: stepTargetNew,
        date: currentTime
      }
      await BackgroundJob.setStepTarget(parseInt(stepTargetNew))
      await setResultSteps(resultSave)
    } catch (err) {
      console.log('setResultSteps error', err)
    }
    try {
      BackgroundJob.sendEmitSaveTargetSuccess()
      BackgroundJob.updateTypeNotification()
    } catch (_) { }
  }

  const observerStepDrawUI = async () => {
    getResultBindingUI();
    BackgroundJob.observerStepSaveChange(() => {
      getResultBindingUI()
    })
    BackgroundJob.observerHistorySaveChange(async () => {
      getListHistoryChart();
      getResultBindingUI();
    })
    BackgroundJob.observerTargetChange(async () => {
      await resultSteps()
    })
  }

  const getListHistoryChart = async () => {
    try {
      let curentTime = moment().unix() * 1000
      let start = curentTime - 86400000 * 8
      let end = curentTime - 86400000
      let steps = await getListHistory(start, end)
      if (steps.length > 7) {
        steps.splice(0, 1)
      }
      let list = steps.map(item => {
        let tmp = JSON.parse(item?.resultStep || {})
        return {
          x: moment(item?.starttime).format('DD/MM'),
          y: tmp?.step || 0,
        }
      });
      let listTime = []
      list.forEach(e => {
        listTime.push(e?.x)
      });
      setDataChart(list)
      setTime(listTime)

      await alert7dayLessThan1000(steps)
    } catch (err) {
      console.log('getListHistoryChart error', err)
    }
  }

  const alert7dayLessThan1000 = async (steps) => {
    if (steps.length >= 7) {
      let check = true
      steps.forEach(element => {
        let tmp = JSON.parse(element?.resultStep)
        if ((tmp?.step || 0) >= 1000) {
          check = false
        }
      });
      if (check) {
        await showNotificationAlert7DayLessThan100()
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

  const synchronizeDatabaseStepsHistory = async () => {
    try {
      let listStepBefore = await getListStepsBefore();

      if (listStepBefore?.length == 0) {
        await saveHistoryEmpty()
        return
      }
      const group = listStepBefore.reduce((acc, current) => {
        const time = moment(current.starttime).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix() * 1000
        if (!acc[time]) {
          acc[time] = [];
        }
        acc[time].push(current);
        return acc;
      }, {})

      for (const [key, value] of Object.entries(group)) {
        let timeMoment = moment(parseInt(key))
        let startTime = timeMoment.startOf('day').unix() * 1000
        let endTime = timeMoment.endOf('day').unix() * 1000

        // Nếu ngày đó trong lịch sử chưa có, sẽ lưu lại giá trị
        let result = await getDistancesWithData(value);
        if (Object.keys(result).length <= 0) {
          return;
        }
        await addHistory(startTime, JSON.stringify(result))

        await removeAllStepDay(startTime, endTime)
      }

      await saveHistoryEmpty()
    } catch (error) {
      console.log('ERROR synchronizeDatabaseStepsHistory', error)
    }
  }

  const saveHistoryEmpty = async () => {
    try {
      let currentTime = moment().startOf('day').unix() * 1000
      // Lọc ra tất cả thời gian trên db
      let listDayStart = await getListStartDateHistory()
      listDayStart = listDayStart.map(t => t.starttime)
      let lastTime = await getFirstTimeSetup()
      if (!lastTime) {
        lastTime = { time: currentTime }
      } else {
        lastTime.time = lastTime.time * 1000
      }
      if (listDayStart.length == 0 && (currentTime - lastTime?.time == 86400000)) {
        listDayStart.push(lastTime?.time - 86400000)
        listDayStart.push(currentTime)
      } else {
        if (!listDayStart.some(t => t == currentTime)) {
          listDayStart.push(currentTime)
        }
      }

      if (listDayStart.length <= 1) {
        BackgroundJob.sendEmitSaveHistorySuccess()
        return
      }
      // Nếu ngày nào chưa có trong db sẽ tự động thêm, nhưng dữ liệu sẽ mặc định là 0 0 0 0
      let tmp = []
      listDayStart.forEach((item, index) => {
        if (index > 0) {
          let kAbstract = item - listDayStart[index - 1]
          if (kAbstract > 86400000) {
            let x = parseInt(kAbstract / 86400000) - 1
            let listFor = Array.from(Array(x).keys())
            listFor.forEach(e => {
              tmp.push(item - (e + 1) * 86400000)
            })
          }
        }
      });

      await Promise.all(tmp.map(async element => {
        await addHistory(element, JSON.stringify({
          step: 0,
          distance: 0.00,
          calories: 0,
          time: 0,
        }))
      }))
      BackgroundJob.sendEmitSaveHistorySuccess()
    } catch (error) {
      console.log('saveHistoryEmpty error', error)
    }
  }

  const startOrOffApp = async () => {
    try {
      let checkOnOff = await BackgroundJob.getIsOpenService()
      if (checkOnOff) {
        StartServiceStepCounter()
      } else {
        StopServiceStepCounter()
      }
    } catch (err) {
      console.log('startOrOffApp error', err)
    }
  }

  const resultSteps = async () => {
    try {
      let resultSteps = await getResultSteps(ResultSteps);
      let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate().getTime()
      if (!resultSteps) {
        setResultSteps({ step: totalCount, date: currentTime });
        await BackgroundJob.setStepTarget(parseInt(totalCount))
      } else {
        setTotalCount(resultSteps.step);
      }
    } catch (error) { }
  };

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const onShowMenu = () => {
    navigation.openDrawer();
  };

  const showNotificationAlert7DayLessThan100 = async () => {
    let old = await getConfirmAlert()
    let oldTime = moment(old, 'DD/MM/YYYY')
    if (!old || (oldTime && moment().diff(oldTime, 'days') >= 7)) {
      openModalAlert7Day()
    }
  }

  const confirmStepsTarget = async (type) => {
    await setConfirmAlert(new moment().format('DD/MM/YYYY'))
    let currentTime = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    if (type == 1) {
      let targetSteps = await getResultSteps();
      let resultSave = {
        step: targetSteps?.step,
        date: currentTime.toDate().getTime()
      }
      await setResultSteps(resultSave)
      closeModalAlert7Day()
    } else {
      let resultSave = {
        step: 10000,
        date: currentTime.toDate().getTime()
      }
      await setFirstTimeSetup()
      await setResultSteps(resultSave)
      await BackgroundJob.setStepTarget(10000)
      await resultSteps()
      closeModalAlert7Day()
    }
  }

  const renderChart = useMemo(() => {
    if (dataChart?.length > 0 && time?.length > 0) {
      return (
        <View>
          <ChartLineV
            totalCount={totalCount}
            data={dataChart}
            time={time}
          />
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
    }
  }, [dataChart, time, totalCount])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <Header
        // onBack={onBack}
        colorIcon={red_bluezone}
        title={formatMessage(message.title)}
        styleHeader={styles.header}
        styleTitle={{
          color: '#000',
          fontSize: fontSize.fontSize17,
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

      <ModalFirstOpenApp
        formatMessage={formatMessage}
        message={message}
        isShowModal={isVisiblePermissionHealth == undefined ? false : isVisiblePermissionHealth}
        closeModal={closeModalFirstOpenApp}
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
            duration={3000}
            lineCap="round"
            rotation={0}
            fill={
              ((totalCount -
                (totalCount - countStep > 0 ? totalCount - countStep : 0)) /
                totalCount) *
              100
            }
            tintColor={red_bluezone}
            backgroundColor="#e5e5e5">
            {fill => (
              <View style={styles.viewFill}>
                <Image
                  source={require('./images/ic_run.png')}
                  resizeMode={'contain'}
                  style={{
                    width: RFValue(24, fontSize.STANDARD_SCREEN_HEIGHT),
                    height: RFValue(32, fontSize.STANDARD_SCREEN_HEIGHT),
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
          {
            renderChart
          }
        </View>

      </View>

      <View style={{ flex: 1 }}>
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
    width: RFValue(56, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(56, fontSize.STANDARD_SCREEN_HEIGHT)
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
    color: red_bluezone,
    fontSize: RFValue(13, fontSize.STANDARD_SCREEN_HEIGHT),
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'OpenSans-Regular'
  },
  txUnit: {
    fontSize: RFValue(13, fontSize.STANDARD_SCREEN_HEIGHT),
    textAlign: 'center',
    color: red_bluezone,
    marginTop: 5,
    fontFamily: 'OpenSans-Regular'
  },
  dataHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: RFValue(28, fontSize.STANDARD_SCREEN_HEIGHT),
    fontFamily: 'OpenSans-Bold'
  },

  viewCircular: {
    paddingBottom: RFValue(30, fontSize.STANDARD_SCREEN_HEIGHT),
    // marginTop: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'center',
    flex: 3,
    height: RFValue(270, fontSize.STANDARD_SCREEN_HEIGHT)
  },
  viewBorderCircular: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 200,
    width: RFValue(192),
    height: RFValue(192),
    justifyContent: 'center',
    alignItems: 'center'
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
    color: red_bluezone,
    fontSize: RFValue(37, fontSize.STANDARD_SCREEN_HEIGHT),
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold'
  },
  txCountTarget: {
    color: '#949494',
    fontSize: FS(11),
    fontFamily: 'OpenSans-Bold'
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
    backgroundColor: red_bluezone,
    borderRadius: 20,
    marginBottom: 20,
  },
  txHistory: {
    color: '#fff',
    fontSize: 14,
  },
  txToday: {
    color: '#fff',
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    marginVertical: RFValue(13, fontSize.STANDARD_SCREEN_HEIGHT),
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold'
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
  colorButtonConfirm: {
    backgroundColor: red_bluezone,
    height: RFValue(46, fontSize.STANDARD_SCREEN_HEIGHT),
    alignSelf: 'center',
    width: RFValue(217, fontSize.STANDARD_SCREEN_HEIGHT),
    borderRadius: 25,
    paddingVertical: 0,
    marginBottom: 10,
    fontFamily: 'OpenSans-Bold'
  }
});

StepCount.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StepCount);
