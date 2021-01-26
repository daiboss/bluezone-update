import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,

} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { isIPhoneX } from '../../../core/utils/isIPhoneX';
import { Dimensions } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import { LineChart, Grid } from 'react-native-svg-charts'
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import Header from '../../../base/components/Header';
import message from '../../../core/msg/stepCount';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import * as scheduler from '../../../core/notifyScheduler';
import {
    getResultSteps,
    setResultSteps,
    getAutoChange,
    getIsShowNotification,
    getNotiStep,
    setConfirmAlert,
    getConfirmAlert
} from '../../../core/storage';
import ChartLineV from './ChartLineV';
import {
    ResultSteps,
} from '../../../const/storage';
const screenWidth = Dimensions.get('window').width;

import {
    getDistances,
    getStepsTotal,
    getStepsTotalPromise,
} from '../../../core/calculation_steps';

import BackgroundJob from './../../../core/service_stepcounter'
import {
    addStepCounter,
    removeAllStep,
    getListHistory,
    addHistory,
} from './../../../core/db/SqliteDb'

import ButtonIconText from '../../../base/components/ButtonIconText';
import { blue_bluezone, red_bluezone } from '../../../core/color';
import { RFValue } from '../../../const/multiscreen';
import { CommonActions } from '@react-navigation/native';

import { CalculationStepTarget } from '../../../core/calculation_step_target';
import ModalChangeTarget from './Components/ModalChangeTarget';

const DemoTarget = () => {
    const [kia, setKia] = useState('')
    const [qua, setQua] = useState('')
    const [nay, setNay] = useState('')
    const [target, setTarget] = useState('10000')
    const [newTarget, setNewTarget] = useState(10000)

    const calculation = () => {
        let kia1 = 0;
        try { kia1 = parseInt(kia == '' ? '0' : kia) } catch (e) { kia1 = 0 }
        let qua1 = 0;
        try { qua1 = parseInt(qua == '' ? '0' : qua) } catch (e) { qua1 = 0 }
        let nay1 = 0;
        try { nay1 = parseInt(nay == '' ? '0' : nay) } catch (e) { nay1 = 0 }
        let target1 = 0;
        try { target1 = parseInt(target == '' ? '0' : target) } catch (e) { target1 = 0 }
        let k = CalculationStepTarget(kia1 == 0 ? [qua1, nay1] : [kia1, qua1, nay1], target1)
        setNewTarget(k)
    }

    return (
        <SafeAreaView >
            <StatusBar />

            <Header
                // onBack={onBack}
                colorIcon={'#FE4358'}
                title={'Tính bước chân mục tiêu'}
                styleHeader={styles.header}
                styleTitle={{
                    color: '#000',
                    fontSize: fontSize.bigger,
                }}
            />

            <View style={styles.container}>
                <Text style={{ marginTop: 10 }}>Số bước ngày hôm kia</Text>
                <TextInput
                    value={kia}
                    onChangeText={t => setKia(t)}
                    keyboardType='numeric'
                    style={styles.input} />
                <Text style={{
                    fontSize: 10
                }}>(P/s: Số bước ngày hôm kia là 0 sẽ tương đương với trường hợp app mới cài đặt được 2 ngày)</Text>

                <Text style={{ marginTop: 10 }}>Số bước hôm qua</Text>
                <TextInput
                    value={qua}
                    onChangeText={t => setQua(t)}
                    keyboardType='numeric'
                    style={styles.input} />

                <Text style={{ marginTop: 10 }}>Số bước hôm nay</Text>
                <TextInput
                    value={nay}
                    onChangeText={t => setNay(t)}
                    keyboardType='numeric'
                    style={styles.input} />

                <Text style={{ marginTop: 10 }}>Mục tiêu hôm nay</Text>
                <TextInput
                    value={target}
                    onChangeText={t => setTarget(t)}
                    keyboardType='numeric'
                    style={styles.input} />


                <TouchableOpacity
                    onPress={calculation}
                    activeOpacity={0.8}>
                    <Text style={{
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        backgroundColor: red_bluezone,
                        borderRadius: 20,
                        color: '#fff',
                        textAlign: 'center',
                        marginHorizontal: 20,
                        marginVertical: 30
                    }}>Tính mục tiêu ngày mai</Text>
                </TouchableOpacity>

                <Text>Giá trị mục tiêu của ngày mai: {newTarget}</Text>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ffffff',
        // marginTop: isIPhoneX ? 0 : 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 20
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 30
    }
});

export default DemoTarget;