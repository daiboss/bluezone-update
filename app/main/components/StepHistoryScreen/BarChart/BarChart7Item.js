import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Platform, FlatList } from 'react-native'
import {
    VictoryChart,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    VictoryLabel
} from 'victory-native'
import { red_bluezone } from '../../../../core/color';
import { Svg } from 'react-native-svg';
import { getDistances } from '@ovalmoney/react-native-fitness';

const { width } = Dimensions.get('screen')
const widthItemChart = 14
import moment from 'moment'

const BarChart7Item = ({
    data,
    onGetDataBySelect,
    maxDomain = 10000,
    widthChart = width
}) => {
    // const [currentTime, setCurrentTime] = useState(new moment().unix())
    const [indexPage, setIndexPage] = useState(0)
    const [isLast, setIsLast] = useState(false)

    const [listData, setListData] = useState([])

    useEffect(() => {
        // configurationData()
        setIsLast(false)
        setListData([])
    }, [data])

    const configurationData = () => {
        if (data.length <= 0) return
        let surplus = data.length % 7;
        let start = 0;
        let listData = []
        let widthChart = width
        while (1) {
            let end = surplus + 7 * start;
            if (end > data.length) {
                end = data.length
            }
            let arrTmp = data.slice((end - 7) < 0 ? 0 : (end - 7), end)

            if (arrTmp.length > 7) {
                let tmp = (width - 60) / 6;
                widthChart = tmp * (arrTmp.length - 1)
            }
            let maxDomain = Math.max.apply(Math, arrTmp.map(function (o) { return o.y; }))

            listData.push({
                list: arrTmp,
                index: start,
                maxDomain: maxDomain + 1000,
                widthChart: widthChart
            })
            if (end >= data.length) {
                break;
            }
            start += 1;
        }
        setIndexPage(listData.length)
        setListData(listData)
    }

    const addMoreData = (index) => {
        let end = data.length - 7 * index
        if (end <= 0) {
            setIsLast(true)
            return
        }
        let arrTmp = data.slice((end - 7) < 0 ? 0 : (end - 7), end)

        let widthChart = width
        if (arrTmp.length > 7) {
            let tmp = (width - 60) / 6;
            widthChart = tmp * (arrTmp.length - 1)
        }
        let maxDomain = Math.max.apply(Math, arrTmp.map(function (o) { return o.y; }))
        let listValue = [...listData]
        if (index == 0) {
            listValue = []
        }

        listValue.push({
            list: arrTmp,
            index: index,
            maxDomain: maxDomain + 1000,
            widthChart: widthChart
        })
        setListData(listValue)

    }

    useEffect(() => {
        if (listData.length == 1) {
            addMoreData(1)
        }else if (listData.length == 0) {
            addMoreData(0)
        }
    }, [listData])

    const loadMoreData = (e) => {
        if (isLast) { return }
        if (e >= listData.length) {
            addMoreData(listData.length)
        }
    }

    if (listData.length > 0)
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                style={{ height: 280 }}
                data={listData}
                renderItem={({ item, index }) => {
                    return (
                        <ItemPage
                            key={`item_page_${index}`}
                            onGetDataBySelect={onGetDataBySelect}
                            widthChart={item.widthChart}
                            index={item.index}
                            maxDomain={item.maxDomain}
                            listChart={item.list} />
                    )
                }}
                keyExtractor={(item, index) => `item_page_${index}`}
                horizontal={true}
                snapToAlignment={"start"}
                snapToInterval={width}
                decelerationRate={"fast"}
                pagingEnabled
                inverted
                onEndReached={() => loadMoreData(listData.length)}
                onEndReachedThreshold={0.1}
            />
        )
    else return null
}

const ItemPage = ({
    listChart,
    index = 0,
    widthChart = width,
    maxDomain = 10000,
    onGetDataBySelect
}) => {
    const [selectedEntry, setSelectedEntry] = useState({ index: -1 })

    useEffect(() => {
        if (selectedEntry.index >= 0 && selectedEntry.index < listChart?.length) {
            let entry = listChart[selectedEntry.index]
            Platform.OS == 'android' ? onGetDataBySelect(entry?.results || {}) : onGetDataBySelect(entry || {})
        }
    }, [selectedEntry])

    const clickEntry = (entry) => {
        if (selectedEntry?.index != entry.index) {
            let tmp = {
                datum: { ...entry?.datum },
                index: entry.index
            }
            setSelectedEntry(tmp)
        }
    }

    const renderMainChart = () => {
        return (
            <VictoryChart
                key={`chart_${index}`}
                // style={{ background: '#65e', height: 300 }}
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
                            stroke: '#f3f3f3',
                        },
                        ticks: {
                            size: 0,
                        },
                        tickLabels: {
                            fontSize: 11,
                            padding: 15,
                            fontWeight: '700',
                            fill: (e) => {
                                return e?.index == selectedEntry?.index ? red_bluezone :
                                    '#a1a1a1'
                            },
                        },
                    }}
                />
                <VictoryBar
                    barWidth={widthItemChart}

                    events={[
                        {
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
                        },
                    ]}
                    style={{
                        data: {
                            fill: ({ datum }) => {
                                if (datum?.x == selectedEntry?.datum?.x)
                                    return red_bluezone
                                return '#a1a1a1'
                            }
                        },
                    }}
                    data={listChart}
                    cornerRadius={{
                        bottom: () => 7,
                        top: () => 7
                    }}
                />
            </VictoryChart>
        )
    }

    return (
        <View style={{
            flex: 1,
            width: '100%',
        }}
            key={`${index}`}
        >
            {
                Platform.OS == 'android' ? (
                    <Svg>
                        {
                            renderMainChart()
                        }
                    </Svg>
                ) : renderMainChart()
            }
        </View>
    )
}

export default BarChart7Item