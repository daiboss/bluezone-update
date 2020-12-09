import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native'
const CustomDrawer = ({ navigation }) => {


    const closeMenu = () => {
        navigation.closeDrawer()
    }
    const toProfile = () => {
        navigation.navigate('Profile2')
    }
    const toBmi = () => {
        navigation.navigate('Bmi')

    }
    const toSetting = () => {
        navigation.navigate('settingScreen')


    }
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View>
                    <TouchableOpacity onPress={closeMenu} style={styles.btnMenu}>
                        <Image style={styles.image} resizeMode={'contain'} source={require('./images/ic_menu.png')}></Image>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={toProfile} style={styles.btn}>
                    <Image style={styles.image} resizeMode={'contain'} source={require('./images/ic_profile.png')}></Image>
                    <Text style={styles.txBtn}>Hồ sơ</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={toBmi} style={styles.btn}>
                    <Image style={styles.image} resizeMode={'contain'} source={require('./images/ic_bmi.png')}></Image>
                    <Text style={styles.txBtn}>BMI</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={toSetting} style={styles.btn}>
                    <Image style={styles.image} resizeMode={'contain'} source={require('./images/ic_setting.png')}></Image>
                    <Text style={styles.txBtn}>Cài đặt</Text>

                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        borderBottomColor: '#00000010',
        borderBottomWidth: 1,
        marginHorizontal: 20
    },
    image: {
        height: 18,
        width: 18
    },
    txBtn: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
        marginLeft: 10
    },
    container: {
    },
    viewBorder: {
        color: '#000000',
        height: 1,
        width: '100%'
    },
    btnMenu: {
        padding: 5,
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10
    }
})
export default CustomDrawer