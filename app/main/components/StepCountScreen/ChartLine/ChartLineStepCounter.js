import React, { memo } from 'react'
import { View, Text } from 'react-native'

const ChartLineStepCounter = ({
    data,
    time
}) => {

    console.log('Data', data)
    console.log('Time', time)
    return (
        <View>
            <Text>dasd</Text>
        </View>
    )
}

export default memo(ChartLineStepCounter)