import React, { memo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import {
    VictoryChart,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    VictoryLabel
} from 'victory-native'
import { red_bluezone } from '../../../../core/color';

const { width } = Dimensions.get('screen')
const widthItemChart = 14

const BarChartConvert = ({
    data,
    onGetDataBySelect,
    maxDomain = 10000,
    widthChart = width
}) => {
    const refScroll = useRef(null)

    const [selectedEntry, setSelectedEntry] = useState({ index: -1 })

    useEffect(() => {
        if (data.length) {
            setSelectedEntry({
                index: data.length - 1,
                datum: data[data.length - 1]
            })
        }
    }, [data])

    useEffect(() => {
        if (selectedEntry.index >= 0 && selectedEntry.index < data[0]?.values?.length) {
            let entry = data[0]?.values[selectedEntry.index]
            onGetDataBySelect(entry?.start, entry?.end, entry?.marker)
        }
    }, [selectedEntry])

    useEffect(() => {
        scrollToEnd()
    }, [data])

    const scrollToEnd = () => {
        setTimeout(() => {
            if (refScroll.current) {
                refScroll.current.scrollToEnd({ animated: true })
            }
        }, 1000)
    }

    const clickEntry = (entry) => {
        if (selectedEntry?.index != entry.index) {
            let tmp = {
                datum: { ...entry?.datum },
                index: entry?.index || -1
            }
            setSelectedEntry(tmp)
        }
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                ref={refScroll}
                horizontal
                showsVerticalScrollIndicator={false} >

                <VictoryChart
                    width={widthChart}
                    domain={{ y: [0, maxDomain] }}
                    padding={{ left: 40, right: 40, top: 50, bottom: 50 }}
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 1000 },
                    }}
                >
                    <VictoryAxis
                        // theme={VictoryTheme.material}
                        orientation="top"
                        style={{
                            axis: {
                                stroke: "none",
                            },
                            grid: {
                                stroke: '#a1a1a1',
                            },
                            ticks: {
                                size: 0,
                            },
                            tickLabels: {
                                fontSize: 11,
                                padding: 15,
                                fill: (e) => {
                                    return e?.index == selectedEntry?.index ? red_bluezone : '#a1a1a1'
                                },
                            },
                        }}
                    />
                    <VictoryBar
                        barWidth={widthItemChart}

                        events={[{
                            target: "data",
                            eventHandlers: {
                                onPress: (e) => {
                                    return [
                                        {
                                            target: "data",
                                            mutation: clickEntry
                                        }
                                    ];
                                }
                            }
                        }]}
                        style={{
                            data: {
                                fill: ({ datum }) => {
                                    if (datum?.x == selectedEntry?.datum?.x)
                                        return red_bluezone
                                    return '#a1a1a1'
                                }
                            },
                        }}
                        data={data}
                        cornerRadius={{
                            bottom: () => 7,
                            top: () => 7
                        }}
                    />
                </VictoryChart>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default memo(BarChartConvert);