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
  NativeAppEventEmitter,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Fitness from '@ovalmoney/react-native-fitness';
import AppleHealthKit from 'rn-apple-healthkit';
import { isIPhoneX } from '../../../core/utils/isIPhoneX';
import { Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ButtonIconText from '../../../base/components/ButtonIconText';
import { blue_bluezone, red_bluezone } from '../../../core/color';

import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import Header from '../../../base/components/Header';
import { RFValue } from '../../../const/multiscreen';
import message from '../../../core/msg/stepCount';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import * as scheduler from '../../../core/notifyScheduler';
import {
  getProfile,
  getResultSteps,
  setResultSteps,
  getFirstTimeOpen,
  getSteps,
  getStepsTotal,
  setAutoChange,
  getConfirmAlert,
  getAutoChange,
  setConfirmAlert
} from '../../../core/storage';
import { CalculationStepTarget } from '../../../core/calculation_step_target';
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
import { getAbsoluteMonths } from '../../../core/steps';
import ModalChangeTarget from './Components/ModalChangeTarget';
const PERMS = AppleHealthKit.Constants.Permissions;
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
    let step = await getSteps(start, end);

    let today = moment();
    let resultSteps = await getResultSteps();

    switch (taskId) {
      case autoChange:
        if (resultSteps) {
          let storageDate = moment(resultSteps?.date).format('DD');
          if (storageDate != today.format('DD')) {
            getStepsTotal(start, end);
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
            scheduler.createWarnningStepNotification(step?.step);
          }
        }
        break;
      case realtime:
        scheduler.createShowStepNotification(step?.step);
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
  BackgroundFetch.finish(taskId);

}

// Required: Signal completion of your task to native code
// If you fail to do this, the OS can terminate your app
// or assign battery-blame for consuming too much background-time
const StepCount = ({ props, intl, navigation }) => {
  const timeInterval = useRef();
  let sex
  const { formatMessage, locale } = intl;
  const [time, setTime] = useState([]);
  const [heightUser, setHeightUser] = useState(0)
  const [countTimeHour, setCountTimeHour] = useState(0);
  const [weightUser, setWeightUser] = useState(0)
  const [weightHeight, setWeightHeight] = useState({ weight: 65, height: 165 })
  const [countTime, setCountTime] = useState(0)
  const [countStep, setCountStep] = useState(null);
  const [countRest, setCountRest] = useState(0);
  const [countCarlo, setCountCarlo] = useState(0);
  const [distant, setDistant] = useState(0);
  const [totalCount, setTotalCount] = useState(10000);
  const permissions = [
    {
      kind: Fitness.PermissionKinds.Steps,
      access: Fitness.PermissionAccesses.Read,
    },
    {
      kind: Fitness.PermissionKinds.Calories,
      access: Fitness.PermissionAccesses.Read,
    },
    {
      kind: Fitness.PermissionKinds.Distances,
      access: Fitness.PermissionAccesses.Read,
    },
  ];
  const [dataChart, setDataChart] = useState([]);

  const [isShowModalAlert, setIsShowModalAlert] = useState(false)

  const openModalAlert7Day = () => setIsShowModalAlert(true)

  const closeModalAlert7Day = () => setIsShowModalAlert(false)

  useEffect(() => {
    var end = new Date();
    end.setDate(end.getDate() + 1);
    var start = new Date();
    var startLine = new Date();
    startLine.setDate(new Date().getDate() - 7);
    var endLine = new Date();
    endLine.setDate(new Date().getDate() - 1);
    // let listDate = getListDate(start, end)
    resultSteps();

    getPermission(
      moment(start.getTime())
        .format('YYYY-MM-DD')
        .toString(),
      moment(end.getTime())
        .format('YYYY-MM-DD')
        .toString(),
      moment(startLine.getTime())
        .format('YYYY-MM-DD')
        .toString(),
      moment(endLine.getTime())
        .format('YYYY-MM-DD')
        .toString(),
    );
    return () => {
      timeInterval.current && clearInterval(timeInterval.current);
    };
  }, []);

  const init = async () => {
    try {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
          // Android options
          forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
          stopOnTerminate: false,
          enableHeadless: true,
          startOnBoot: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
          requiresCharging: false, // Default
          requiresDeviceIdle: false, // Default
          requiresBatteryNotLow: false, // Default
          requiresStorageNotLow: false, // Default
        },
        onBackgroundFetchEvent(notiStep),
        status => {
          switch (status) {
            case BackgroundFetch.STATUS_RESTRICTED:
              break;
            case BackgroundFetch.STATUS_DENIED:
              break;
            case BackgroundFetch.STATUS_AVAILABLE:
              break;
          }
        },
      );
      // Turn on the enabled switch.
      await BackgroundFetch.start();
      // setEnabled(value);
      // Load the list with persisted events.
    } catch (error) { }
  };
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
  const getData = (start, end, startLine, endLine) => {
    onGetStepLine();
  };
  const getPermission = async (start, end, startLine, endLine) => {
    try {
      let resPermissions = await Fitness.requestPermissions(permissions);

      let resAuth = await Fitness.isAuthorized(permissions);
      if (resAuth == true) {
        init();
        getData(start, end, startLine, endLine);
      }
    } catch (error) {
      getPermission();
    }
  };
  const onGetStepLine = () => {
    let start = new Date();
    let end = new Date();
    start.setDate(start.getDate() - 7);
    Fitness.getSteps({ startDate: start, endDate: end })
      .then(res => {
        if (res.length) {
          res.pop()
          let data = res.map((obj, index) => ({
            x: obj.quantity,
            y: obj.quantity,
          }));
          let timeLine = res.map(obj => {
            return new Date(obj.startDate).format('dd/MM')
          })
          // data.length !== 0 && data.pop()
          setDataChart(data);

          alert7dayLessThan1000(data)

          setTime(timeLine)
        } else {
        }
      })
      .catch(err => { });
  };


  useEffect(() => {
    getWeightHeight()
    getSex()
    getStepsRealTime()
    autoChangeStepsTarget()
    return NativeAppEventEmitter.removeListener('change:steps')
  }, [weightHeight.height, totalCount,countStep])

  const autoChangeStepsTarget = async () => {
    let auto = await getAutoChange();
    if (auto != undefined && auto == false) {
      return
    }
    let start = new Date();
    let end = new Date();
    let firtTimeOpen = await getFirstTimeOpen()
    // let firtTimeOpen = moment().subtract(2,'days').startOf('day').unix()
    let firtTimeUnix2d = moment(firtTimeOpen, 'yyyy-MM-DD').unix() + 2 * 24 * 60 * 60
    let firtTimeUnix3d = moment(firtTimeOpen, 'yyyy-MM-DD').unix() + 3 * 24 * 60 * 60
    // let firtTimeUnix2d = firtTimeOpen + 2 * 24 * 60 * 60
    // let firtTimeUnix3d = firtTimeOpen + 3 * 24 * 60 * 60
     let todayUnix = moment().unix()
    //  if (todayUnix < firtTimeUnix2d) {
    //   return
    // }
    if (todayUnix > firtTimeUnix2d && todayUnix < firtTimeUnix3d) {
      start.setDate(start.getDate() - 2);
      end.setDate(end.getDate() - 1)
      let listHistory = await Fitness.getSteps({ startDate: start, endDate: end })
      let CvList = listHistory.map(i => i.quantity)
      let stepTarget = await getResultSteps()
      let stepTargetNew = CalculationStepTarget(CvList, stepTarget?.step || 10000)
      setTotalCount(parseInt(stepTargetNew))
      let resultSave = {
        step: stepTargetNew,
        date: moment().unix()
      }
      await setResultSteps(resultSave)
    }
    else{
      start.setDate(start.getDate() - 3);
      end.setDate(end.getDate() - 1)
      let listHistory = await Fitness.getSteps({ startDate: start, endDate: end })
      let CvList = listHistory.map(i => i.quantity)
      let stepTarget = await getResultSteps()
      if(stepTarget.date + 24*60*60 >= todayUnix){
        return;
      }
      let stepTargetNew = CalculationStepTarget(CvList, stepTarget?.step || 10000)
      let resultSave = {
        step: stepTargetNew,
        date: moment().unix()
      }
      await setResultSteps(resultSave)
    }
 


    // let stepTarget = await getResultSteps()
    // if (!listHistory || listHistory.length <= 0) {
    //   return
    // }
    // // số bước chân của ngày hôm qua 
    // let totalSteps
    // if (listHistory.length = 2) {
    //   totalSteps = listHistory[1]?.quantity || 0
    // } else totalSteps = listHistory[2]?.quantity || 0
    // // nhỏ hơn 2 ngày
    // if (todayUnix < firtTimeUnix + 2 * 24 * 60 * 60) {
    //   return
    // }
    // // từ 2-3 ngày
    // if (todayUnix > firtTimeUnix + 2 * 24 * 60 * 60 && todayUnix < firtTimeUnix + 3 * 24 * 60 * 60) {
    //   if (totalSteps >= stepTarget) {
    //     await setResultSteps({
    //       step: stepTarget,
    //       date: new moment().unix()
    //     })
    //   } else {
    //     await setResultSteps({
    //       step: totalSteps + 250,
    //       date: new moment().unix()
    //     })
    //   }
    // }
    // // bắt đầu ngày thứ 4
    // else {
    //   if (totalSteps <= 1000) {
    //     await setResultSteps({
    //       step: 1000,
    //       date: new moment().unix()
    //     })
    //   }
    //   if (totalSteps > stepTarget) {
    //     if (stepTarget <= 5000) {
    //       await setResultSteps({
    //         step: totalSteps + 250,
    //         date: new moment().unix()
    //       })
    //     }
    //     let tmp = totalSteps / (stepTarget?.step || 10000) * 100;
    //     let configurationStep = stepTarget?.step || 10000;
    //     let stepDifferen = Math.abs(totalSteps - (stepTarget?.step || 10000))
    //     if (tmp >= 150) {
    //       configurationStep += parseInt(stepDifferen * 0.2)
    //     } else if (tmp >= 100) {
    //       configurationStep += parseInt(stepDifferen * 0.1)
    //     } else {
    //       configurationStep -= parseInt(stepDifferen * 0.2)
    //     }
    //     await setResultSteps({
    //       step: configurationStep,
    //       date: new moment().unix()
    //     })
    //   }
    // }
  }

  const getSex = async () => {
    let profiles = (await getProfile()) || [];
    // sex = profiles.gender
    if (profiles) {
      sex = profiles[0].gender
    }

  }
  const getWeightHeight = async () => {
    let profiles = (await getProfile()) || [];
    const height = profiles[0].height || 0
    const heightCV = height.replace('cm', '').replace(' ', '')
    const weight = profiles[0].weight || 0
    const weightCV = weight.replace('kg', '').replace(',', '.').replace(' ', '')
    setWeightHeight({
      height: parseFloat(heightCV),
      weight: parseFloat(weightCV)
    })
  }
  const getStepsRealTime = async () => {
    let stepCurrent

    const healthKitOptions = {
      permissions: {
        read: [
          PERMS.DateOfBirth,
          PERMS.Weight,
          PERMS.StepCount,
          PERMS.ActiveEnergyBurned
        ],
        write: [
          PERMS.StepCount
        ]
      }
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, res) => {
      let sexValue
      if (sex == 1) sexValue = 0.415
      else sexValue = 0.413
      if (err) {
        return;
      }

      let optionsStepCurrent = {
        startDate: moment().startOf('day'), // required
        endDate: moment(), // optional; default now
      };
      AppleHealthKit.getStepCount(optionsStepCurrent, (err, results) => {
        if (err) {
          return;
        }
        stepCurrent = results.value
        const countR = totalCount - stepCurrent
        setCountRest(countR)

      });
      let distanUser
      //get calo and time
      let optionsAll = {
        startDate: (moment().startOf('day')).toISOString(),
        endDate: (new Date()).toISOString(),
        type: 'Walking', // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
      };
      AppleHealthKit.getSamples(optionsAll, (err, results) => {
        if (err) {
          return;
        }
        let timeInit = 0
        let initialValue = 0

        //get Calo

        const a = results.reduce((k, i) => {
          const timeStart = moment(i.start).unix()
          const timeEnd = moment(i.end).unix()
          const timeS = timeEnd - timeStart
          // const tb = timeS / i.quantity
          const stepRate = i.quantity / timeS
          let stepRateFactor
          if (stepRate < 1.6)
            stepRateFactor = 0.82;
          else if ((stepRate >= 1.6) && (stepRate < 1.8))
            stepRateFactor = 0.88;
          else if ((stepRate >= 1.8) && (stepRate < 2.0))
            stepRateFactor = 0.96;
          else if ((stepRate >= 2.0) && (stepRate < 2.35))
            stepRateFactor = 1.06;
          else if ((stepRate >= 2.35) && (stepRate < 2.6))
            stepRateFactor = 1.35;
          else if ((stepRate >= 2.6) && (stepRate < 2.8))
            stepRateFactor = 1.55;
          else if ((stepRate >= 2.8) && (stepRate < 4.0))
            stepRateFactor = 1.85;
          else if (stepRate >= 4.0)
            stepRateFactor = 2.30;
          let distanceInStep = sexValue * weightHeight.height * stepRateFactor
          let speed = distanceInStep * stepRate * 3.6
          let calo
          // console.log('weightUserweightUserweightUser',weightUser,distanceInStep,stepRate)
          if (speed <= 5.5) calo = ((0.1 * 1000 * speed) / 60 + 3.5) * weightHeight.weight * 2 / 12000
          else calo = ((0.2 * 1000 * speed) / 60 + 3.5) * weightHeight.weight * 2 / 12000
          // setCountCarlo(calo.toFixed(2))
          return k + calo * timeS * 2
        }, initialValue)
        setCountCarlo(parseInt(a * 2 / 1000))
        //get time
        let timeUse = results.reduce((k, i) => {
          const timeStart = moment(i.start).unix()
          const timeEnd = moment(i.end).unix()
          const timeT = timeEnd - timeStart
          return k + timeT
        }, timeInit)
        let h = parseInt(timeUse / 3600)
        let m
        if (h == 0) {
          m = parseInt((timeUse / 60))
        } else {
          m = parseInt((timeUse - h * 3600) / 60)
        }
        setCountTime(m)
        setCountTimeHour(h)
        //get Distance
        const b = results.reduce((k, i) => {
          const timeStart = moment(i.start).unix()
          const timeEnd = moment(i.end).unix()
          const timeS = timeEnd - timeStart
          const stepRate = i.quantity / timeS
          let stepRateFactor
          if (stepRate < 1.6)
            stepRateFactor = 0.82;
          else if ((stepRate >= 1.6) && (stepRate < 1.8))
            stepRateFactor = 0.88;
          else if ((stepRate >= 1.8) && (stepRate < 2.0))
            stepRateFactor = 0.96;
          else if ((stepRate >= 2.0) && (stepRate < 2.35))
            stepRateFactor = 1.06;
          else if ((stepRate >= 2.35) && (stepRate < 2.6))
            stepRateFactor = 1.35;
          else if ((stepRate >= 2.6) && (stepRate < 2.8))
            stepRateFactor = 1.55;
          else if ((stepRate >= 2.8) && (stepRate < 4.0))
            stepRateFactor = 1.85;
          else if (stepRate >= 4.0)
            stepRateFactor = 2.30;
          let distanceInStep = sexValue * weightHeight.height * stepRateFactor
          const distanceUser = parseFloat(distanceInStep * i.quantity / 100000)
          return k + distanceUser
        }, initialValue)
        setDistant(b.toFixed(2))
      });


      AppleHealthKit.initStepCountObserver({}, () => { });
      NativeAppEventEmitter.addListener(
        'change:steps',
        (evt) => {
          fetchStepCountData();
        }
      );
      fetchStepCountData();
    });
  }


  const fetchStepCountData = () => {

    const today = new Date()

    const options = {
      startDate: today.toISOString(true),
      endDate: moment().toISOString()
    }

    AppleHealthKit.getStepCount({
      date: options.startDate
    }, (err, results) => {
      if (err) {
        return
      }

      const steps = (typeof results === 'object')
        ? Math.floor(results.value)
        : 0

      if (steps > 0) {
        setCountStep(steps)
        const countR = totalCount - steps
        // setCountRest(countR)
      }
    })
  }

  const onGetDistances = (start, end) => {
    Fitness.getDistances({ startDate: start, endDate: end })
      .then(res => {
        //
        var total = 0;
        res.map(obj => {
          total += obj.quantity;
        });
        total = total / 1000;
        setDistant(total.toFixed(1));
      })
      .catch(err => { });
  };

  const alert7dayLessThan1000 = (steps) => {
    if (steps.length >= 7) {
      let check = true
      steps.forEach(element => {
        if ((element?.x || 0) >= 1000) {
          check = false
        }
      });
      if (check) {
        showNotificationAlert7DayLessThan100()
      }
    }
  }

  const showNotificationAlert7DayLessThan100 = async () => {
    let old = await getConfirmAlert()
    if (old != (new moment().format('DD/MM/YYYY'))) {
      openModalAlert7Day()
    }
  }

  const confirmStepsTarget = async (type) => {
    console.log('typetypetypetypetypetype',type)
    await setConfirmAlert(new moment().format('DD/MM/YYYY'))
    let currentTime = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
    console.log('typetypetypetypetypetype',type)
    if (type == 1) {
      closeModalAlert7Day()
    } else {
      let resultSave = {
        step: 10000,
        date: currentTime
      }
      await setResultSteps(resultSave)
      closeModalAlert7Day()
    }
  }

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const onBack = () => {
    try {
      navigation.pop();
    } catch (e) { }
  };
  const onShowMenu = () => {
    navigation.openDrawer();
  };
  console.log('vaovaovaovaovaovaova')
  const functionTest = () => {
    let options = {
      value: 10,
      startDate: (moment().subtract(0,'days').startOf('day')).toISOString(),
      endDate: (moment().subtract(0,'days').endOf('day')).toISOString(),
    };
    AppleHealthKit.saveSteps(options, (err, res) => {
      if (err) {
        console.log('ererererererererere',err)
        return;
      }
      console.log('countresresresres',countRest)
      console.log('resresresresresres',res)
      // step count sample successfully saved
    });
  }
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

      <ModalChangeTarget
        isShowModalAlert={isShowModalAlert}
        closeModalAlert7Day={closeModalAlert7Day}
        confirmStepsTarget={confirmStepsTarget}
        formatMessage={formatMessage}
        message={message}
        numberWithCommas={numberWithCommas}
        totalCount={totalCount}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>

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
              rotation={0}
              lineCap="round"
              fill={((totalCount - countRest) / totalCount) * 100}
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

            {locale != 'en' ? <View>
              <Text style={styles.txData}>{`${formatMessage(
                message.stepsToTarget,
              )} ${numberWithCommas(countRest > 0 ? countRest : 0)}`}</Text>
              <Text style={styles.txUnit}>{`${formatMessage(
                message.stepsNormal,
              )}`}</Text>
            </View> : <View>
                <Text style={styles.txData}>{numberWithCommas(countRest > 0 ? countRest : 0)} <Text style={[styles.txUnit, { marginTop: 10, fontWeight: '400' }]}>steps</Text> </Text>
                <Text style={styles.txUnit}>to target</Text>
              </View>}

          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_distance.png')}
            />
            <Text style={styles.txData}>{distant.toString().replace('.', ',')}</Text>
            <Text style={styles.txUnit}>{`km`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_calories.png')}
            />
            <Text style={styles.txData}>{numberWithCommas(countCarlo || 0)}</Text>
            <Text style={styles.txUnit}>{`kcal`}</Text>
          </View>
          <View style={[styles.viewImgData]}>
            <Image
              style={[styles.img]}
              source={require('./images/ic_time.png')}
            />
            <View>
              {
                countTimeHour > 0 ? (
                  <View>
                    <View style={{ marginLeft: 4, flexDirection: 'row' }}>
                      <Text style={[styles.txData, { paddingRight: 3, marginTop: 10 }]}>{countTimeHour}</Text>
                      <Text style={[styles.txUnit, { marginTop: 10 }]}>{formatMessage(message.hour)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.txData, { paddingRight: 3, marginTop: 5 }]}>{countTime}</Text>
                      <Text style={[styles.txUnit, { marginTop: 5 }]}>{countTime <= 1 ? formatMessage(message.minute) : formatMessage(message.minutes)}</Text>
                    </View>
                  </View>

                ) : <View>
                    <Text style={[styles.txData, { paddingRight: 3 }]}>{countTime}</Text>
                    <Text style={[styles.txUnit,]}>{countTime <= 1 ? formatMessage(message.minute) : formatMessage(message.minutes)}</Text>
                  </View>
              }
            </View>



          </View>
        </View>
        <View style={styles.viewLineChart}>
          {(dataChart.length && <View>
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
          </View>) ||
            null}

        </View>
        {/* <View style={styles.viewHeight} /> */}
      </ScrollView>
      {/* <TouchableOpacity
        style={styles.btnHistory}
        onPress={() =>
          navigation.navigate('stepHistory', {
            dataHealth: { countStep, countRest, countCarlo, distant },
          })
        }>
        <Text style={styles.txHistory}>
          {formatMessage(message.viewHistory)}
        </Text>
      </TouchableOpacity> */}
      <ButtonIconText
        onPress={
          // functionTest
          () =>
          navigation.navigate('stepHistory', {
            dataHealth: { countStep, countRest, countCarlo, distant },
          })
        }
        text={formatMessage(message.viewHistory)}
        styleBtn={[styles.colorButtonConfirm]}
        styleText={{ fontSize: fontSize.normal, fontWeight: 'bold' }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  img: {
    width: RFValue(55),
    height: RFValue(55)
  },
  chart: {
    flex: 1,
  },
  viewLineChart: {
    // marginTop: RFValue(10),
  },
  colorButtonConfirm: {
    backgroundColor: red_bluezone,
    height: RFValue(46),
    alignSelf: 'center',
    width: '60%',
    borderRadius: 25,
    paddingVertical: 0,
    marginBottom: RFValue(10)
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
    marginTop: RFValue(5),
  },
  dataHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: RFValue(10),
  },

  viewCircular: {
    paddingBottom: RFValue(20),
    // marginTop: RFValue(20),
    alignItems: 'center',
    marginHorizontal: RFValue(20),
    justifyContent: 'center',
  },
  viewBorderCircular: {
    padding: RFValue(10),
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
    height: RFValue(300),
  },
  btnHistory: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: RFValue(41),
    backgroundColor: '#fe4358',
    borderRadius: 6,
    marginBottom: RFValue(20),
  },
  txHistory: {
    color: '#fff',
    fontSize: 14,
  },
  txToday: {
    color: '#fff',
    fontSize: 14,
    marginVertical: RFValue(20),
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : RFValue(20),
  },
});
StepCount.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StepCount);
