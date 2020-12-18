import React from 'react';
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
import { BarChart } from 'react-native-charts-wrapper';
import { red_bluezone } from '../../../../core/color';

const distanceToLoadMore = 10;
const pageSize = 10;
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
        barPercentage: 0.5,
        strokeWidth: 2,
        barWidth: 1,
        textSize: 14,
        textAlign:'center',
        alignSelf:'center',
        // textWidth: 5,
        highlightEnabled: true,
        // drawAxisLines: true,
        // avoidFirstLastClipping: true,
      },
    };
  }
  componentDidMount() {
    console.log(this.refs.chart,'this.refs.chart');
    let newState = update(this.state, {
      data: {
        $set: {
          dataSets: this.getDataChart(this.props.data),
          config: {
            barWidth: 0.1,
          }
        },
      },
    });
    this.setState(newState);

    this.setState({
      xAxis: { ...this.state.xAxis, valueFormatter: this.props.time },
    });
  }

  getDataChart = (dataCharts = []) => {
    let data = dataCharts.map((e, i) => {
      return {
        values: e.values,
        label: e.label || '',
        config: {
          color: processColor('#a1a1a1'),
          drawCircles: true,
          drawValues: false,
          // axisDependency: 'LEFT',
          // circleColor: processColor(red_bluezone),
          // circleRadius: 4,
          // drawCircleHole: true,
          mode: 'HORIZONTAL_BEZIER',
          highlightColor: processColor(red_bluezone),
          highlightAlpha:300,
        },
      };
    });

    return data;
  };
  componentWillReceiveProps = preProps => {
    
    if (this.props.data != preProps.data) {
      let newState = update(this.state, {
        data: {
          $set: {
            dataSets: this.getDataChart(preProps.data),
            config: {
              barWidth: 0.1,
            }
          },
        },
      });

      this.setState(newState);
    }
    if (this.props.time != preProps.time) {
      this.setState(pre => ({
        xAxis: {
          ...pre.xAxis,
          valueFormatter: preProps.time,
        },
      }));
    }
  };
  handleSelect = event => {
    let entry = event.nativeEvent;

    if (entry == null) {
      this.setState({
        ...this.state,
        selectedEntry: null,
      });
    } else {
      this.setState({
        ...this.state,
        selectedEntry: JSON.stringify(entry),
        year: entry?.data?.year,
      });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.txtYear}>{this.state.year}</Text>
        <BarChart
          style={styles.chart}
          data={this.state.data}
          xAxis={this.state.xAxis}
          // highlights={[{x: 3}, {x: 6}]}
          animation={{
            durationY: 1000,
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
          dragEnabled = {true}
          legend={{
            enabled: false,
          }}
          marker={{
            enabled: true,
            markerColor: processColor(red_bluezone),
            textColor: processColor('#FFF'),
            markerFontSize: 14,
          }}
          scaleYEnabled={true}
          visibleRange={{ x: { max: 6 } }}
          dragDecelerationEnabled={false}
          ref="chart"
          onSelect={this.handleSelect}
          autoScalesMinMaxEnabled={true}
        // onChange={this.handleChange.bind(this)}
        />
      </View>
    );
  }
}

export default ChartLine;
