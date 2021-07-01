import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import Modal from 'react-native-modal'
import { RFValue } from '../../../../const/multiscreen'
import { blue_bluezone } from '../../../../core/color'

export default function ModalChangeTarget({
    isShowModalAlert,
    closeModalAlert7Day,
    confirmStepsTarget,
    formatMessage,
    message,
    numberWithCommas,
    totalCount
}) {
    return (
        <Modal
            useNativeDriver
            isVisible={isShowModalAlert}
            onBackdropPress={closeModalAlert7Day}
        >
            <View style={styles.containerAlert}>
                <Text style={styles.textAlert}>Bạn có muốn dữ mục tiêu là {numberWithCommas(totalCount)} không?</Text>
                <View style={{
                    marginTop: RFValue(18),
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderColor: '#d3d3d3'
                }}>
                    <TouchableOpacity
                        onPress={() => confirmStepsTarget(0)}
                        activeOpacity={0.5}
                        style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={styles.btnAlert}>{formatMessage(message.cancel)}</Text>
                    </TouchableOpacity>
                    <View style={{ height: RFValue(36), width: 1, backgroundColor: '#d3d3d3' }} />
                    <TouchableOpacity
                        onPress={closeModalAlert7Day}
                        activeOpacity={0.5}
                        style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={[styles.btnAlert, {
                            color: blue_bluezone
                        }]}>{formatMessage(message.accept)}</Text>
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