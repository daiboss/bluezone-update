import React, { useState } from 'react'
import { View, StyleSheet, StatusBar, SafeAreaView, Switch, Text, } from 'react-native'
import Header from '../Header'

const SettingScreen = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(false)

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
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
                    Tự động điều chỉnh mục tiêu
                </Text>
                <Switch
                    trackColor={{ false: "#d8d8d8", true: "#fe435850" }}
                    thumbColor={isEnabled ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            <Text style={styles.txContent}>
                Khi bật tùy chọn này, mục tiêu sẽ được tự động tính
                để phù hợp với tổng số bước đi hàng ngày của bạn
            </Text>
            <View style={[styles.viewTx, styles.borderTop, styles.borderBottom]}>
                <Text style={styles.txLabelGray}>
                    Số bước mục tiêu
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
                    thumbColor={isEnabled ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            <View style={[styles.viewTx, styles.borderBottom]}>
                <Text style={styles.txLabel}>
                    Thông báo khi chưa hoàn thành mục tiêu
                </Text>
                <Switch
                    trackColor={{ false: "#d8d8d8", true: "#fe435850" }}
                    thumbColor={isEnabled ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            <View style={[styles.viewTx, styles.borderBottom]}>
                <Text style={styles.txLabel}>
                    Thông báo cập nhật cân nặng hàng tuần
                </Text>
                <Switch
                    trackColor={{ false: "#d8d8d8", true: "#fe435850" }}
                    thumbColor={isEnabled ? "#fe4358" : "#a5a5a5"}
                    ios_backgroundColor="#fff"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
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
export default SettingScreen