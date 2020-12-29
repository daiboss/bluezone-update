import React from 'react'
import { View, StyleSheet } from 'react-native'
import {
    VictoryChart,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    LineSegment,
    VictoryTooltip,
    Bar
} from 'victory-native'

const sampleData = [
    { x: '01/12', y: 2 },
    { x: '02/12', y: 3 },
    { x: '03/12', y: 5 },
    { x: '04/12', y: 4 },
    { x: '05/12', y: 6 },
    { x: '06/12', y: 4 },
    { x: '07/12', y: 0 },
]

const BartChartHistory = () => {
    return (
        <View>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={1}
                padding={{ left: 40, right: 40, top: 50, bottom: 50 }}
            >
                <VictoryAxis
                    theme={VictoryTheme.material}
                    standalone={false}
                    orientation="top"
                    active={false}
                    style={{
                        axis: {
                            stroke: "none",

                        },
                        axisLabel: { fontSize: 20, padding: 30 },
                        grid: {
                            stroke: (value) => {
                                return '#ddd'
                            },
                            opacity: 1,
                            borderInlineStyle: 'solid',
                            outlineStyle: 'solid',
                            strokeLinecap: 'square'
                        },
                        ticks: {
                            stroke: "#ddd",
                            size: 5,
                        },
                        tickLabels: {
                            fontSize: 12,
                            padding: 15,
                            fill: (e) => {
                                if (e.tickValue == 7) {
                                    return '#fe4358'
                                }
                                return '#000'
                            },
                        },
                    }}
                    tickValues={[1, 2, 3, 4, 5, 6, 7]}
                    tickFormat={(t) => {
                        if (t == '07/12') return 'Hôm nay'
                        return t
                    }}
                // gridComponent={<LineSegment
                //     type={'grid'}
                //     active={false}
                //     events={{ onClick: () => { } }} />}
                />
                <VictoryBar
                    animate={{
                        duration: 2000,
                        onLoad: { duration: 1000 }
                    }}
                    barWidth={({ index }) => 14}
                    events={[{
                        target: "data",
                        eventHandlers: {
                            onPress: (e) => {
                                return [
                                    {
                                        target: "data",
                                        mutation: (props) => {
                                            console.log('onpress', props)
                                            const fill = props.style && props.style.fill;
                                            // return fill === "black" ? null : { style: { fill: "black" } };
                                        }
                                    }
                                ];
                            }
                        }
                    }]}
                    style={{
                        data: {
                            fill: "#fe4358",
                            // width: 14
                        },
                    }}
                    data={sampleData}
                    cornerRadius={{
                        bottom: () => 7,
                        top: () => 7
                    }}
                    standalone={false}
                />
            </VictoryChart>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default BartChartHistory;