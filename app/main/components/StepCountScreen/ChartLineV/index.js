import React, { useState, useEffect } from 'react';
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

const { width, height } = Dimensions.get('window')

const ChartLine = ({
  time,
  data,
  totalCount
}) => {
  const [year, setYear] = useState(null)
  const [topLabel, setTopLabel] = useState(null)

  const [maxCounter, setMaxCounter] = useState(0)
  const [leftLabel, setLeftLabel] = useState(null)
  const [dataConvert, setDataConvert] = useState([])
  const [position, setPosition] = useState({ x: -100, y: -100 })

  useEffect(() => {
    if (data) {
      handleData()
    }
  }, [data])

  const handleData = async () => {
    let stepTarget = await getResultSteps()
    let tmpDif = parseInt(10000 / (stepTarget?.step == undefined ? 10000 : stepTarget?.step == 0 ? 10000 : stepTarget?.step))

    const datanew = data.map((it, index) => {
      return {
        ...it,
        x: index + 1,
        y: it.y * tmpDif
      }
    })
    const max = Math.max.apply(Math, datanew.map(i => i.y));
    setDataConvert(datanew)
    setMaxCounter(max)
  }

  renderCharMain = () => {
    return (
      <VictoryChart
        // padding=""
        // width={400}
        height={RFValue(180)}
        minDomain={{ y: 0 }}
        padding={{ left: 40, right: 40, top: 30, bottom: 50 }}
        maxDomain={{ y: maxCounter <= 10000 ? RFValue(12000) : (maxCounter + parseInt(maxCounter / 3)) }}

      // theme={VictoryTheme.material}
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
          // tickValues = {['11','12','13','14','16','17','18']}
          style={{
            grid: { stroke: ({ tick, index }) => '#f3f3f3', strokeWidth: 1 },
            axis: { stroke: 'none' },
            tickLabels: {
              fill: ({ tick, index }) => '#3F3F3F',
              fontSize: RFValue(11),
              fontWeight: '700',
              fontFamily: 'helvetica',
            }
          }}
          orientation="top"
        />

        <VictoryGroup
          style={{ labels: { fill: 'none' } }}
          data={dataConvert}
        // data = {[3000,4000,100,100,30000,20000,16000,17000]}
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
              data: { stroke: red_bluezone },
              parent: { border: "1px solid #ccc" }
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
                fontSize: 15,
                fill: red_bluezone
              }
            }}
            size={6}
            labels={() => null}
          />


        </VictoryGroup>


      </VictoryChart>
    )
  }

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <View
      style={styles.container}>
      <Text style={styles.txtYear}>{year}</Text>
      {topLabel && leftLabel &&
        <View style={{
          position: 'absolute',
          backgroundColor: red_bluezone,
          zIndex: 1,
          top: topLabel - height * (Platform.OS == 'ios' ? 0.045 : 0.06),
          left: position.x - RFValue(25),
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
          }}>{value}</Text>
          <Image
            style={{
              zIndex: -1,
              width: 10,
              height: 10,
              position: 'absolute',
              bottom: -8,
              alignSelf: 'center',
              tintColor: red_bluezone
            }}
            source={require('../images/down-arrow.png')} />
        </View>
      }
      <View style={{
        position: 'absolute',
        backgroundColor: red_bluezone,
        zIndex: 1,
        top: height * 0.06,
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
            bottom: -8,
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
        top: height * 0.1
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

export default ChartLine;
