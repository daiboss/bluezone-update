import React, { memo, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Platform } from 'react-native'
import {
    VictoryChart,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    VictoryLabel
} from 'victory-native'
import { red_bluezone } from '../../../../core/color';
import { Svg } from 'react-native-svg';

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
    const [isAnim, setIsAnim] = useState(false)

    useEffect(() => {
        if (data.length) {
            setIsAnim(true)
            setSelectedEntry({
                index: data.length - 1,
                datum: data[data.length - 1]
            })
        }
    }, [data])

    useEffect(() => {
        if (selectedEntry.index >= 0 && selectedEntry.index < data?.length) {
            let entry = data[selectedEntry.index]
            onGetDataBySelect(entry?.results || {})
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
        setTimeout(() => {
            setIsAnim(false)
        }, 2000)
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

    const renderMainChart = () => {
        return (
            <VictoryChart
                width={widthChart}
                domain={{ y: [0, maxDomain] }}
                padding={{ left: 40, right: 40, top: 50, bottom: 50 }}
                animate={{
                    duration: isAnim ? 1000 : 0,
                    onLoad: { duration: isAnim ? 1000 : 0 },
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
        )
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                ref={refScroll}
                horizontal
                showsVerticalScrollIndicator={false} >
                {
                    Platform.OS == 'android' ? (
                        <Svg>
                            {
                                renderMainChart()
                            }
                        </Svg>
                    ) : renderMainChart()
                }

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default memo(BarChartConvert);