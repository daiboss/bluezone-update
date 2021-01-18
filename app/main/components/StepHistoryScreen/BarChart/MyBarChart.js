import React, { memo, useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, Animated, TouchableOpacity } from 'react-native'
import { red_bluezone } from '../../../../core/color'

const HEIGHT_CHART = 200
const TIME_ANIM = 1000

const MyBarChart = ({
    data,
    flIndex,
    onGetDataBySelect,
    maxDomain,
    selectedItem
}) => {
    return (
        <View style={{
            width: '100%',
            flex: 1
        }}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => `Key_column_${flIndex}_${index}`}
                numColumns={7}
                renderItem={({ item, index }) => <ChartColumn
                    onGetDataBySelect={onGetDataBySelect}
                    item={item}
                    index={index}
                    maxDomain={maxDomain}
                    flIndex={flIndex}
                    selectedItem={selectedItem} />}
            />
        </View>
    )
}

const ChartColumn = ({ item,
    index,
    flIndex,
    maxDomain = 10000,
    onGetDataBySelect,
    selectedItem
}) => {
    const refAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        let tmp = item?.y / maxDomain * HEIGHT_CHART
        Animated.timing(refAnim, {
            toValue: tmp,
            duration: TIME_ANIM,
            useNativeDriver: false
        }).start()
    }, [])

    const onPressItem = () => {
        onGetDataBySelect(item, index, flIndex)
    }

    return (
        <TouchableOpacity
            onPress={onPressItem}
            activeOpacity={0.8}
            style={{
                flex: 1,
                height: HEIGHT_CHART + HEIGHT_CHART * 0.3,
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
            <View style={{
                position: 'absolute',
                width: 1,
                height: '100%',
                backgroundColor: '#f3f3f3',
                marginTop: 28
            }} />
            <Text style={{
                fontSize: 10,
                fontWeight: '700',
                textAlign: 'center',
                color: selectedItem?.index == index && selectedItem?.page == flIndex ? red_bluezone : '#a1a1a1'
            }}>{item?.x}</Text>
            <Animated.View style={{
                width: 12,
                height: refAnim,
                backgroundColor: selectedItem?.index == index && selectedItem?.page == flIndex ? red_bluezone : '#a1a1a1',
                borderRadius: 20
            }} />
        </TouchableOpacity>
    )
}

export default MyBarChart