import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import Fitness from '@ovalmoney/react-native-fitness';
import {LineChart} from 'react-native-charts-wrapper';
import {isIPhoneX} from '../../../core/utils/isIPhoneX';
import {Dimensions} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ScrollView} from 'react-native-gesture-handler';
// import { LineChart, Grid } from 'react-native-svg-charts'
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import Header from '../../../base/components/Header';
import message from '../../../core/msg/stepCount';
import {injectIntl, intlShape} from 'react-intl';
import * as fontSize from '../../../core/fontSize';

import ChartLine from './ChartLine';
const screenWidth = Dimensions.get('window').width;
const StepCount = ({props, intl, navigation}) => {
  const {formatMessage} = intl;

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `#fe4358`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };
  const [time, setTime] = useState([]);
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `#fe4358`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const [countStep, setCountStep] = useState(null);
  const [countRest, setCountRest] = useState(0);
  const [countCarlo, setCountCarlo] = useState(0);
  const [distant, setDistant] = useState(0);
  const totalCount = 10000;
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
      kind: Fitness.PermissionKinds.Calories,
      access: Fitness.PermissionAccesses.Write,
    },
    {
      kind: Fitness.PermissionKinds.Distances,
      access: Fitness.PermissionAccesses.Read,
    },
    {
      kind: Fitness.PermissionKinds.Distances,
      access: Fitness.PermissionAccesses.Write,
    },
  ];
  const [dataChart, setDataChart] = useState([]);
  const xAxis = {
    granularityEnabled: true,
    granularity: 1,
    // axisLineWidth: 3,
    position: 'TOP',
    labelCount: 7,
    avoidFirstLastClipping: true,
  };
  useEffect(() => {
    var end = new Date();
    end.setDate(end.getDate() + 1);
    var start = new Date();
    var startLine = new Date();
    startLine.setDate(new Date().getDate() - 7);
    var endLine = new Date();
    endLine.setDate(new Date().getDate() - 1);
    // let listDate = getListDate(start, end)

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
  }, []);
  const getData = (start, end, startLine, endLine) => {
    // let listDate = getListDate(start, end);
    // renderDataMap(listDate);
    onGetSteps(start, end);
    onGetStepsRealTime(start, end);
    onGetStepLine(startLine, endLine);
    onGetCalories(start, end);
    onGetDistances(start, end);
  };
  const getPermission = async (start, end, startLine, endLine) => {
    try {
      let resPermissions = await Fitness.requestPermissions(permissions);
      let resAuth = await Fitness.isAuthorized(permissions);

      if (resAuth == true) {
        getData(start, end, startLine, endLine);
      } else {
        if (Platform.OS === 'android') {
          let res2 = await Fitness.subscribeToSteps();
        }
        // getData(start, end, startLine, endLine);
      }
    } catch (error) {
      getPermission();
    }
  };
  const renderDataMap = listDate => {
    let valueDate = [];
    listDate.map(obj => {
      valueDate.push({
        x: obj,
      });
    });
  };

  const onGetStepLine = (start, end) => {
    var valueDate = [];
    var valueTime = [];
    var total = 0;
    Fitness.getSteps({startDate: start, endDate: end})
      .then(res => {
        if (res.length) {
          res.map(obj => {
            valueTime.push(moment(obj.endDate).format('MM/DD'));
            valueDate.push({
              marker: obj.quantity,
              y: obj.quantity,
            });
            total += obj.quantity;
          });

          let dataChart = [
            {
              // label: "demo",
              values: valueDate,

              // config: {
              //     color: processColor('#fe4358'),
              //     drawCircles: true,
              //     lineWidth: 3,
              //     drawValues: false,
              //     axisDependency: 'LEFT',
              //     circleColor: processColor('#fe4358'),
              //     circleRadius: 5,
              //     drawCircleHole: false,
              //     mode: 'HORIZONTAL_BEZIER',
              // },
            },
          ];

          setDataChart(dataChart);
          setTime(valueTime);
        } else {
          let dataNull = [
            {
              startDate: start,
              endDate: end,
              quantity: 0,
            },
          ];
          dataNull.map(obj => {
            valueTime.push(moment(obj.endDate).format('MM/DD'));
            valueDate.push({
              marker: obj.quantity,
              y: obj.quantity,
            });
            total += obj.quantity;
          });

          let dataChart = [
            {
              // label: "demo",
              values: valueDate,

              // config: {
              //     color: processColor('#fe4358'),
              //     drawCircles: true,
              //     lineWidth: 3,
              //     drawValues: false,
              //     axisDependency: 'LEFT',
              //     circleColor: processColor('#fe4358'),
              //     circleRadius: 5,
              //     drawCircleHole: false,
              //     mode: 'HORIZONTAL_BEZIER',
              // },
            },
          ];

          setDataChart(dataChart);

          setTime(valueTime);
        }
      })
      .catch(err => {});
  };
  const onGetSteps = (start, end) => {
    Fitness.getSteps({startDate: start, endDate: end})
      .then(res => {
        if (res.length) {
          var total = 0;
          res.map(obj => {
            total += obj.quantity;
          });
          setCountStep(numberWithCommas(total));

          setCountRest(totalCount - total);
        } else {
          setCountStep(0), setCountRest(totalCount - 0);
        }
      })
      .catch(err => {});
  };
  const onGetStepsRealTime = (start, end) => {
    setInterval(() => {
      Fitness.getSteps({
        startDate: moment(start).toString(),
        endDate: moment(end).toString(),
      })
        .then(res => {
          if (res.length) {
            var total = 0;
            res.map(obj => {
              total += obj.quantity;
            });
            setCountStep(numberWithCommas(total));

            setCountRest(totalCount - total);
          } else {
            setCountStep(0), setCountRest(totalCount - 0);
          }
        })
        .catch(err => {});
    }, 3000);
  };

  const onGetDistances = (start, end) => {
    Fitness.getDistances({startDate: start, endDate: end})
      .then(res => {
        //
        var total = 0;
        res.map(obj => {
          total += obj.quantity;
        });
        total = total / 1000;
        setDistant(total.toFixed(1));
      })
      .catch(err => {});
  };
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
    Fitness.getCalories({startDate: start, endDate: end})
      .then(res => {
        //
        var total = 0;
        res.map(obj => {
          total += obj.quantity;
        });
        setCountCarlo(total);
      })
      .catch(err => {});
  };
  const onBack = () => {
    try {
      navigation.pop();
    } catch (e) {}
  };
  const onShowMenu = () => {
    navigation.openDrawer();
  };
  const handleSelect = event => {
    // let entry = event.nativeEvent;
    //
    // if (entry == null) {
    //     this.setState({
    //         ...this.state,
    //         selectedEntry: null,
    //     });
    // } else {
    //     this.setState({
    //         ...this.state,
    //         selectedEntry: JSON.stringify(entry),
    //         year: entry?.data?.year,
    //     });
    // }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* <View>
                    <Text>Thống kê bước chân</Text>
                </View> */}
        <Header
          onBack={onBack}
          colorIcon={'#FE4358'}
          title={formatMessage(message.title)}
          styleHeader={styles.header}
          styleTitle={{
            color: '#000',
            fontSize: fontSize.bigger,
          }}
          styleHeader={{justifyContent: 'space-around'}}
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
              fill={((totalCount - countRest) / totalCount) * 100}
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

            <Text style={styles.txData}>{`50`}</Text>
            <Text style={styles.txUnit}>{formatMessage(message.minute)}</Text>
          </View>
        </View>
        <View style={styles.viewLineChart}>
          {(dataChart.length && <ChartLine data={dataChart} time={time} />) ||
            null}
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
        <View style={styles.viewHeight} />
      </ScrollView>
      <TouchableOpacity
        style={styles.btnHistory}
        onPress={() => navigation.navigate('stepHistory',{dataHealth: {countStep,countRest,countCarlo,distant}})}>
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
