
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native'
import Fitness from '@ovalmoney/react-native-fitness';
import { LineChart } from 'react-native-charts-wrapper';

import { Dimensions } from "react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
// import { LineChart, Grid } from 'react-native-svg-charts'

const screenWidth = Dimensions.get("window").width;
const StepCount = ({ props, navigation }) => {
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
    const permissions = [
        { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Calories, access: Fitness.PermissionAccesses.Read },
        { kind: Fitness.PermissionKinds.Distances, access: Fitness.PermissionAccesses.Read },
    ];
    useEffect(() => {
        getPermission()
    }, [])
    const getPermission = () => {
        Fitness.requestPermissions(permissions).then(res => {
            console.log('res: ', res);
            if (res == true) {
                onGetSteps()
                onGetCalories()
                onGetDistances()
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
    const onGetSteps = () => {
        Fitness.getSteps({ startDate: '2020/12/01', endDate: '2020/12/03' }).then(res => {
            console.log('readsds: ', res);
            var total = 0
            res.map(obj => {
                console.log('obj: ', obj);
                total += obj.quantity
            })
            setCountStep(numberWithCommas(total))
            console.log('numberWithCommas(total): ', numberWithCommas(total));
        }).catch(err => {
            console.log('err: ', err);

        })
    }
    const onGetDistances = () => {
        Fitness.getDistances({ startDate: '2020/12/01', endDate: '2020/12/03' }).then(res => {
            console.log('res: ', res);
            // console.log('readsds: ', res);
            // var total = 0
            // res.map(obj => {
            //     console.log('obj: ', obj);
            //     total += obj.quantity
            // })
            // setCountStep(total)
        }).catch(err => {
            console.log('err: ', err);

        })
    }
    const numberWithCommas = (x) => {
        console.log('x: ', x);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const onGetCalories = () => {
        Fitness.getCalories({ startDate: '2020/12/01', endDate: '2020/12/03' }).then(res => {
            console.log('res: ', res);
            // console.log('readsds: ', res);
            // var total = 0
            // res.map(obj => {
            //     console.log('obj: ', obj);
            //     total += obj.quantity
            // })
            // setCountStep(total)
        }).catch(err => {
            console.log('err: ', err);

        })
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar></StatusBar>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <ImageBackground resizeMode={'stretch'} source={require('./images/bg_step_count.png')} style={styles.viewCircular}>
                    <View style={styles.viewBorderCircular}>
                        <AnimatedCircularProgress
                            size={180}
                            style={styles.circular}
                            width={6}
                            fill={60}
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
                                            Mục tiêu: {countStep}
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
                        <Text style={styles.txData}>{`Còn 9000`}</Text>
                        <Text style={styles.txUnit}>{`bước`}</Text>

                    </View>
                    <View style={styles.viewImgData}>
                        <Image style={styles.img} source={require('./images/ic_distance.png')}></Image>
                        <Text style={styles.txData}>{`1000`}</Text>
                        <Text style={styles.txUnit}>{`km`}</Text>

                    </View>
                    <View style={styles.viewImgData}>
                        <Image style={styles.img} source={require('./images/ic_calories.png')}></Image>
                        <Text style={styles.txData}>{`1000`}</Text>
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
                        data={{ dataSets: [{ label: "demo", values: [{ y: 1 }, { y: 2 }, { y: 1 }] }] }}
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
    }
})
export default StepCount