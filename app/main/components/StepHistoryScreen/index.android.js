import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { isIPhoneX } from '../../../core/utils/isIPhoneX';

import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import Header from '../../../base/components/Header';
import message from '../../../core/msg/stepCount';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { getDistances } from '../../../core/calculation_steps';
import { getListHistory } from '../../../core/db/RealmDb';
import BarChart7Item from './BarChart/BarChart7Item';
import { RFValue } from '../../../const/multiscreen';
import { red_bluezone } from '../../../core/color';


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
const StepCount = ({ props, intl, navigation }) => {
  const { formatMessage, locale } = intl;

  const [selectDate, setSelectDate] = useState(true);
  const [selectWeek, setSelectWeek] = useState(false);
  const [selectMonth, setSelectMonth] = useState(false);

  const [countTime, setCountTime] = useState(0);
  const [countTimeHour, setCountTimeHour] = useState(0);
  const [countStep, setCountStep] = useState(null);
  const [countCarlo, setCountCarlo] = useState(0);
  const [distant, setDistant] = useState(0);
  const [dataChart, setDataChart] = useState([]);
  const [maxDomain, setMaxDomain] = useState(10000)
  const [startTime, setStartTime] = useState(new moment(new Date()).startOf('year').unix())
  const [endTime, setEndTime] = useState(new moment(new Date()).subtract(1, 'days').unix())
  const [listStepToday, setListStepToday] = useState(undefined)
  const [listTotalSteps, setListTotalSteps] = useState([])
  const [selectedItem, setSelectedItem] = useState({
    page: 0,
    index: -1
  })

  useFocusEffect(
    React.useCallback(() => {
      getDataHealth(
        'day',
      );
      setSelectDate(true);
      setSelectMonth(false);
      setSelectWeek(false);
    }, [])
  );

  const onSetSelect = type => async () => {
    if (type == 1) {
      getDataHealth(
        'day',
      );
      setSelectDate(true);
      setSelectMonth(false);
      setSelectWeek(false);
      return;
    }
    if (type == 2) {
      getDataHealth(
        'week',
      );
      setSelectDate(false);
      setSelectMonth(false);
      setSelectWeek(true);
      return;
    }
    if (type == 3) {
      getDataHealth(
        'month',
      );
      setSelectDate(false);
      setSelectMonth(true);
      setSelectWeek(false);
      return;
    }
  };

  const getDataHealth = async (type) => {
    let stepToday = listStepToday
    let step = [...listTotalSteps]

    try {
      if (!stepToday) {
        let result = await getDistances();
        let time = result?.time || 0;

        let start = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
        let jj = JSON.stringify({
          step: result?.step || 0,
          distance: result?.distance || 0,
          calories: result?.calories || 0,
          time: time
        })
        stepToday = {
          starttime: start,
          resultStep: jj
        }
        setListStepToday(stepToday)
      }
      if (step.length == 0) {
        step = await getListHistory(startTime, endTime)
        step.push(stepToday)
        setListTotalSteps(step)
      }

      if (!step || step.length <= 0) {
        return
      }

      let list = [];
      if (type == 'day') {
        list = step.map(item => {
          let tmp = JSON.parse(item?.resultStep || {})
          return {
            x: (new moment().isSame(new moment.unix(item?.starttime), 'days')) ?
              formatMessage(message.today) :
              moment.unix(item?.starttime).format('DD/MM'),
            y: tmp?.step,
            results: tmp
          }
        });
      }
      else if (type == 'month') {
        let currentMonth = moment().month();
        const groups = step.reduce((acc, current) => {
          const monthYear = moment.unix(current?.starttime).month();
          if (!acc[monthYear]) {
            acc[monthYear] = [];
          }
          acc[monthYear].push(current);
          return acc;
        }, {});

        for (const [key, value] of Object.entries(groups)) {
          let results = value.reduce((t, v) => {
            let tmp = JSON.parse(v?.resultStep)
            return {
              steps: (t?.steps || 0) + (tmp?.step || 0),
              calories: (t?.calories || 0) + (tmp?.calories || 0),
              distance: (t?.distance || 0) + (tmp?.distance || 0),
              time: (t?.time || 0) + (tmp?.time || 0),
            }
          }, {})
          let label = ''
          if (locale == 'en') {
            switch (parseInt(key)) {
              case 0: {
                label = 'Jan'
                break
              }
              case 1: {
                label = 'Feb'
                break
              }
              case 2: {
                label = 'Mar'
                break
              }
              case 3: {
                label = 'Apr'
                break
              }
              case 4: {
                label = 'May'
                break
              }
              case 5: {
                label = 'Jun'
                break
              }
              case 6: {
                label = 'Jul'
                break
              }
              case 7: {
                label = 'Aug'
                break
              }
              case 8: {
                label = 'Sep'
                break
              }
              case 9: {
                label = 'Oct'
                break
              }
              case 10: {
                label = 'Nov'
                break
              }
              case 11: {
                label = 'Dec'
                break
              }
              default: label = ''
            }
            if (key >= currentMonth) {
              label = 'This\nmonth'
            }
          } else {
            label = `${formatMessage(message.month)}\n${key < currentMonth ? (parseInt(key) + 1) : 'này'}`
          }
          list.push({
            x: label,
            y: results?.steps || 0,
            results: results
          })
        }
      } else if (type == 'week') {

        const groups = step.reduce((acc, current) => {
          const yearWeek = moment.unix(current?.starttime).week();
          if (!acc[yearWeek]) {
            acc[yearWeek] = [];
          }
          acc[yearWeek].push(current);
          return acc;
        }, {});

        let currentTime = moment();
        for (const [key, value] of Object.entries(groups)) {
          let results = value.reduce((t, v) => {
            let tmp = JSON.parse(v?.resultStep)
            return {
              steps: (t?.steps || 0) + (tmp?.step || 0),
              calories: (t?.calories || 0) + (tmp?.calories || 0),
              distance: (t?.distance || 0) + (tmp?.distance || 0),
              time: (t?.time || 0) + (tmp?.time || 0),
            }
          }, {})
          let startWeek = moment.unix(value[0]?.starttime).startOf('isoWeek')
          let endWeek = moment.unix(value[0]?.starttime).endOf('isoWeek')
          let valueEnd = (endWeek.isAfter(currentTime) || endWeek.isSame(currentTime)) ? formatMessage(message.now) : `${endWeek.format('DD')}`
          let label = ''
          if (locale == 'en') {
            label = `${startWeek.format('DD')} - ${valueEnd}\n${endWeek.locale('en').format('MMM')}`
          } else {
            label = `${startWeek.format('DD')} - ${valueEnd}\nT ${endWeek.format('MM')}`
          }
          list.push({
            x: label,
            y: results?.steps || 0,
            results: results,
          })
        }
      }
      let max = Math.max.apply(Math, list.map(function (o) { return o.y; }))
      setMaxDomain(max + 1000)

      setDataChart(list);
    } catch (error) {
      console.log('getDataHealth error', error)
    }
  };

  const onBack = () => {
    try {
      navigation.pop();
    } catch (e) { }
  };

  const updateDistance = (item, index, flIndex) => {
    let result = item?.results
    let time = result?.time || 0;
    let h = parseInt(time / 3600)
    let m = parseInt((time % 3600) / 60)
    setDistant(result?.distance || 0);
    setCountCarlo(result?.calories || 0);
    setCountTime(m)
    setCountTimeHour(h)
    setCountStep(result?.steps || result?.step || 0);

    setSelectedItem({
      page: flIndex,
      index: index
    })
  }

  const renderChart = useMemo(() => {
    if (dataChart.length) {
      return (
        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 0
          }}>{new moment().format('YYYY')}</Text>

          <BarChart7Item
            dataTodayOld={listStepToday}
            data={dataChart}
            maxDomain={maxDomain}
            selectedItem={selectedItem}
            onGetDataBySelect={updateDistance}
          />
        </View>
      )
    } else {
      return (
        <ActivityIndicator color={red_bluezone} style={{
          alignSelf: 'center'
        }} />
      )
    }
  }, [dataChart, selectedItem])

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Header
          // onBack={onBack}
          colorIcon={red_bluezone}
          title={formatMessage(message.stepCountHistory)}
          styleHeader={styles.header}
          styleTitle={{
            color: '#000',
            fontSize: fontSize.fontSize17,
          }}
        />
        <View style={[styles.viewLineChart, { marginTop: 0, }]}>
          {/* {dataChart?.length ? <BartChartHistory
            data={dataChart} /> : null} */}
          {renderChart}
        </View>

        <View style={styles.dataHealth}>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_step.png')}
            />
            <Text style={styles.txData}>{`${numberWithCommas(countStep || 0)}`}</Text>
            <Text style={styles.txUnit}>{`${formatMessage(
              message.stepsNormal,
            )}`}</Text>
          </View>
          <View style={styles.viewImgData}>
            <Image
              style={styles.img}
              source={require('./images/ic_distance.png')}
            />
            <Text style={styles.txData}>{parseFloat(distant || 0).toFixed(2).replace('.', ',')}</Text>
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
    marginBottom: RFValue(46, fontSize.STANDARD_SCREEN_HEIGHT),
  },
  bgRed: {
    backgroundColor: red_bluezone,
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
    height: RFValue(46, fontSize.STANDARD_SCREEN_HEIGHT),
    width: RFValue(87, fontSize.STANDARD_SCREEN_HEIGHT),
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: RFValue(56, fontSize.STANDARD_SCREEN_HEIGHT),
    height: RFValue(56, fontSize.STANDARD_SCREEN_HEIGHT)
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
    height: 10,
  },
  viewImgData: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txData: {
    color: red_bluezone,
    fontSize: RFValue(13, fontSize.STANDARD_SCREEN_HEIGHT),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  txUnit: {
    fontSize: RFValue(13, fontSize.STANDARD_SCREEN_HEIGHT),
    textAlign: 'center',
    color: red_bluezone,
    marginTop: 5,
  },
  dataHealth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: RFValue(32, fontSize.STANDARD_SCREEN_HEIGHT),
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
    color: red_bluezone,
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
    fontSize: RFValue(15, fontSize.STANDARD_SCREEN_HEIGHT),
    fontWeight: '700'
  },
  txtYear: {
    fontSize: RFValue(17, fontSize.STANDARD_SCREEN_HEIGHT),
    fontWeight: 'bold',
    paddingBottom: RFValue(10, fontSize.STANDARD_SCREEN_HEIGHT),
    alignSelf: 'center',
  },
});

StepCount.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StepCount);
