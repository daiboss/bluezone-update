
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, processColor } from 'react-native'
import Fitness from '@ovalmoney/react-native-fitness';
import { LineChart } from 'react-native-charts-wrapper';

import { Dimensions } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
// import { LineChart, Grid } from 'react-native-svg-charts'
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import Header from '../Header'
const screenWidth = Dimensions.get("window").width;
const StepCount = ({ props, navigation }) => {
    console.log('navigation: ', navigation);
    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `#fe4358`, // optional
                strokeWidth: 2 // optional
            }
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `#fe4358`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };
    const [countStep, setCountStep] = useState(null)
    const [countRest, setCountRest] = useState(0)
    const [countCarlo, setCountCarlo] = useState(0)
    const [distant, setDistant] = useState(0)
    const totalCount = 20000
    const permissions = [
        { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Calories, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Distances, access: Fitness.PermissionAccesses.Read },
    ];
    const [dataChart, setDataChart] = useState({})
    const xAxis = {
        granularityEnabled: true,
        granularity: 1,
        // axisLineWidth: 3,
        position: 'TOP',
        labelCount: 7,
        avoidFirstLastClipping: true,


    }
    useEffect(() => {
        var end = new Date().getTime()

        var start = new Date().setDate(new Date().getDate() - 6)

        // let listDate = getListDate(start, end)

        getPermission(moment(start).format('YYYY-MM-DD').toString(), moment(end).format('YYYY-MM-DD').toString())
    }, [])
    const getPermission = (start, end) => {

        Fitness.requestPermissions(permissions).then(res => {

            if (res == true) {
                let listDate = getListDate(start, end)
                renderDataMap(listDate)
                onGetSteps(start, end)
                onGetCalories(start, end)
                onGetDistances(start, end)
            }
        }).catch(err => {


        })
        // Fitness.requestPermissions(permissions).then(res => {
        //     Fitness.getSteps({ startDate: '2020/12/01', endDate: '2020/12/03' }).then(res => {
        //         
        //         // setCountStep(res)
        //         alert(JSON.stringify(res))
        //     })
        //     

        // }).catch(err => {
        //     alert(JSON.stringify(err))

        //     

        // })
    }
    const renderDataMap = (listDate) => {
        let valueDate = []
        listDate.map(obj => {
            valueDate.push({
                x: obj
            })
        })

    }
    const onGetSteps = (start, end) => {
        Fitness.getSteps({ startDate: start, endDate: end }).then(res => {

            var valueDate = []
            var total = 0
            res.map(obj => {
                valueDate.push({
                    x: moment(obj.endDate).format('MM/DD'),
                    y: obj.quantity
                })
                total += obj.quantity
            })
            setCountStep(numberWithCommas(total))

            setCountRest(totalCount - total)




            setDataChart({
                dataSets: [{
                    label: "demo",
                    values: valueDate,

                    config: {
                        color: processColor('#fe4358'),
                        drawCircles: true,
                        lineWidth: 3,
                        drawValues: false,
                        axisDependency: 'LEFT',
                        circleColor: processColor('#fe4358'),
                        circleRadius: 5,
                        drawCircleHole: false,
                        mode: 'HORIZONTAL_BEZIER',
                    },
                },]
            })
        }).catch(err => {



        })
    }
    const onGetDistances = (start, end) => {
        Fitness.getDistances({ startDate: start, endDate: end }).then(res => {




            // 
            var total = 0
            res.map(obj => {

                total += obj.quantity
            })
            total = total / 1000
            setDistant(total.toFixed(1))
        }).catch(err => {



        })
    }
    const addDays = (date, days = 1) => {
        var list = []
        const result = new Date(date);
        result.setDate(result.getDate() + days);

        list.push(result)


        return [...list];
    };

    const getListDate = (startDate, endDate, range = []) => {


        var start = new Date(startDate);
        var end = new Date(endDate);

        if (start > end) {
            return range
        };
        const next = addDays(start, 1);
        return getListDate(next, end, [...range, start]);
    }
    const numberWithCommas = (x) => {

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const onGetCalories = (start, end) => {
        Fitness.getCalories({ startDate: start, endDate: end }).then(res => {
            console.log('res: ', res);

            // 
            var total = 0
            res.map(obj => {

                total += obj.quantity
            })
            setCountCarlo(total)
        }).catch(err => {


        })
    }
    const onBack = () => {
        try {
            navigation.pop()
        } catch (e) {
            console.log('e: ', e);

        }
    }
    const onShowMenu = () => {
        navigation.openDrawer();
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar></StatusBar>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {/* <View>
                    <Text>Thống kê bước chân</Text>
                </View> */}
                <Header
                    onBack={onBack}
                    onShowMenu={onShowMenu}
                    title={'Thống kê bước chân'}
                ></Header>
                <ImageBackground resizeMode={'stretch'} source={require('./images/bg_step_count.png')} style={styles.viewCircular}>
                    <View style={styles.viewBorderCircular}>
                        <AnimatedCircularProgress
                            size={180}
                            style={styles.circular}
                            width={6}
                            fill={(totalCount - countRest) / totalCount * 100}
                            tintColor="#FE4358"
                            backgroundColor="#e5e5e5">
                            {
                                (fill) => (
                                    <View style={styles.viewFill}>
                                        <Image
                                            source={require('./images/ic_run.png')}
                                            resizeMode={'contain'}
                                            height={30}
                                        >

                                        </Image>
                                        <Text style={styles.txCountStep} >
                                            {countStep}
                                        </Text>
                                        <Text style={styles.txCountTarget} >
                                            Mục tiêu: {totalCount}
                                        </Text>
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress>
                    </View>
                </ImageBackground>
                <View style={styles.dataHealth}>
                    <View style={styles.viewImgData}>
                        <Image style={styles.img} source={require('./images/ic_step.png')}></Image>
                        <Text style={styles.txData}>{`Còn ${countRest}`}</Text>
                        <Text style={styles.txUnit}>{`bước`}</Text>

                    </View>
                    <View style={styles.viewImgData}>
                        <Image style={styles.img} source={require('./images/ic_distance.png')}></Image>
                        <Text style={styles.txData}>{distant}</Text>
                        <Text style={styles.txUnit}>{`km`}</Text>

                    </View>
                    <View style={styles.viewImgData}>
                        <Image style={styles.img} source={require('./images/ic_calories.png')}></Image>
                        <Text style={styles.txData}>{countCarlo}</Text>
                        <Text style={styles.txUnit}>{`kal`}</Text>

                    </View>
                    <View style={styles.viewImgData}>
                        <Image style={styles.img} source={require('./images/ic_time.png')}></Image>

                        <Text style={styles.txData}>{`50`}</Text>
                        <Text style={styles.txUnit}>{`phút`}</Text>

                    </View>
                </View>
                <View style={styles.viewLineChart}>
                    <LineChart style={styles.chart}
                        data={dataChart}
                        style={styles.chart}
                        // data={this.state.data}
                        xAxis={xAxis}
                        highlights={[{ x: 3 }, { x: 6 }]}
                        animation={{
                            durationY: 2000,
                        }}
                        chartDescription={{
                            text: '',
                        }}
                        yAxis={{

                            left: {
                                // valueFormatter: 'largeValue',
                                // axisMinimum: 10,
                                // drawAxisLine: false,
                                // gridDashedLine: {
                                //   lineLength: 5,
                                //   spaceLength: 5,
                                // },
                            },
                            right: {
                                inverted: true,
                                enabled: false,
                            },
                        }}
                        touchEnabled={true}
                        dragEnabled={true}
                        scaleEnabled={true}
                        syncX={true}

                        scaleXEnabled={true}
                        legend={{
                            form: 'LINE',
                            horizontalAlignment: 'CENTER',

                            orientation: 'HORIZONTAL',
                            wordWrapEnabled: true,
                            xEntrySpace: 20,
                            formSize: 20,
                            textSize: 13,
                            custom: {
                                colors: '#FE4358'
                            }

                        }}

                        marker={{
                            enabled: true,
                            markerColor: processColor('#372B7B'),
                            textColor: processColor('#FFF'),
                            markerFontSize: 14,
                        }}
                        scaleYEnabled={true}
                        // visibleRange={this.state.visibleRange}
                        dragDecelerationEnabled={false}
                    // ref="chart"
                    // onChange={this.handleChange.bind(this)}
                    />
                </View>
                <View style={styles.viewHeight}></View>

            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    img: {
    },
    chart: {
        flex: 1
    },
    viewLineChart: {
        marginTop: 30
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    viewHeight: {
        height: 50
    },
    viewImgData: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    txData: {
        color: '#fe4358',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },
    txUnit: {
        fontSize: 14,
        textAlign: 'center',
        color: '#fe4358',
        marginTop: 5
    },
    dataHealth: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginTop: 20
    },

    viewCircular: {
        paddingVertical: 30,
        marginTop: 20,
        alignItems: 'center',
        marginHorizontal: 20,
        justifyContent: 'center'
    },
    viewBorderCircular: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 200
    },
    circular: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewFill: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txCountStep: {
        color: '#fe4358',
        fontSize: 37,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    txCountTarget: {
        color: '#949494',
        fontSize: 14
    },
    chart: {
        flex: 1,
        height: 300,
    },
})
export default StepCount