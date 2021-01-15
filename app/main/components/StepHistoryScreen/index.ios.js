import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  NativeAppEventEmitter,
  StyleSheet,
  ImageBackground,
  Image,
  processColor,
} from 'react-native';
import Fitness from '@ovalmoney/react-native-fitness';
// import { BarChart } from 'react-native-charts-wrapper';
import { isIPhoneX } from '../../../core/utils/isIPhoneX';
import { RFValue } from '../../../const/multiscreen';

import { Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
import AppleHealthKit from 'rn-apple-healthkit';
// import { LineChart, Grid } from 'react-native-svg-charts'
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import Header from '../../../base/components/Header';
import BarChart from './BarChart';
import message from '../../../core/msg/stepCount';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import { useRoute } from '@react-navigation/native';
import dateUtils from 'mainam-react-native-date-utils';
import BartChartHistory from './BarChart/BartChartHistory';
import BarChartConvert from './BarChart/BarChartConvert';
import {
  getProfile,
  getIsFirstLoading,
  getFirstTimeOpen
} from '../../../core/storage';
import { objectOf } from 'prop-types';
import { DATA_STEPS } from './BarChart/data';
const PERMS = AppleHealthKit.Constants.Permissions;

Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof dowOffset == 'int' ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
      86400000,
    ) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};
const screenWidth = Dimensions.get('window').width;
const StepCount = ({ props, intl, navigation }) => {
  let sex
  const route = useRoute();

  const { formatMessage } = intl;

  const [maxDomain, setMaxDomain] = useState(10000)
  const [year,setYear] = useState(moment().format('YYYY'))
  const [widthChart, setWidthChart] = useState(screenWidth)

  const [heightUser,setHeightUser] = useState(0)
  const [weightUser,setWeightUser] = useState(0)
  const [startTime,setStartTime] = useState('')
  const [countTime,setCountTime] = useState(0)
  const [selectDate, setSelectDate] = useState(true);
  const [selectWeek, setSelectWeek] = useState(false);
  const [selectMonth, setSelectMonth] = useState(false);
  const offset = new Date().getTimezoneOffset();
  const [time, setTime] = useState([]);
  const [countStep, setCountStep] = useState(null);
  const [countRest, setCountRest] = useState(0);
  const [countCarlo, setCountCarlo] = useState(0);
  const [distant, setDistant] = useState(0);
  const totalCount = 10000;
  const intervalNow = useRef(null);
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
  // useEffect(async () => {
  //   const firstOpenApp = await getFirstTimeOpen();
  //   setStartTime(firstOpenApp)
  //   console.log('firstOpenAppfirstOpenApp',firstOpenApp)
  // },[])
  useEffect(() => {
    // async () => {
    // //   const firstOpenApp = await getFirstTimeOpen();
    // // setStartTime(firstOpenApp)
    let end = new Date();
    // let start = firstOpenApp
    // let start = new Date(2020,1,1).format('yyyy-MM-dd')
    let start = new Date(new Date() - 6*30*24*60*60*1000).format('yyyy-MM-dd')
    // console.log('monthAgomonthAgo',monthAgo)
    // console.log('anannanannanaan',start)
    getDataHealth(start, end.format('yyyy-MM-dd'), 'day');
    return () => {
      intervalNow.current && clearInterval(intervalNow.current);
    // };
    }
    
  }, []);

  const onSetSelect = type => () => {
    if (type == 1) {
      let end = new Date();
      // let start = startTime;
      // let start = new Date(2020,1,1).format('yyyy-MM-dd')
      // let start = moment('2020/01/01','yyyy/MM/DD');
      let start = new Date(new Date() - 6*30*24*60*60*1000).format('yyyy-MM-dd')
      getDataHealth(
        start,
        end.format('yyyy-MM-dd'),
        'day',
      );
      setSelectDate(true);
      setSelectMonth(false);
      setSelectWeek(false);
      return;
    }
    if (type == 2) {
      let end = moment();
      // let start = new Date(2020,1,1).format('yyyy-MM-dd')
      let start = new Date(new Date() - 6*30*24*60*60*1000).format('yyyy-MM-dd')
      // let start = startTime;
      getDataHealth(
        start,
        end.format('yyyy-MM-DD'),
        'week',
      );
      setSelectDate(false);
      setSelectMonth(false);
      setSelectWeek(true);
      return;
    }
    if (type == 3) {
      let end = moment();
      let start = new Date(new Date() - 6*30*24*60*60*1000).format('yyyy-MM-dd')
      // let start = new Date(2020,1,1).format('yyyy-MM-dd')
      // let start = startTime;
      getDataHealth(
        start,
        end.format('yyyy-MM-DD'),
        'month',
      );
      setSelectDate(false);
      setSelectMonth(true);
      setSelectWeek(false);
      return;
    }
  };
  const getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  const getDataHealth = (start, end, type) => {
    console.log('dadatatatata',start, end, type)
    Fitness.isAuthorized(permissions)
      .then(res => {
        if (res == true) {
          onGetSteps(start, end, type);
          onGetCalories(start, end, type);
          onGetDistances(start, end, type);
        } else {
          Fitness.requestPermissions(permissions)
            .then(res => { })
            .catch(err => { });
        }
      })
      .catch(err => {
        Fitness.requestPermissions(permissions)
          .then(res => { })
          .catch(err => { });
      });
    // Fitness.requestPermissions(permissions).then(res => {
    //     Fitness.getSteps({ startDate: '2020/12/01', endDate: '2020/12/03' }).then(res => {
    //
    //         // setCountStep(res)
    //         alert(JSON.stringify(res))
    //     })
    //

    // }).catch(err => {
    //     alert(JSON.stringify(err))

    //

    // })
  };
  const onRealTime = (start, end, type) => {
    if (intervalNow.current) {
      clearInterval(intervalNow.current);
    }
    intervalNow.current = setInterval(() => {
      //   onGetStepsRealTime(start, end, type);
      // onGetCalories(start,end)
      // onGetDistances(start,end)
    }, 3000);
  };
  const getDataChart = (data, type) => {
    console.log('vaovaovoaoavvaovaov',data,type)
    let list = [];
    if (type == 'day') {
      let currentDay = moment(new Date())
      list = data.map(item => ({
        x: moment(item.startDate).isAfter(currentDay) ? 'Hôm nay' : moment(item.startDate).format('DD/MM'),
        y: Number(item.quantity),
        start:moment(item.startDate).format('YYYY/DD/MM'),
        end:moment(item.startDate).format('YYYY/DD/MM'),
        year:moment(item.startDate).format('YYYY')
      }));
    } else if (type == 'month') {
      let currentMonth = moment(new Date()).month();
      console.log('dadadadhsuadhusahdusahduasd',currentMonth)
      const groups = data.reduce((acc, current) => {
        const monthYear = moment(current.startDate).month();
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(current);
        return acc;
      }, {});
      console.log('groupsgroupsgroups',groups,currentMonth)
      for (const [key, value] of Object.entries(groups)) {
        let steps = value.reduce((t, v) => t + v.quantity, 0)
        let startMonth = moment(value[0].startDate).startOf('month')
        let endMonth = moment(value[0].startDate).endOf('month')
        console.log('dhasudhsauhdsauhdusahdusansabcyhfu',key)
        let label = `Tháng\n${key > currentMonth ? (parseInt(key) + 1) : 'này'}`
        console.log('djadhasdhsuahdusadas',label)
        list.push({
          x: label,
          y: steps,
          start:startMonth.format('YYYY/DD/MM'),
          end:endMonth.format('YYYY/DD/MM'),
          year:startMonth.format('YYYY')
          // year:moment(item.startDate).format('YYYY')
        })
        console.log('hfhshfusahfusahfuhsaufhsauhfsa',list)
        // list.reverse()
      }
    } else if (type == 'week') {
      const groups = data.reduce((acc, current) => {
        const yearWeek = moment(current.startDate).week();
        if (!acc[yearWeek]) {
          acc[yearWeek] = [];
        }
        acc[yearWeek].push(current);
        return acc;
      }, {});

      let currentTime = moment(new Date());
      for (const [key, value] of Object.entries(groups)) {
        let steps = value.reduce((t, v) => t + v.quantity, 0)
        console.log('valuevaluevaluevaluevalue',value[0])
        let startWeek = moment(value[0].startDate).startOf('isoWeek')
        let endWeek = moment(value[0].startDate).endOf('isoWeek')
        console.log('startWeekstartWeekstartWeekstartWeek',startWeek.format('YYYY/DD/MM'),endWeek.format('YYYY/DD/MM'))
        let valueEnd = endWeek.isAfter(currentTime) ? 'nay' : `${endWeek.format('DD')}`
        let label = `${startWeek.format('DD')} - ${valueEnd}\nT ${endWeek.format('MM')}`
        list.push({
          x: label,
          y: steps,
          start:startWeek.format('YYYY/DD/MM'),
          end:endWeek.format('YYYY/DD/MM'),
          year:startWeek.format('YYYY')
        })
      }
    }

    return list;
  }

  useEffect(() => {
    getSex()
    // getStepsRealTime()
  }, [])

  const getSex = async () => {
    let profiles = (await getProfile()) || [];
        console.log('proorororororfile',profiles)
        // sex = profiles.gender
        if(profiles){
          sex = profiles[0].gender
        }
  }
  useEffect(() => {
    getWeightHeight()
  },[weightUser,heightUser])

  const getWeightHeight = async () => {
    let profiles = (await getProfile()) || [];
    console.log('profilesprofilesprofilesprofiles',profiles)
    const weight = profiles[0].weight || 0
    const weightCV = weight.replace('kg','').replace(',','.').replace(' ','')
    console.log('weightweightweightweight',weightCV)
    const height = profiles[0].height || 0
    const heightCV = height.replace('cm','').replace(' ','')
    console.log('heightCVheightCVheightCV',heightCV)
    setWeightUser(weightCV)
    setHeightUser(heightCV)

  }
  const getStepsRealTime = (result) => {
    console.log('getStepsRealTimegetStepsRealTimegetStepsRealTime',result)
    let sexValue
      if(sex == 1) sexValue = 0.415
      else sexValue = 0.413
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
      if (err) {
        console.log('errr', err)
        return;
      }

      //distance 
      let options = {
        unit: 'mile', // optional; default 'meter'
        startDate:(moment(`${result.start},'YYYY/DD/MM`).startOf('day')).toISOString(),
        endDate: (moment(`${result.end},'YYYY/DD/MM`).endOf('day')).toISOString(), // optional; default now
      };
      AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
        if (err) {
          return;
        }
        console.log("resultsresults",results)
    });
      // get Ditance
      //get Sex
      // get to localStorage or get to redux
      //get calo and time
      // const timeSet = `${result.year}/${result.x}`
      // console.log('timeSettimeSettimeSet',timeSet)
      let optionsAll = {
        startDate: (moment(`${result.start}`,'YYYY/DD/MM').startOf('day')).toISOString(),
        endDate: (moment(`${result.end}`,'YYYY/DD/MM').endOf('day')).toISOString(),
        type: 'Walking', // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
      };
      AppleHealthKit.getSamples(optionsAll, (err, results) => {
        if (err) {
          return;
        }
        console.log('resulltssss',results)
        let timeInit = 0
        let initialValue = 0
        

        //get Calor
        const a = results.reduce((k, i) => {
          const timeStart = moment(i.start).unix()
          const timeEnd = moment(i.end).unix()
          const timeS = timeEnd - timeStart
          // const tb = timeS / i.quantity
          const stepRate = i.quantity/timeS
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
            let distanceInStep = sexValue * heightUser * stepRateFactor
            let speed = distanceInStep * stepRate * 3.6
            let calo
            // console.log('weightUserweightUserweightUser',weightUser,distanceInStep,stepRate)
            if (speed <= 5.5) calo = ((0.1 * 1000 * speed) / 60 + 3.5) * weightUser * 2 / 12000
            else calo = ((0.2 * 1000 * speed) / 60 + 3.5) * weightUser * 2 / 12000
            // setCountCarlo(calo.toFixed(2))
          return k + calo*timeS*2
        }, initialValue)
        setCountCarlo(parseInt(a/1000))
        //get time
          const timeUse = results.reduce((k, i) => {
            const timeStart = moment(i.start).unix()
            const timeEnd = moment(i.end).unix()
            const timeT = timeEnd - timeStart
            return k + timeT
          }, timeInit)
          let timeT
          const timePush = (timeUse/600).toFixed(0)
          // if(timePush > 60) {
          //  const h = timePush/60
          //  const m = timePush - h*60
          //  timeT = `${h.toFixed(0)}:${m}`
          //  return timeT
          // }
          // else timeT = timePush
          setCountTime(timePush)
        //get Distance
        const b = results.reduce((k, i) => {
          const timeStart = moment(i.start).unix()
          const timeEnd = moment(i.end).unix()
          const timeS = timeEnd - timeStart
          const stepRate = i.quantity/timeS
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
            let distanceInStep = sexValue * heightUser * stepRateFactor
            const distanceUser = parseFloat(distanceInStep*i.quantity/100000)
          return k + distanceUser
        }, initialValue)
        setDistant(b.toFixed(2))
        
      });
  
    
    });
  }


  const onGetSteps = (start, end, type) => {
    try {
      Fitness.getSteps({ startDate: start, endDate: end })
        .then(res => {
          if (res.length) {
            try {
              let listDataChart = getDataChart(res, type)
              let max = Math.max.apply(Math, listDataChart.map(function (o) { return o.y; }))
              setMaxDomain(max + 1000)
              if (listDataChart.length <= 7) {
                setWidthChart(screenWidth)
              } else {
                let tmp = (screenWidth - (type == 'month' ? 30 : type == 'day' ? 80 : 60)) / 6;
                let widthTmp = tmp * (listDataChart.length - 1)
                setWidthChart(widthTmp)
              }
              // type == 'month' && listDataChart.reverse() //: listDataChart
              if(type == 'month'){
                let firtItem = listDataChart[0]
                listDataChart.splice(0,1)
                listDataChart.push(firtItem)
              }
              
              setDataChart(listDataChart);
            } catch (e) {
            }
          }
        })
        .catch(err => { });
    } catch (e) { }
  };
  // const onGetDistances = (start, end) => {
  //   Fitness.getDistances({ startDate: start, endDate: end })
  //     .then(res => {
  //       //
  //       var total = res.reduce((acc, obj) => acc + obj.quantity, 0);
  //       total = total / 1000;
  //       setDistant(total.toFixed(1));
  //     })
  //     .catch(err => { });
  // };
  const addDays = (date, days = 1) => {
    var list = [];
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    list.push(result);

    return [...list];
  };

  const getListDate = (startDate, endDate, range = []) => {
    var start = new Date(startDate);
    var end = new Date(endDate);

    if (start > end) {
      return range;
    }
    const next = addDays(start, 1);
    return getListDate(next, end, [...range, start]);
  };
  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const onGetCalories = (start, end) => {
    Fitness.getCalories({ startDate: start, endDate: end })
      .then(res => {
        let total = res.reduce((acc, obj) => acc + obj.quantity, 0);
        // setCountCarlo(total);
      })
      .catch(err => { });
  };
  const onBack = () => {
    try {
      navigation.pop();
    } catch (e) { }
  };
  const onShowMenu = () => {
    navigation.openDrawer();
  };
  // const onGetStepsRealTime = (start, end, type) => {
  //   try {
  //     Fitness.getSteps({ startDate: start, endDate: end })
  //       .then(res => {
  //         if (res.length) {
  //           setDataChart(getDataChart(res, type));
  //         }
  //       })
  //       .catch(err => { });
  //   } catch (e) { }
  // };
  const onGetDataBySelect = (result) => {
    console.log('updateDistance', result)
    let time = result?.time || 0;
    let h = parseInt(time / 3600)
    let m = parseInt((time % 3600) / 60)
    let timeString = ''
    if (h > 0) {
      timeString += `${h} - Giờ`
      if (m > 0) {
        timeString += `,\n${m} - Phút`
      }
    } else
      timeString += `${m}\nPhút`

    // setDistant(result?.distance);
    // setCountCarlo(result?.calories);
    // setTime(timeString);
    setYear(result.year)
    getStepsRealTime(result)
    setCountStep(parseInt(result?.y) );

  };

  const renderChart = useMemo(() => {
    if (dataChart.length) {
      return (
        <BarChartConvert
          onGetDataBySelect={onGetDataBySelect}
          data={dataChart}
          maxDomain={maxDomain}
          widthChart={widthChart} />
      )
    }
  }, [dataChart])

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBack={onBack}
        colorIcon={'#FE4358'}
        title={formatMessage(message.stepCountHistory)}
        styleHeader={styles.header}
        styleTitle={{
          color: '#000',
          fontSize: fontSize.bigger,
        }}
      />
      <Text style={{textAlign:'center',
      // paddingTop:RFValue(10),
      color:'black',
      fontSize:RFValue(18),
      fontWeight:'600'}}>{year}</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* <View>
                    <Text>Thống kê bước chân</Text>
                </View> */}
        <View style={styles.viewLineChart}>
          {/* {(dataChart.length && (
            <BarChart
              onGetDataBySelect={(start, end, marker) =>
                onGetDataBySelect(start, end, marker)
              }
              data={dataChart}
              time={time}
            />
          )) ||
            null} */}

          {renderChart}
        </View>

        <View style={styles.dataHealth}>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_step.png')}
            />
            <Text style={styles.txData}>{`${countStep || 0}`}</Text>
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
                        <Text style={styles.txUnit}>{`${formatMessage(
                            message.minute,
                        )}`}</Text>
                    </View>
        </View>
      </ScrollView>
      <View style={styles.viewBtn}>
        <TouchableOpacity
          onPress={onSetSelect(1)}
          style={[styles.btnDate, selectDate ? styles.bgRed : {}]}>
          <Text style={[styles.txDate, selectDate ? {} : styles.txGray]}>
            {formatMessage(message.day)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSetSelect(2)}
          style={[styles.btnDate, selectWeek ? styles.bgRed : {}]}>
          <Text style={[styles.txDate, selectWeek ? {} : styles.txGray]}>
            {formatMessage(message.week)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSetSelect(3)}
          style={[styles.btnDate, selectMonth ? styles.bgRed : {}]}>
          <Text style={[styles.txDate, selectMonth ? {} : styles.txGray]}>
            {formatMessage(message.month)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  bgRed: {
    backgroundColor: '#fe4358',
  },
  header: {
    backgroundColor: '#ffffff',
    marginTop: isIPhoneX ? 0 : 20,
  },
  txGray: {
    color: '#a1a1a1',
  },
  btnDate: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
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
    height: 10,
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
    borderTopColor: '#00000010',
    borderBottomColor: '#00000010',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 20,
  },

  viewCircular: {
    paddingVertical: 30,
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
  txDate: {
    color: '#fff',
    fontSize: 14,
  },
  txtYear: {
    fontSize: fontSize.normal,
    fontWeight: 'bold',
    paddingBottom: 5,
    alignSelf: 'center',
  },
});
StepCount.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StepCount);
