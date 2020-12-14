import React, { useState } from 'react'
import { View, StyleSheet, StatusBar, SafeAreaView, Switch, Text, TouchableOpacity } from 'react-native'
import Header from '../Header'
// import { RNAddShortcuts } from 'react-native-add-shortcuts'
import message from '../../../core/msg/setting';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FCM_CHANNEL_ID, FCM_CHANNEL_DES, FCM_CHANNEL_NAME } from '../../../const/fcm';

import firebase from 'react-native-firebase';

const SettingScreen = ({ intl, navigation }) => {
    const { formatMessage } = intl;
    const [autoTarget, setAutoTarget] = useState(false)
    const [alertStep, setAlertStep] = useState(false)
    const [alertTarget, setAlertTarget] = useState(false)
    const [alertBmi, setAlertBmi] = useState(false)

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
    const autoTargetSwitch = () => setAutoTarget(!autoTarget);
    const alertStepSwitch = () => {
        onSetAlarm()
        setAlertStep(!alertStep)};
    const alertTargetSwitch = () => {
        setAlertTarget(!alertTarget)};
    const alertBmiSwitch = () => setAlertBmi(!alertBmi);
    // const addShortCut = () => {

    //     try {
    //         let copy = (
    //             <Icon
    //                 name="copy"
    //                 size={30}
    //                 color="#000000"
    //                 family={'FontAwesome'}
    //             />
    //         );

    //         RNAddShortcuts.AddDynamicShortcut({
    //             label: 'Copy',
    //             description: 'Copy Desc',
    //             icon: 'copy.png',
    //             link: { url: 'app:copy' },
    //             onDone: () => {
    //                 console.log('Shortcut Added');
    //             },
    //         });
    //     } catch (e) {
    //         console.log('e: ', e);

    //     }
    // }
    const onSetAlarm = () => {
        // let fire_date = new Date(new Date().setMinutes(new Date().getMinutes() + 1)).getTime()
        // console.log('fire_date: ', fire_date);
        // let title = 'Lời nhắc, nhấp vào để xem.'
        // try {
        //     console.log('try');
        //     let notification = new firebase.notifications.Notification()
        //         .setNotificationId(`${fire_date}`)
        //         .android.setChannelId(FCM_CHANNEL_ID)
        //         .android.setSmallIcon('ic_launcher')
        //         .android.setProgress(100,40,true)
        //         .setBody(title)
        //         .setTitle('Bluezone')
        //         .setSound('default')
        //         .setData({
        //             id: 7,
        //             type: '-2',
                    
        //         });

        //     firebase.notifications().scheduleNotification(notification, {
        //         fireDate: fire_date,
        //         id: 'alarm_notification',
        //         push_type: 'alarm',
        //         large_icon: 'ic_launcher',
        //         vibrate: 500,
        //         title: 'Hello',
        //         repeatInterval: 'week',
        //         sub_text: 'sub text',
        //         priority: 'high',
        //         show_in_foreground: true,
        //         wake_screen: true,
        //         extra1: { a: 1 },
        //         extra2: 1,
        //     });
        // } catch (e) {
        //     console.log('e: ', e);




        // }
    }

    return (
        <SafeAreaView>
            <StatusBar></StatusBar>
            <Header
                onBack={onBack}
                onShowMenu={onShowMenu}
                title={'Cài đặt'}

            >

            </Header>
            <View style={styles.viewTx}>
                <Text style={styles.txLabel}>
                    {formatMessage(message.autoAdjustTarget)}
                </Text>
                <Switch
                    trackColor={{ false: "#d8d8d8", true: "#fe435850" }}
                    thumbColor={autoTarget ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={autoTargetSwitch}
                    value={autoTarget}
                />
            </View>
            <Text style={styles.txContent}>
                {formatMessage(message.content)}
            </Text>
            <View style={[styles.viewTx, styles.borderTop, styles.borderBottom]}>
                <Text style={styles.txLabelGray}>
                    {formatMessage(message.stepTarget)}
                </Text>
                <Text style={styles.txLabelGray}>
                    1000 bước
               </Text>
            </View>
            <Text style={styles.txNotification}>
                Thông báo
            </Text>
            <View style={[styles.viewTx, styles.borderBottom]}>
                <Text style={styles.txLabel}>
                    Thông báo số bước đi trong ngày
                </Text>
                <Switch
                    trackColor={{ false: "#d8d8d8", true: "#fe435850" }}
                    thumbColor={alertStep ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={alertStepSwitch}
                    value={alertStep}
                />
            </View>
            <View style={[styles.viewTx, styles.borderBottom]}>
                <Text style={styles.txLabel}>
                    Thông báo khi chưa hoàn thành mục tiêu
                </Text>
                <Switch
                    trackColor={{ false: "#d8d8d8", true: "#fe435850" }}
                    thumbColor={alertTarget ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={alertTargetSwitch}
                    value={alertTarget}
                />
            </View>
            <View style={[styles.viewTx, styles.borderBottom]}>
                <Text style={styles.txLabel}>
                    Thông báo cập nhật cân nặng hàng tuần
                </Text>
                <Switch
                    trackColor={{ false: "#d8d8d8", true: "#fe435850" }}
                    thumbColor={alertBmi ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={alertBmiSwitch}
                    value={alertBmi}
                />
            </View>
            <TouchableOpacity onPress={addShortCut}>
                <Text>
                    Thêm tiện ích
                </Text>
            </TouchableOpacity>
        </SafeAreaView>

    )



}
const styles = StyleSheet.create({
    txLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        width: "70%"
    },
    borderTop: {
        borderTopColor: '#00000020',
        borderTopWidth: 1,
    },
    borderBottom: {
        borderBottomColor: '#00000020',
        borderBottomWidth: 1
    },
    viewTx: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 5,
        paddingVertical: 20,


    },
    txContent: {
        marginHorizontal: 20,
        textAlign: 'left',
        fontSize: 14,
        marginTop: -5,
        color: '#00000070',
        marginBottom: 20
    },
    txNotification: {
        marginHorizontal: 20,
        textAlign: 'left',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#000000'
    },
    txLabelGray: {
        color: '#00000070',
        fontSize: 14
    }
})
SettingScreen.propTypes = {
    intl: intlShape.isRequired,
};


export default injectIntl(SettingScreen)