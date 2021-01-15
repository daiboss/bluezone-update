import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import message from '../../../core/msg/setting';
import { injectIntl, intlShape } from 'react-intl';
import * as fontSize from '../../../core/fontSize';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform } from 'react-native'
const CustomDrawer = ({ intl,navigation }) => {

    const { formatMessage } = intl;

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
                <View style={{}}>
                    <TouchableOpacity onPress={closeMenu} style={[styles.btnMenu,]}>
                        <Ionicons
                            name={'ios-menu'}
                            size={28}
                            style={[styles.iconMenu]}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={toProfile} style={[styles.btn,{paddingTop:0}]}>
                    <Image style={styles.image} resizeMode={'contain'} source={require('./images/ic_profile.png')}></Image>
                    <Text style={styles.txBtn}>{formatMessage(message.profile)}</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={toBmi} style={styles.btn}>
                    <Image style={styles.image} resizeMode={'contain'} source={require('./images/ic_bmi.png')}></Image>
                    <Text style={styles.txBtn}>BMI</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={toSetting} style={styles.btn}>
                    <Image style={styles.image} resizeMode={'contain'} source={require('./images/ic_setting.png')}></Image>
                    <Text style={styles.txBtn}>{formatMessage(message.title)}</Text>

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
        marginLeft: 10,
        fontWeight: '700'
    },
    container: {
    },
    viewBorder: {
        color: '#000000',
        height: 1,
        width: '100%'
    },
    btnMenu: {
        // padding: 5,
        alignSelf: 'flex-end',
        // marginRight: 20,
        marginTop: 10
    },
    iconMenu:{
        paddingLeft: 20,
        paddingRight: 20,
        ...Platform.select({
            ios: {
                paddingTop: 5,
            },
        }),
    }
})
CustomDrawer.propTypes = {
    intl: intlShape.isRequired,
};



export default injectIntl(CustomDrawer)