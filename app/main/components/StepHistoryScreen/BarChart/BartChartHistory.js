import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import {
    VictoryChart,
    VictoryBar,
    VictoryTheme,
    VictoryAxis
} from 'victory-native'
import moment from 'moment'
import { red_bluezone } from '../../../../core/color';

import { DATA_STEPS } from './data'

const sampleData = [
  {x: '01/12', y: 22000},
  {x: '02/12', y: 300},
  {x: '03/12', y: 200},
  {x: '04/12', y: 400},
  {x: '05/12', y: 600},
  {x: '06/12', y: 400},
  {x: '07/12', y: 100},
];

const BartChartHistory = ({data}) => {
  const [dataChart, setDataChart] = useState([]);
  useEffect(() => {
    if (data?.length) {
      setDataChart(data);
    }
  }, [data]);
  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        // domainPadding={1}
        padding={{left: 40, right: 40, top: 50, bottom: 50}}>
        <VictoryAxis
          theme={VictoryTheme.material}
          //   standalone={false}
          orientation="top"
          //   active={false}
          style={{
            axis: {
              stroke: 'none',
            },
            axisLabel: {fontSize: 20, padding: 30},
            grid: {
              stroke: value => {
                return '#ddd';
              },
              opacity: 1,
              borderInlineStyle: 'solid',
              outlineStyle: 'solid',
              strokeLinecap: 'square',
            },
            ticks: {
              stroke: '#ddd',
              size: 5,
            },
            tickLabels: {
              fontSize: 12,
              padding: 15,
              fill: e => {
                console.log('e: ', e);
                if (e.tickValue == 7) {
                  return '#fe4358';
                }
                return '#000';
              },
            },
          }}
          tickValues={[1, 2, 3, 4, 5, 6, 7]}
          tickFormat={t => {
            if (t == new Date().format('dd/MM')) return 'Hôm nay';
            return t;
          }}
          // gridComponent={<LineSegment
          //     type={'grid'}
          //     active={false}
          //     events={{ onClick: () => { } }} />}
        />
        <VictoryBar
          //   animate={{
          //     duration: 1000,
          //     onLoad: {duration: 1000},
          //   }}
          barWidth={({index}) => 14}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPress: e => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        const fill = props.style && props.style.fill;
                        // return fill === "black" ? null : { style: { fill: "black" } };
                      },
                    },
                  ];
                },
              },
            },
          ]}
          style={{
            data: {
              fill: '#fe4358',
              // width: 14
            },
          }}
          data={dataChart}
          cornerRadius={{
            bottom: () => 7,
            top: () => 7,
          }}
          //   standalone={false}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BartChartHistory;
