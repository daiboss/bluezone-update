import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import {
    VictoryChart,
    VictoryBar,
    VictoryTheme,
    VictoryAxis
} from 'victory-native'
import moment from 'moment'
import { red_bluezone } from '../../../../core/color';

const { width, height } = Dimensions.get('screen')
const widthItemChart = 14

const BarChartConvert = ({
    data,
    time,
    onGetDataBySelect,
    loadingData
}) => {

    const refScroll = useRef(null)

    const [maxDomain, setMaxDomain] = useState(300000)

    const [dataChart, setDataChart] = useState([])

    const [widthChart, setWidthChart] = useState(width)

    const [selectedEntry, setSelectedEntry] = useState({ index: -1 })

    useEffect(() => {
        if (data.length) {
            let tmpList = []
            data[0]?.values?.forEach((item, index) => {
                tmpList.push({
                    x: time[index],
                    y: item?.marker || 0
                })
            });
            let max = Math.max.apply(Math, tmpList.map(function (o) { return o.y; }))
            setMaxDomain(max + 1000)

            setDataChart(tmpList)
            setSelectedEntry({
                index: tmpList.length - 1,
                datum: tmpList[tmpList.length - 1]
            })
        }
    }, [data, time])

    useEffect(() => {
        if (dataChart.length <= 7) {
            setWidthChart(width)
        } else {
            let tmp = (width - 30) / 6;
            let widthTmp = tmp * (dataChart.length - 1)
            setWidthChart(widthTmp)
        }
    }, [dataChart])

    useEffect(() => {
        if (selectedEntry.index >= 0 && selectedEntry.index < data[0]?.values?.length) {
            let entry = data[0]?.values[selectedEntry.index]
            onGetDataBySelect(entry?.start, entry?.end, entry?.marker)
        }
    }, [selectedEntry])

    useEffect(() => {
        if (refScroll.current) {
            scrollToEnd()
        }
    }, [widthChart, dataChart, maxDomain, refScroll])

    const scrollToEnd = () => {
        setTimeout(() => {
            refScroll.current.scrollToEnd()
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
            {
                loadingData &&
                <View style={{ position: 'absolute' }}><ActivityIndicator color={'#f66'} /></View>
            }
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                ref={refScroll}
                horizontal
                showsVerticalScrollIndicator={false} >

                <VictoryChart
                    domainPadding={1}
                    sharedEvents={(e) => console.log('e', e)}
                    width={widthChart}
                    domain={{ y: [0, maxDomain] }}
                    padding={{ left: 40, right: 40, top: 50, bottom: 50 }}
                >
                    <VictoryAxis
                        theme={VictoryTheme.material}
                        // standalone={false}
                        orientation="top"
                        active={false}
                        style={{
                            axis: {
                                stroke: "none",
                            },
                            axisLabel: {
                                fontSize: 20,
                                padding: 30
                            },
                            grid: {
                                stroke: '#a1a1a1',
                            },
                            ticks: {
                                stroke: "#a1a1a1",
                                size: 5,
                            },
                            tickLabels: {
                                fontSize: 12,
                                padding: 15,
                                fill: (e) => {
                                    return e?.index == selectedEntry?.index ? red_bluezone : '#a1a1a1'
                                },
                            }
                        }}
                    />
                    <VictoryBar
                        barWidth={widthItemChart}
                        animate={{
                            duration: 1000,
                            onLoad: { duration: 1000 }
                        }}
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
                        data={dataChart}
                        cornerRadius={{
                            bottom: () => 7,
                            top: () => 7
                        }}
                    // standalone={false}
                    />
                </VictoryChart>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default BarChartConvert;