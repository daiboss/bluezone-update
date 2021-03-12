import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  processColor, Image,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import update from 'immutability-helper';
import styles from './styles/index.css';
import { LineChart } from 'react-native-charts-wrapper';
import { red_bluezone, blue_bluezone } from '../../../../../core/color';
import { RFValue } from '../../../../../const/multiscreen';

import {
  VictoryChart, VictoryLine, VictoryTheme, VictoryGroup,
  VictoryTooltip, VictoryLabel,
  VictoryScatter, VictoryAxis, VictoryArea
} from 'victory-native';
import { Svg, Circle, Defs, Rect, G, Use, LinearGradient, Stop } from 'react-native-svg';
const distanceToLoadMore = 10;
const pageSize = 10;
const { width, height } = Dimensions.get('window')
import moment from 'moment'

const widthChart = width - 40 * 2

const  dataTest = [
  {x:1,y:65},
  {x:2,y:15},
  {x:3,y:15},
  {x:4,y:60},
  {x:5,y:60.3},
  {x:6,y:15},
  {x:7,y:15},
  // {x:8,y:300.9},
  // {x:9,y:60,},
  // {x:10,y:60,},
  // {x:11,y:60,},
  // {x:12,y:60,},
  // {x:13,y:60,},
  // {x:14,y:60,},
  // {x:15,y:60,},
  // {x:16,y:60,},
  // {x:17,y:60,},
  // {x:18,y:60,},
  // {x:19,y:60,},
  // {x:20,y:60,},
  // {x:21,y:65},
  // {x:22,y:5},
  // {x:23,y:1.9},
  // {x:24,y:60},
  // {x:25,y:60.3},
  // {x:26,y:1},
  // {x:27,y:1},
  // {x:28,y:300.9},
  // {x:29,y:60,},
  // {x:30,y:60,},
  // {x:31,y:60,},
  // {x:32,y:60,},
  // {x:33,y:60,},
  // {x:34,y:60,},
  // {x:35,y:60,},
  // {x:36,y:60,},
  // {x:37,y:60,},
  // {x:38,y:60,},
  // {x:39,y:60,},
  // {x:40,y:60,},
]

  const tickdataTest = [
    '10/11/2021',
    '11/11/2021',
    '12/11/2021',
    '13/11/2021',
    '14/11/2021',
    '15/11/2021',
    '16/11/2021',
    // '17/11/2021',
    // '18/11/2020',
    // '19/11/2020',
    // '20/11/2020',
    // '21/11/2020',
    // '22/11/2020',
    // '23/11/2020',
    // '24/11/2020',
    // '25/11/2020',
    // '26/11/2020',
    // '27/11/2020',
    // '28/11/2020',
    // '29/11/2020',
    // '30/11/2021',
    // '31/11/2021',
    // '32/11/2021',
    // '33/11/2021',
    // '34/11/2021',
    // '35/11/2021',
    // '36/11/2021',
    // '37/11/2021',
    // '38/11/2020',
    // '39/11/2020',
    // '40/11/2020',
    // '41/11/2020',
    // '42/11/2020',
    // '43/11/2020',
    // '44/11/2020',
    // '45/11/2020',
    // '46/11/2020',
    // '47/11/2020',
    // '48/11/2020',
    // '49/11/2020',
    

  ]
class ChartLine extends React.Component {
  constructor(props) {
    super(props);
    this.xMin = 6;
    this.xMax = 7;
    this.state = {
      showToolTip: false,
      data: {},
      year: null,
      xAxis: {
        granularityEnabled: true,
        granularity: 1,
        axisLineWidth: 0,
        position: 'TOP',
        labelCount: 6,
        // drawAxisLines: true,
        avoidFirstLastClipping: true,
      },
      topLabel: null,
      leftLabel: null,
      dataConvert: [],
      position: { x: -100, y: -100 }
    };
  }
  componentDidMount() {
    console.log('dadadadadadadada',width)
    this.convertData()
  }
  convertData = () => {
    const { data } = this.props
    this.setState({ year: data[0]?.values?.[0]?.year })
    const datanew = this.props.data[0]?.values.map((it, index) => {
      return {
        ...it,
        x: index + 1
      }
    })
    if (datanew.length > 0) {
      let valueEnd = datanew[datanew.length - 1]
      this.setState({
        year: valueEnd?.year
      })
    }
    this.setState({ dataConvert: datanew })
    // this.setState({ dataConvert: dataTest })
  }
  componentDidUpdate(prevProps) {
    const array1 = this.props?.data[0]?.values
    const array2 = prevProps?.data[0]?.values
    const lengthArray1 = array1?.length
    const lengthArray2 = array2?.length
    const checkData = array1[lengthArray1 - 1].marker != array2[lengthArray2 - 1].marker

    if (lengthArray1 != lengthArray2 || checkData) {
      this.convertData()
    }
  }
  domainPaddingChart = () => {
    const { dataConvert } = this.state

    let x = []
    if (dataConvert.length == 1) {
      x = [0, 0]
      return x
    }
    if(dataConvert.length >= 2 && dataConvert.length <=7 ){
      x = Platform.OS == 'android' ? [RFValue(30),RFValue(30)] : [RFValue(30),RFValue(26)] 
      return x
    }
    if(dataConvert.length > 7){
      x = [RFValue(35),RFValue(25)] 
      return x
    }
  }
  widthChart = () => {
    const { dataConvert } = this.state
    let x
    if (dataConvert.length <= 7) {
      x = width * 0.8
      return x
    }
    else if(dataConvert.length == 8 || dataConvert.length == 9){
      x = Platform.OS == 'android' ? dataConvert.length * width *0.12 - dataConvert.length : dataConvert.length * width *0.12 - dataConvert.length * 0.5
      return x
    }
    else {
      x = Platform.OS == 'android' ? dataConvert.length * width *0.12 -  dataConvert.length * 1.5 : dataConvert.length * width *0.12 -  dataConvert.length 
      return x
    }
  }
  getLeftLabel = () => {
    const value = this.state?.value?.length

    if (value == 1) {
      return this.state.leftLabel - width * 0.12
    }
    if (value == 2) {
      return this.state.leftLabel - width * 0.138
    }
    if (value == 3) {
      return this.state.leftLabel - width * 0.15
    }
  }
  renderMainChart = () => {
    return (
      <VictoryChart
        singleQuadrantDomainPadding={false}
        padding={{ top: RFValue(20), bottom: RFValue(10) , left: RFValue(0) , right: RFValue(0) }}
        height={RFValue(120)}
        style={{
          parent: {
            // backgroundColor: 'red',
            overflow: 'visible',
            // backgroundColor: 'rgba(0, 231, 231, 0.2)'
          },
        }}
        width={this.widthChart()}
        domainPadding={{ x: this.domainPaddingChart() }}
        minDomain={{ y: 0 }}
        maxDomain={{ y: 400 }}
      // theme={VictoryTheme.material}
      >
        <Defs>
          <LinearGradient id="gradientStroke"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#FE4358" stopOpacity="0.8" />
            <Stop offset="70%" stopColor="#FE4358" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        {/* {tickdataTest.map((v,i) => {
          return ( */}
              <VictoryAxis
                        //  crossAxis dependentAxis
                        // tickValues={tickdataTest}
                        // tickFormat={tickdataTest.map(i => i.slice(0,5))}
                        tickValues={this.props.time}
                        tickFormat={this.props.time.map(i => i.slice(0,5))}
                        style={{
                          grid: { stroke: ({ tick, index }) => index == this.props.time.length - 1 ? '#FE4358' : 'gray', strokeWidth: 0.5 },
                          axis: { stroke: 'none' },
                          ticks: {
                            size: 0,
                        },
                          tickLabels: {
                            fill: ({ tick, index }) => index == this.props.time.length - 1 ? '#FE4358' : 'black',
                            fontFamily: 'helvetica',
                            fontSize: RFValue(10),
                            fontWeight: '700'
                          }
                        }}
                        orientation="top"
                      />
          {/* )
        })} */}

        <VictoryGroup
          style={{ labels: { fill: 'none' } }}
          data={this.state.dataConvert}
        // data = {dataTest}
        >
          <VictoryArea
            animate={{
              duration: 1000,
              onLoad: { duration: 1000 }
            }}
            interpolation='monotoneX'
            style={{ data: { fill: 'url(#gradientStroke)', opacity: 0.5 } }}
          // data={sampleData}
          />
          <VictoryLine
            animate={{
              duration: 1000,
              onLoad: { duration: 1000 }
            }}
            cornerRadius={{
              bottom: () => 7,
              top: () => 7
          }}
            interpolation='monotoneX'
            style={{
              data: { stroke: "#FE4358" },
              parent: { border: "1px solid #ccc", },

            }}
          />

          {this.state.showToolTip && <VictoryScatter
            style={{
              data: {
                fill: ({ datum }) => datum.x === this.state?.valueX ? "white" : "#FE4358",
                stroke: ({ datum }) => datum.x === this.state?.valueX ? "red" : "#FE4358",
                strokeWidth: ({ datum }) => datum.x === this.state?.valueX ? 1 : 0,
              },
              labels: {
                fontSize: 15,
                fill: ({ datum }) => datum.x === this.state?.valueX ? "white" : "#FE4358"
              }
            }}
            size={({ datum }) => datum.x === this.state?.valueX ? 9 : 6}
            labels={() => null}
          />}
          <VictoryScatter
            style={{
              data: {
                fill: ({ datum }) => "#FE4358",
                stroke: ({ datum }) => "#FE4358",
                strokeWidth: ({ datum }) => 0,
              },
              labels: {
                fontSize: 15,
                fill: "#FE4358"
              }
            }}
            size={6}
            labels={() => null}
          />
          <VictoryScatter
            style={{
              data: {
                fill: ({ datum }) => "none",
                stroke: ({ datum }) => "none",
                strokeWidth: ({ datum }) => 0,
              },
              labels: {
                fontSize: 8,
                fill: "none"
              }
            }}
            size={18}
            labels={() => null}

            events={[{
              target: "data",
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      target: "data",
                      mutation: (props) => {
                        this.setState({
                          showToolTip: !this.state.showToolTip,
                          topLabel: props.y,
                          leftLabel: props.x,
                          value: JSON.stringify(props.datum.y),
                          valueX: props?.datum?.x,
                          year: props?.datum?.year,
                          position: { x: props?.x, y: props?.y }
                        })
                      }
                    }
                  ];
                }
              }
            }]}

          />
        </VictoryGroup>
      </VictoryChart>
    )
  }

  render() {
    return (
      <View style={[styles.container]}>

        <Text style={[styles.txtYear, { paddingVertical: RFValue(10) }]}>{this.state.year || 2021}</Text>
        <ScrollView
          bounces={this.state?.dataConvert.length <= 7 ? false : true}
          showsHorizontalScrollIndicator={false}
          style={{
            flex: 1,
            marginTop: RFValue(3),
            marginBottom: RFValue(10),
            // backgroundColor: '#f8f',
            // marginLeft: RFValue(-10)
          }}
          ref={ref => { this.scrollView = ref }}
          onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
          scrollEnabled={true} horizontal={true}>
          {this.state.topLabel && this.state.leftLabel && this.state.showToolTip &&
            <View style={{
              position: 'absolute',
              backgroundColor: '#FE4358',
              zIndex: 1,
              top: this.state.position.y - RFValue(40),
              left: this.state.position.x - RFValue(20),
              // paddingHorizontal: RFValue(5),
              paddingVertical: RFValue(7),
              borderRadius: 15,
              width: RFValue(40)
            }}>
              <Text style={{
                color: 'white',
                fontSize: RFValue(8),
                textAlign: 'center',
                fontWeight: '700',
              }}>{this.state.value} kg</Text>
              <Image
                style={{
                  width: RFValue(10),
                  height: RFValue(10),
                  position: 'absolute',
                  bottom: RFValue(-4),
                  alignSelf: 'center',
                  tintColor: '#FE4358',
                  // zIndex: 0
                }}
                source={require('../../../StepCountScreen/images/down-arrow.png')} />
            </View>
          }

          {Platform.OS == 'android' ?
            <Svg style={{ height: RFValue(120), alignSelf: 'center' }}>
              {this.renderMainChart()}
            </Svg> :
            <View style={{ height: RFValue(120), alignSelf: 'center' }}>
              {this.renderMainChart()}
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default ChartLine;
