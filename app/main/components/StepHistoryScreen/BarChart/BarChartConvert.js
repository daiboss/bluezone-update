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

const { width, height } = Dimensions.get('screen')
const widthItemChart = 14

const BarChartConvert = ({
    data,
    time,
    onGetDataBySelect
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
            if (tmpList.length <= 7) {
                setWidthChart(width)
            } else {
                let tmp = (width - 30) / 6;
                let widthTmp = tmp * (tmpList.length - 1)
                setWidthChart(widthTmp)
            }
            setDataChart(tmpList)
            setSelectedEntry({
                index: tmpList.length - 1,
                datum: tmpList[tmpList.length - 1]
            })
        }
    }, [data, time])

    useEffect(() => {
        console.log('selectedEntry', selectedEntry)
        if (selectedEntry.index >= 0 && selectedEntry.index < data[0]?.values?.length) {
            let entry = data[0]?.values[selectedEntry.index]
            onGetDataBySelect(entry?.start, entry?.end, entry?.marker)
        }
    }, [selectedEntry])

    useEffect(() => {
        if (refScroll.current) {
            refScroll.current.scrollToEnd({ animated: true })
        }
    }, [widthChart, dataChart, maxDomain, refScroll])

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            ref={refScroll}
            horizontal
            showsVerticalScrollIndicator={false} >
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={1}
                animate={{
                    duration: 1000,
                    onLoad: { duration: 1000 }
                }}
                width={widthChart}
                domain={{ y: [0, maxDomain] }}
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
                        axisLabel: {
                            fontSize: 20,
                            padding: 30,
                            color: '#f6f'
                        },
                        grid: {
                            stroke: '#a1a1a1',
                            opacity: 1,
                            borderInlineStyle: 'solid',
                            outlineStyle: 'solid',
                            strokeLinecap: 'square'
                        },
                        ticks: {
                            stroke: "#a1a1a1",
                            size: 5,
                        },
                        tickLabels: {
                            fontSize: 12,
                            padding: 15,
                            fill: (e) => {
                                if (e?.index == selectedEntry?.index) {
                                    return red_bluezone
                                }
                                return '#a1a1a1'
                            },
                        }
                    }}
                    tickValues={[1, 2, 3, 4, 5, 6, 7]}
                    tickFormat={(t) => {
                        if (t == '07/12') return 'Hôm nay'
                        return t
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
                                        mutation: (props) => {
                                            if (selectedEntry?.index != props.index) {
                                                let tmp = {
                                                    datum: { ...props?.datum },
                                                    index: props?.index || -1
                                                }
                                                setSelectedEntry(tmp)
                                            }
                                        }
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
                    standalone={false}
                />
            </VictoryChart>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

})

export default BarChartConvert;