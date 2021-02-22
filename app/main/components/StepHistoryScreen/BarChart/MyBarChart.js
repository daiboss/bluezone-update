import React, { memo, useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, Animated, TouchableOpacity, Platform } from 'react-native'
import { red_bluezone } from '../../../../core/color'
import { RFValue } from '../../../../const/multiscreen';
const HEIGHT_CHART = 280
const TIME_ANIM = 1000

const MyBarChart = ({
    data,
    flIndex,
    onGetDataBySelect,
    maxDomain,
    selectedItem
}) => {
    const [valueFlex, setValueFlex] = useState(0)

    useEffect(() => {
        let k = 0;
        switch (data.length) {
            case 0:
            case 1:
                k = 0;
                break;
            case 2:
                k = 1.2;
                break;
            case 3:
                k = 0.65;
                break;
            case 4:
                k = 0.35;
                break;
            case 5:
                k = 0.18;
                break;
            case 6:
                k = 0.05;
                break;
            case 7:
                k = 0;
                break;
            default:
                k = 0;
        }
        setValueFlex(k)
    }, [data])

    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: RFValue(10)
        }}>
            <View style={{ flex: valueFlex }} />
            <FlatList
                data={data}
                style={{
                    flex: 1,
                }}
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
            <View style={{ flex: valueFlex }} />
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
        console.log('maxdomain========>',maxDomain,item)
        let tmp =  Platform.OS === 'android' ? (item?.y / maxDomain) * HEIGHT_CHART * 0.9 : (item?.y / maxDomain) * HEIGHT_CHART * 0.9
        console.log('tmppppppmp',tmp)
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
                height: HEIGHT_CHART ,
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
                fontSize: Platform.OS == 'android' ? 10 : RFValue(10),
                fontWeight: '700',
                textAlign: 'center',
                paddingTop: 3,
                color: selectedItem?.index == index && selectedItem?.page == flIndex ? red_bluezone : '#a1a1a1'
            }}>{item?.x}</Text>
            <Animated.View style={{
                marginTop:RFValue(10),
                width: 12,
                height: refAnim,
                backgroundColor: selectedItem?.index == index && selectedItem?.page == flIndex ? red_bluezone : '#a1a1a1',
                borderRadius: 20
            }} />
        </TouchableOpacity>
    )
}

export default MyBarChart