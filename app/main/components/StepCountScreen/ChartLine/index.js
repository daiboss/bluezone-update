import React, {useState, useEffect} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  processColor,
  ScrollView,
} from 'react-native';
import update from 'immutability-helper';
import styles from './styles/index.css';
import {LineChart} from 'react-native-charts-wrapper';
import {red_bluezone, blue_bluezone} from '../../../../core/color';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryGroup,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryZoomContainer,
} from 'victory-native';
const distanceToLoadMore = 10;
const pageSize = 10;
const ChartLine = ({data}) => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.txtYear}>{this.state.year}</Text> */}
      <VictoryChart
        animate={{
          duration: 1000,
          onLoad: {duration: 1000},
        }}
        padding={{left: 40, right: 40, top: 50, bottom: 50}}
        theme={VictoryTheme.material}>
        <VictoryGroup data={data}>
          <VictoryLine
            interpolation="natural"
            style={{
              data: {stroke: '#FE4358'},
              parent: {border: '1px solid #ccc'},
            }}
          />
          <VictoryScatter
            style={{
              data: {stroke: '#FE4358'},
              parent: {border: '1px solid #ccc'},
            }}
          />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
};

export default ChartLine;
