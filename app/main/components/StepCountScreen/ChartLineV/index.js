import React, { useState, useEffect } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  processColor, Image,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native';
import update from 'immutability-helper';
import styles from './styles/index.css';
import { LineChart } from 'react-native-charts-wrapper';
import { red_bluezone, blue_bluezone } from '../../../../core/color';
import { RFValue } from '../../../../const/multiscreen';
import Dash from 'react-native-dash';

import {
  VictoryChart, VictoryLine, VictoryTheme, VictoryGroup,
  VictoryTooltip, VictoryLabel,
  VictoryScatter, VictoryAxis, VictoryArea
} from 'victory-native';
import { Svg, Circle, Defs, Rect, G, Use, LinearGradient, Stop } from 'react-native-svg';
const distanceToLoadMore = 10;
const pageSize = 10;
const { width, height } = Dimensions.get('window')

class ChartLine extends React.Component {
  constructor(props) {
    super(props);
    this.xMin = 6;
    this.xMax = 7;
    this.state = {
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
      maxCounter: 0,
      leftLabel: null,
      dataConvert: [],
      position: { x: -100, y: -100 }
    };
  }
  componentDidMount() {
    const datanew = this.props.data.map((it, index) => {
      return {
        ...it,
        x: index + 1
      }
    })
    const max = Math.max.apply(Math, datanew.map(i => i.y));
    this.setState({ dataConvert: datanew, maxCounter: max })
  }

  getLeftLabel = () => {
    const value = this.state?.value?.length
    if (value == 1) {
      return this.state.leftLabel - width * 0.04
    }
    if (value == 2) {
      return this.state.leftLabel - width * 0.05
    }
    if (value == 3) {
      return this.state.leftLabel - width * 0.055
    }
    if (value == 4) {
      return this.state.leftLabel - width * 0.07
    }
    if (value == 5) {
      return this.state.leftLabel - width * 0.08
    }
  }

  renderCharMain = () => {
    return (
      <VictoryChart
        // padding=""
        // width={400}
        height={RFValue(180)}
        minDomain={{ y: 0 }}
        padding={{ left: 40, right: 40, top: 30, bottom: 50 }}
        maxDomain={{ y: this.state.maxCounter <= 10000 ? RFValue(12000) : this.state.maxCounter }}
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

        <VictoryAxis
          tickValues={this.props.time}
          // tickValues = {['11','12','13','14','16','17','18']}
          style={{
            grid: { stroke: ({ tick, index }) => this.state.valueX == index + 1 ? '#FE4358' : 'gray', strokeWidth: 0.5 },
            axis: { stroke: 'none' },

            tickLabels: {
              fill: ({ tick, index }) => this.state.valueX == index + 1 ? '#FE4358' : '#3F3F3F',
              fontSize: RFValue(11),
              fontWeight: '700',
              // fontWeight: '350',
              fontFamily: 'helvetica',
            }
          }}
          orientation="top"
        />

        <VictoryGroup
          style={{ labels: { fill: 'none' } }}
          data={this.state.dataConvert}
        // data = {[3000,4000,100,100,3000,2000,6000,7000]}
        >
          <VictoryArea
            animate={{
              duration: 100,
              onLoad: { duration: 800 },

            }}
            interpolation="monotoneX"
            style={{ data: { fill: 'url(#gradientStroke)', opacity: 0.5 } }}
          // data={sampleData}
          />
          <VictoryLine

            animate={{
              duration: 100,
              onLoad: { duration: 800 },
            }}
            interpolation="monotoneX"
            style={{
              data: { stroke: "#FE4358" },
              parent: { border: "1px solid #ccc" }
            }}

          />

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


        </VictoryGroup>


      </VictoryChart>
    )
  }

  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  render() {
    return (
      <View
        style={styles.container}>
        <Text style={styles.txtYear}>{this.state.year}</Text>
        {this.state.topLabel && this.state.leftLabel &&
          <View style={{
            position: 'absolute',
            backgroundColor: '#FE4358',
            zIndex: 1,
            top: this.state.topLabel - height * (Platform.OS == 'ios' ? 0.045 : 0.06),
            // left: this.getLeftLabel(),
            left: this.state.position.x - RFValue(25),
            paddingHorizontal: RFValue(10),
            paddingVertical: RFValue(5),
            borderWidth: 1,
            borderRadius: 15,
            borderColor: 'red',
            width: RFValue(50)
          }}>
            <Text style={{
              color: 'white',
              fontSize: 10,
              textAlign: 'center',
              fontWeight: '700'
            }}>{this.state.value}</Text>
            <Image
              style={{
                zIndex: -1,
                width: 10,
                height: 10,
                position: 'absolute',
                bottom: -8,
                alignSelf: 'center',
                tintColor: '#FE4358'
              }}
              source={require('../images/down-arrow.png')} />
          </View>
        }
        <View style={{
          position: 'absolute',
          backgroundColor: '#FE4358',
          zIndex: 1,
          top: height * 0.081,
          // left: ,
          alignSelf: 'center',
          paddingHorizontal: RFValue(10),
          paddingVertical: RFValue(Platform.OS == 'ios' ? 5 : 3),
          borderWidth: 1,
          borderRadius: 15,
          borderColor: 'red',
          // width: RFValue(63)
        }}>
          <Text style={{
            color: 'white',
            fontSize: RFValue(10),
            textAlign: 'center',
            fontWeight: '600'
          }}>{this.numberWithCommas(this.props.totalCount || 10000)}</Text>
          <Image
            style={{
              zIndex: -1,
              width: RFValue(10),
              height: RFValue(10),
              position: 'absolute',
              bottom: -8,
              alignSelf: 'center',
              tintColor: '#FE4358'
            }}
            source={require('../images/down-arrow.png')} />
        </View>
        {/* <View style={{
          height: 0,
          width: width * 0.81,
          alignSelf: 'center',
          backgroundColor: 'white',
          position: 'absolute',
          top: height * 0.12,
          borderColor: '#FE4358',
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 1,
        }} /> */}
        <Dash style={{
          height: 1,
          width: width * 0.81,
          alignSelf: 'center',
          position: 'absolute',
          top: height * 0.12
        }}
          dashColor={'#FE4358'}
        />
        {
          this.renderCharMain()
        }
        {/* <Svg> */}
        {/* </Svg> */}

      </View>
    );
  }
}

export default ChartLine;
