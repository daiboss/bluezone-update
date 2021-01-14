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
  processColor,
  Platform,
  NativeAppEventEmitter,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Fitness from '@ovalmoney/react-native-fitness';
import AppleHealthKit from 'rn-apple-healthkit';
import { LineChart } from 'react-native-charts-wrapper';
import { isIPhoneX } from '../../../core/utils/isIPhoneX';
import { Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import BackgroundTimer from 'react-native-background-timer';
//db

// import { LineChart, Grid } from 'react-native-svg-charts'
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
  setEvents,
  getEvents,
  getTimestamp,
  getSteps,
  getStepsTotal,
  setAutoChange,
  getAutoChange,
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
import { getAbsoluteMonths } from '../../../core/steps';
const PERMS = AppleHealthKit.Constants.Permissions;
// export const scheduleTask = async name => {
//   try {
//     await BackgroundFetch.scheduleTask({
//       taskId: name,
//       stopOnTerminate: false,
//       enableHeadless: true,
//       delay: 5000, // milliseconds (5s)
//       forceAlarmManager: true, // more precise timing with AlarmManager vs default JobScheduler
//       periodic: true, // Fire once only.
//     })
//       .then(res => { })
//       .catch(err => { });
//   } catch (e) { }
// };

// export const stopScheduleTask = async task => {
//   try {
//     let res = await BackgroundFetch.stop(task);
//   } catch (e) { }
// };
// export const onBackgroundFetchEvent = async taskId => 
//   try {
//     let end = new Date();
//     let start = new Date();
//     end.setDate(end.getDate() + 1);
//     let step = await getSteps(start, end);

//     let today = moment();
//     let resultSteps = await getResultSteps();

//     switch (taskId) {
//       case autoChange:
//         if (resultSteps) {
//           let storageDate = moment(resultSteps?.date).format('DD');
//           if (storageDate != today.format('DD')) {
//             getStepsTotal(start, end);
//           }
//         }
//         break;
//       case weightWarning:
//         let profiles = (await getProfile()) || [];
//         let profile = profiles.find(
//           item =>
//             getAbsoluteMonths(moment(item.date)) == getAbsoluteMonths(today),
//         );

//         if (profile) {
//           let nextWeek = new Date().getTime();
//           let isWarning = parseInt(
//             (nextWeek - profile?.date) / (1000 * 3600 * 24),
//           );

//           if (isWarning >= 7) {
//             scheduler.createWarnningWeightNotification();
//           }
//         }
//         break;
//       case notiStep:
//         if (resultSteps) {
//           if (today.format('HH') >= 19) {
//             scheduler.createWarnningStepNotification(step?.step);
//           }
//         }
//         break;
//       case realtime:
//         scheduler.createShowStepNotification(step?.step);
//         break;
//       default:
//         break;
//     }
//     if (taskId === 'react-native-background-fetch') {
//       // Test initiating a #scheduleTask when the periodic fetch event is received.
//       let auto = await getAutoChange();

//       if (auto == undefined || auto == null) {
//         await scheduleTask(autoChange);
//         setAutoChange(true);
//       }
//     }
//   } catch (e) { }
//   // Required: Signal completion of your task to native code
//   // If you fail to do this, the OS can terminate your app
//   // or assign battery-blame for consuming too much background-time
//   BackgroundFetch.finish(taskId);
//};
const StepCount = ({ props, intl, navigation }) => {
  const timeInterval = useRef();
  let sex
  const { formatMessage } = intl;
  const [time, setTime] = useState([]);
  const [heightUser, setHeightUser] = useState(0)
  const [weightUser, setWeightUser] = useState(0)
  const [weightHeight,setWeightHeight] = useState({weight:0,height:0})
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


  // useEffect(() => {
  //   BackgroundTimer.start()
  //   // setTimeout(() => {
  //   //   let optionsStepCurrent = {
  //   //     startDate: moment().startOf('day'), // required
  //   //     endDate: moment(), // optional; default now
  //   // };
  //   // let stepCurrent
  //   // AppleHealthKit.getStepCount(optionsStepCurrent, (err, results) => {
  //   //   if (err) {
  //   //       return;
  //   //   }
  //   //   stepCurrent = results.value
  //   //   console.log('vaovaovaovasaaaaaaaa',stepCurrent,new Date().format('mm:ss'))
  //   //    scheduler.createWarnningStepNotification(stepCurrent || 0)
  //   // })},5000)
  //   BackgroundTimer.runBackgroundTimer(() => {
  //     //code that will be called every 3 seconds 
  //     let optionsStepCurrent = {
  //       startDate: moment().startOf('day'), // required
  //       endDate: moment(), // optional; default now
  //     };
  //     let stepCurrent
  //     AppleHealthKit.getStepCount(optionsStepCurrent, (err, results) => {
  //       if (err) {
  //         return;
  //       }
  //       stepCurrent = results.value
  //       // console.log('vaovaovaovasaaaaaaaa', stepCurrent, new Date().format('mm:ss'))
  //       // scheduler.createWarnningStepNotification(stepCurrent || 0)
  //     });

  //     // scheduler.createWarnningStepNotification(countRest || 0)
  //   },
  //     5000);
  //   // BackgroundTimer.stopBackgroundTimer();
  //   // BackgroundTimer.stop();
  // }, [])

  // const timeNotification = async () => {
  //   BackgroundTimer.start()
  //   BackgroundTimer.runBackgroundTimer(() => {
  //     console.log('runBackgroundTimerrunBackgroundTimer', new moment().format('hh:mm:ss'))
  //     BackgroundTimer.stopBackgroundTimer()
  //   }, 3000)
  //   BackgroundTimer.stop()
  // }





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
        onBackgroundFetchEvent,
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
      console.log('datadata')
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
    // onGetStepsRealTime(start, end);
    // onGetCalories(start, end);
    // onGetDistances(start, end);
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
    return NativeAppEventEmitter.removeListener('change:steps')
  }, [weightHeight.height])

  const getSex = async () => {
    let profiles = (await getProfile()) || [];
    console.log('proorororororfile', profiles)
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
      height:parseFloat(heightCV),
      weight:parseFloat(weightCV)
    })
    // setHeightUser(parseFloat(heightCV))
    // setWeightUser(parseFloat(weightCV))
  }
  const getStepsRealTime = async () => {
    let stepCurrent
    // let profiles = (await getProfile()) || [];
    // const height = profiles[0].height || 0
    // const heightCV = height.replace('cm', '').replace(' ', '')
    // const weight = profiles[0].weight || 0
    // const weightCV = weight.replace('kg', '').replace(',', '.').replace(' ', '')
    // setHeightUser(parseFloat(heightCV))
    // setWeightUser(parseFloat(weightCV))
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
        console.log('errr', err)
        return;
      }
      // get Ditance
      // let optionsDistance = {
      //   date: (moment()).toISOString(), // optional; default now
      // };
      // AppleHealthKit.getDistanceWalkingRunning(optionsDistance, (err, results) => {
      //   if (err) {
      //     console.log('errerrerrerrerrerr', err)
      //     return;
      //   }
      //   const total = results.value / 1000;
      //   setDistant(total.toFixed(2));
      // });
      //get Sex
      // get to localStorage or get to redux
      //get stepCurrent
      let optionsStepCurrent = {
        startDate: moment().startOf('day'), // required
        endDate: moment(), // optional; default now
      };
      AppleHealthKit.getStepCount(optionsStepCurrent, (err, results) => {
        if (err) {
          return;
        }
        stepCurrent = results.value
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
          console.log('stepRatestepRatestepRatestepRate', stepRate)
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
          console.log('objectKcal', { sexValue, weightHeight, stepRateFactor })
          return k + calo * timeS * 2
        }, initialValue)
        setCountCarlo(parseInt(a / 1000))
        //get time
        const timeUse = results.reduce((k, i) => {
          const timeStart = moment(i.start).unix()
          const timeEnd = moment(i.end).unix()
          const timeT = timeEnd - timeStart
          return k + timeT
        }, timeInit)
        const timePush = timeUse / 60
        setCountTime(timePush.toFixed(0))
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
        console.log(err)
        return
      }

      const steps = (typeof results === 'object')
        ? Math.floor(results.value)
        : 0

      if (steps > 0) {
        setCountStep(steps)
        const countR = totalCount - steps
        setCountRest(countR)
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

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  // const onGetCalories = (start, end) => {
  //   Fitness.getCalories({ startDate: start, endDate: end })
  //     .then(res => {
  //       console.log('ressresresres', res)
  //       //
  //       var total = 0;
  //       res.map(obj => {
  //         total += obj.quantity;
  //       });
  //       setCountCarlo(total);
  //     })
  //     .catch(err => { });
  // };
  const onBack = () => {
    try {
      navigation.pop();
    } catch (e) { }
  };
  const onShowMenu = () => {
    navigation.openDrawer();
  };
  console.log('vaovaovaovaovaovaova')
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
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
            )} ${countRest > 0 ? countRest : 0}`}</Text>
            <Text style={styles.txUnit}>{`${formatMessage(
              message.stepsNormal,
            )}`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_distance.png')}
            />
            <Text style={styles.txData}>{distant}</Text>
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
            <Text style={styles.txUnit}>{formatMessage(message.minute)}</Text>
          </View>
        </View>
        <View style={styles.viewLineChart}>
          {(dataChart.length && <ChartLineV totalCount={totalCount} data={dataChart} time={time} />) ||
            null}
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
  img: {
    width: 64,
    height: 64
  },
  chart: {
    flex: 1,
  },
  viewLineChart: {
    marginTop: 30,
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
