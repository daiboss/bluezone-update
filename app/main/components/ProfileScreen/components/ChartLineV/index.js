import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  processColor, Image,
  ScrollView,
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
      leftLabel: null,
      dataConvert :[]
    };
  }
  componentDidMount() {
   
   const datanew = this.props.data[0]?.values.map((it,index)=>{
      return{
        ...it,
        x:index + 1
      }
    })
   let b = datanew.slice(0,7)
   console.log('bbbbbbb',b)
  this.setState({dataConvert:b},() => {
    console.log('dâtttatatata',this.state.dataConvert)
  })
  }

  getLeftLabel = () => {
    const value = this.state?.value?.length
    console.log('topLabelbaelbel',this.state.leftLabel,value)

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
  render() {
    console.log('parammrmarmamra',this.props)
    return (
      <View style={[styles.container,]}>
        <Text style={styles.txtYear}>{this.state.year}</Text>
        {this.state.topLabel && this.state.leftLabel &&
          <View style={{
            position: 'absolute',
            backgroundColor: '#FE4358',
            zIndex: 1,
            top: this.state.topLabel - height * 0.045,
            left: this.getLeftLabel(),
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderRadius: 15, borderColor: 'red'
          }}>
            <Text style={{
              color: 'white'
            }}>{this.state.value}</Text>
            <Image
              style={{
                zIndex: -1,
                width: 30, height: 30,
                position: 'absolute', bottom: -10, alignSelf: 'center'
              }}
              source={require('../../../StepCountScreen/images/down-arrow.png')} />
          </View>
        }
  { Platform.OS == 'android' ? <Svg style={{height:RFValue(220),alignSelf:'center'}}>
  <VictoryChart
          // padding=""
          height={RFValue(220)}
          // minDomain={{ y: 0 }}
          maxDomain={{ y: 300 }}
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
            //  crossAxis dependentAxis
            tickValues={this.props.time}
            // tickValues={['10/11','11/11','12/11','13/11','14/11','15/11','16/11']}
          
            style={{
              grid: { stroke: ({tick,index}) => this.state.valueX == index + 1 ? '#FE4358' : 'gray',strokeWidth:0.5 },
              axis: { stroke: 'none' },
              tickLabels: { fill:({tick,index}) => this.state.valueX == index + 1 ? '#FE4358' : 'black'}
            }}
            orientation="top"
          />

          <VictoryGroup
            style={{ labels: { fill: 'none' } }}
            data={this.state.dataConvert}
            //    data = {[
            //   {x:1,y:65},
            //   {x:2,y:67},
            //   {x:3,y:1},
            //   {x:4,y:69},
            //   {x:5,y:68},
            //   {x:6,y:66},
            //   {x:7,y:300},
            // ]}
            >
            <VictoryArea
              interpolation="natural"
              style={{ data: { fill: 'url(#gradientStroke)', opacity: 0.5 } }}
            // data={sampleData}
            />
            <VictoryLine
             animate={{
              duration: 1000,
              onLoad: { duration: 1000 }
            }}
              interpolation="natural"
              style={{
                data: { stroke: "#FE4358" },
                parent: { border: "1px solid #ccc" }
              }}

            />

            <VictoryScatter
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

              events={[{
                target: "data",
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: "data",
                        mutation: (props) => {
                          console.log('propsosoossoos', props)
                          this.setState({
                            topLabel: props.y,
                            leftLabel: props.x,
                            value: JSON.stringify(props.datum.y),
                            valueX: props?.datum?.x,
                            year: props?.datum?.year
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
  </Svg> : <VictoryChart
          // padding=""
          style={{parent:{alignSelf:'center'}}}
          height={RFValue(220)}
          // minDomain={{ y: 0 }}
          maxDomain={{ y: 300 }}
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
            //  crossAxis dependentAxis
            tickValues={this.props.time}
            // tickValues={['10/11','11/11','12/11','13/11','14/11','15/11','16/11',]}
          
            style={{
              grid: { stroke: ({tick,index}) => this.state.valueX == index + 1 ? '#FE4358' : 'gray',strokeWidth:0.5 },
              axis: { stroke: 'none' },
              tickLabels: { fill:({tick,index}) => this.state.valueX == index + 1 ? '#FE4358' : 'black'}
            }}
            orientation="top"
          />

          <VictoryGroup
            style={{ labels: { fill: 'none' } }}
            data={this.state.dataConvert}
            //    data = {[
            //   {x:1,y:65},
            //   {x:2,y:67},
            //   {x:3,y:1},
            //   {x:4,y:69},
            //   {x:5,y:68},
            //   {x:6,y:66},
            //   {x:7,y:300},
            // ]}
            >
            <VictoryArea
              interpolation="natural"
              style={{ data: { fill: 'url(#gradientStroke)', opacity: 0.5 } }}
            // data={sampleData}
            />
            <VictoryLine
             animate={{
              duration: 1000,
              onLoad: { duration: 1000 }
            }}
              interpolation="natural"
              style={{
                data: { stroke: "#FE4358" },
                parent: { border: "1px solid #ccc" }
              }}

            />

            <VictoryScatter
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

              events={[{
                target: "data",
                eventHandlers: {
                  onPressIn: () => {
                    return [
                      {
                        target: "data",
                        mutation: (props) => {
                          console.log('propsosoossoos', props)
                          this.setState({
                            topLabel: props.y,
                            leftLabel: props.x,
                            value: JSON.stringify(props.datum.y),
                            valueX: props?.datum?.x,
                            year: props?.datum?.year
                          })
                        }
                      }
                    ];
                  }
                }
              }]}

            />
          </VictoryGroup>
        </VictoryChart>}
       
      </View>
    );
  }
}

export default ChartLine;
