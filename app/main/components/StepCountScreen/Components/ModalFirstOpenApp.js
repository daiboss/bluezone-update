import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'

import Modal from 'react-native-modal'
import { RFValue } from '../../../../const/multiscreen'
import { blue_bluezone } from '../../../../core/color'

export default function ModalFirstOpenApp({
    isShowModal,
    closeModal,
    message,
    formatMessage,
}) {
    return (
        <Modal
            useNativeDriver={Platform.OS == 'android'}
            isVisible={isShowModal}
            onBackdropPress={closeModal}
        >
            <View style={styles.containerAlert}>
                <Text style={[styles.textAlert, {
                    color: blue_bluezone,
                    fontWeight: '700',
                    fontSize: RFValue(14)
                }]}>{formatMessage(message.report)}</Text>
                <Text style={[styles.textAlert,
                {
                    paddingHorizontal: RFValue(18)
                }]}>{formatMessage(message.firstHealth)}</Text>
                <View style={{
                    marginTop: RFValue(18),
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderColor: '#d3d3d3'
                }}>
                    <TouchableOpacity
                        onPress={closeModal}
                        activeOpacity={0.5}
                        style={{
                            flex: 1, justifyContent: 'center',
                            marginBottom: RFValue(8)
                        }} >
                        <Text style={[styles.btnAlert, {
                            color: blue_bluezone
                        }]}>{formatMessage(message.close)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    containerAlert: {
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    textAlert: {
        textAlign: 'center',
        fontSize: RFValue(12),
        fontWeight: '700',
        marginTop: RFValue(10)
    },
    btnAlert: {
        textAlign: 'center',
        fontWeight: '700'
    }
})