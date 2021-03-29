import React, { useState, useEffect, useMemo } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import styles from './styles/index.css';
import { red_bluezone, } from '../../../../core/color';
import { RFValue } from '../../../../const/multiscreen';
import Dash from 'react-native-dash';

import {
  VictoryChart, VictoryLine, VictoryGroup,
  VictoryScatter, VictoryAxis, VictoryArea
} from 'victory-native';
import { Svg, Circle, Defs, Rect, G, Use, LinearGradient, Stop } from 'react-native-svg';
import { getResultSteps } from '../../../../core/storage';
import { STANDARD_SCREEN_HEIGHT } from '../../../../core/fontSize';

const { width, height } = Dimensions.get('window')

const ChartLine = ({
  time,
  data,
  totalCount
}) => {
  const [maxCounter, setMaxCounter] = useState(0)
  const [dataConvert, setDataConvert] = useState([])

  useEffect(() => {
    if (data) {
      handleData()
    }
  }, [data])

  const handleData = async () => {
    console.log('handleData')
    let stepTarget = await getResultSteps()
    let tmpDif = Number(10000 / (stepTarget?.step == undefined ? 10000 : stepTarget?.step == 0 ? 10000 : stepTarget?.step))

    const datanew = data.map((it, index) => {
      return {
        ...it,
        x: index + 1,
        y: (it.y) * tmpDif + 200,
      }
    })
    const max = Math.max.apply(Math, datanew.map(i => i.y));
    setDataConvert(datanew)
    setMaxCounter(max)
  }

  const renderCharMain = () => {
    console.log('renderCharMain')
    return (
      <VictoryChart
        height={RFValue(170, STANDARD_SCREEN_HEIGHT)}
        width={width}
        minDomain={{ y: 0 }}
        padding={{ left: 40, right: 40, top: 30, bottom: 50 }}
        // maxDomain={{ y: this.state.maxCounter <= 10000 ? RFValue(12000) : this.state.maxCounter }}
        maxDomain={{ y: maxCounter <= 10000 ? RFValue(13000) : (maxCounter + parseInt(maxCounter / 2)) }}
      >

        <Defs>
          <LinearGradient id="gradientStroke"
            x1="0%"
            x2="0%"
            y1="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={red_bluezone} stopOpacity="0.8" />
            <Stop offset="70%" stopColor={red_bluezone} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        <VictoryAxis
          tickValues={time}
          style={{
            grid: { stroke: ({ tick, index }) => '#f3f3f3', strokeWidth: 1 },
            axis: { stroke: 'none' },
            tickLabels: {
              fill: ({ tick, index }) => '#3F3F3F',
              fontSize: RFValue(11, STANDARD_SCREEN_HEIGHT),
              fontWeight: '500',
              fontFamily: 'helvetica',
            }
          }}
          orientation="top"
        />

        <VictoryGroup
          style={{
            labels: { fill: 'none' },
          }}
          data={dataConvert}
        // data={[3000, 4000, 0, 100, 30000, 20000, 16000, 17000]}
        >

          <VictoryArea
            interpolation="monotoneX"
            style={{ data: { fill: 'url(#gradientStroke)', opacity: 0.5 } }}
            // data={sampleData}
            animate={{
              duration: 50,
            }}
          />

          <VictoryScatter
            style={{
              data: {
                fill: ({ datum }) => red_bluezone,
                stroke: ({ datum }) => red_bluezone,
                strokeWidth: ({ datum }) => 0,
              },
              labels: {
                fontSize: RFValue(11, STANDARD_SCREEN_HEIGHT),
                fill: red_bluezone
              }
            }}
            size={6}
            labels={() => null}
            animate={{
              duration: 50,
            }}
          />

          <VictoryLine
            animate={{
              duration: 50,
            }}
            interpolation="monotoneX"
            style={{
              data: { stroke: red_bluezone },
              parent: { border: "1px solid #ccc" }
            }}
          />

        </VictoryGroup>


      </VictoryChart>
    )
  }

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderView = () => {
    if (totalCount && time?.length > 0 && dataConvert?.length > 0) {
      return (
        <View
          style={styles.container}>
          <Text style={styles.txtYear}></Text>
          <View style={{
            position: 'absolute',
            backgroundColor: red_bluezone,
            zIndex: 1,
            top: height * 0.055,
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
            }}>{numberWithCommas(totalCount || 10000)}</Text>
            <Image
              style={{
                zIndex: -1,
                width: RFValue(10),
                height: RFValue(10),
                position: 'absolute',
                bottom: -6,
                alignSelf: 'center',
                tintColor: red_bluezone
              }}
              source={require('../images/down-arrow.png')} />
          </View>
          <Dash style={{
            height: 1,
            width: width * 0.81,
            alignSelf: 'center',
            position: 'absolute',
            top: height * 0.09
          }}
            dashColor={red_bluezone}
          />
          {
            renderCharMain()
          }
          {/* <Svg> */}
          {/* </Svg> */}

        </View>
      );
    }
    return <View />
  }

  return renderView()
}

export default ChartLine;
