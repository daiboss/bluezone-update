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
    { x: '01/12', y: 2 },
    { x: '02/12', y: 3 },
    { x: '03/12', y: 5 },
    { x: '04/12', y: 4 },
    { x: '05/12', y: 6 },
    { x: '06/12', y: 4 },
    { x: '07/12', y: 0 },
]

const { width, height } = Dimensions.get('screen')
const widthItemChart = 14

const BartChartHistory = ({
    dataSteps = DATA_STEPS
}) => {

    const refScroll = useRef(null)

    const [maxDomain, setMaxDomain] = useState(300000)

    const [dataChart, setDataChart] = useState([])

    const [widthChart, setWidthChart] = useState(width)

    const [currentSelect, setCurrentSelect] = useState(undefined)

    useEffect(() => {
        if (dataChart.length > 0) {
            setCurrentSelect({
                datum: dataChart[dataChart.length - 1],
                index: dataChart.length - 1
            })
        }
    }, [dataChart])

    const onGetStepsLine = (start, end, type) => {
        switch (type) {
            case 'day': {
                let currentYear = moment(new Date()).year();
                let listDay = dataSteps.filter(t => moment(t.startDate).year() == currentYear)
                let dataChart = []
                listDay.forEach(e => {
                    dataChart.push({
                        x: moment(e.startDate).format('DD/MM'),
                        y: e.quantity
                    })
                })
                if (listDay.length <= 7) {
                    setWidthChart(width)
                } else {
                    let tmp = (width - 80) / 6;
                    let widthTmp = tmp * (listDay.length - 1)
                    setWidthChart(widthTmp)
                }
                setDataChart(dataChart)
                break;
            }
            case 'week': {
                let currentYear = moment(new Date()).year();
                let totalSteps = 0;
                let dateStart = moment(`${currentYear}-01-01`).startOf('isoWeek')
                let dataChart = []
                let currentWeek = moment(new Date()).isoWeek();
                while (dateStart.isoWeek() < currentWeek) {
                    let tmpDays = dataSteps.filter(t => moment(t.startDate).isoWeek() == dateStart.isoWeek())
                    totalSteps = tmpDays.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.quantity;
                    }, 0);
                    let to = moment(new Date(dateStart)).add(6, 'd')
                    let toDate = '0'
                    if (to.isAfter(new Date('2020-12-25'))) {
                        toDate = 'nay'
                    } else {
                        toDate = to.format('DD')
                    }
                    dataChart.push({
                        x: `${dateStart.format('DD')}-${toDate}\nT ${to.format('MM')}`,
                        y: totalSteps
                    })
                    dateStart = dateStart.add(7, 'd')
                }
                if (dataChart.length <= 7) {
                    setWidthChart(width)
                } else {
                    let tmp = (width - 70) / 6;
                    let widthTmp = tmp * (dataChart.length - 1)
                    setWidthChart(widthTmp)
                }
                let max = Math.max.apply(Math, dataChart.map(function (o) { return o.y; }))
                setMaxDomain(max + 2000)
                setDataChart(dataChart)
                break;
            }
            case 'month': {
                let currentMonth = moment(new Date()).month();
                let tmpMonth = 0;
                let dataChart = []
                while (tmpMonth <= currentMonth) {
                    let listDays = dataSteps.filter(t => moment(t.startDate).month() == tmpMonth);
                    let totalSteps = listDays.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.quantity;
                    }, 0);
                    let label = ''
                    if (tmpMonth == currentMonth) {
                        label = 'Tháng\nnày'
                    } else {
                        label = `Tháng\n${tmpMonth + 1}`
                    }
                    dataChart.push({
                        x: label,
                        y: totalSteps
                    })
                    tmpMonth++;
                }
                let max = Math.max.apply(Math, dataChart.map(function (o) { return o.y; }))
                setMaxDomain(max + 5000)
                if (dataChart.length <= 7) {
                    setWidthChart(width)
                } else {
                    let tmp = (width - 30) / 6;
                    let widthTmp = tmp * (dataChart.length - 1)
                    setWidthChart(widthTmp)
                }
                setDataChart(dataChart)
                break
            }
        }
    }

    useEffect(() => {
        let maxsteps = Math.max.apply(Math, dataSteps.map(function (o) { return o.quantity; }))
        setMaxDomain(maxsteps + 1000)
        let end = new Date();
        var start = new Date(1, 1, new Date().getFullYear());
        onGetStepsLine(start
            .format('yyyy-MM-dd'),
            end
                .format('yyyy-MM-dd')
            ,
            'month')
    }, [dataSteps])

    useEffect(() => {
        if (refScroll.current) {
            refScroll.current.scrollToEnd({ animated: true })
        }
    }, [widthChart, dataChart, maxDomain, refScroll])

    return (
        <View>
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
                                    if (e?.index == currentSelect?.index) {
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
                        // animate={{
                        //     duration: 2000,
                        //     onLoad: { duration: 1000 }
                        // }}
                        barWidth={widthItemChart}
                        events={[{
                            target: "data",
                            eventHandlers: {
                                onPress: (e) => {
                                    return [
                                        {
                                            target: "data",
                                            mutation: (props) => {
                                                if (currentSelect?.index != props.index) {
                                                    let tmp = {
                                                        datum: { ...props?.datum },
                                                        index: props?.index || -1
                                                    }
                                                    setCurrentSelect(tmp)
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
                                    if (datum?.x == currentSelect?.datum?.x)
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
        </View>
    )
}

const styles = StyleSheet.create({

})

export default BartChartHistory;