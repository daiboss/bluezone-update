import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native'

const Header = (props) => {
    console.log('props: ', props);


    return (
        <View style={styles.containerHeader}>
            <TouchableOpacity onPress={props.onBack} style={styles.btn}>
                <Image resizeMode={'contain'} style={styles.imageBack} source={require('./images/ic_back.png')}>
                </Image>
            </TouchableOpacity>
            <Text>{props.title}</Text>
            <TouchableOpacity
                style={styles.btn}
                onPress={props.onShowMenu}
            >
                <Image style={styles.imageMenu} source={require('./images/ic_menu.png')}>

                </Image>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    imageBack: {
        height: 18,
        width: 18,
        tintColor: '#fe4358'
    },
    imageMenu: {
        height: 18,
        width: 18,

    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 51
    },
    btn: {
        padding: 5
    }
})
export default Header