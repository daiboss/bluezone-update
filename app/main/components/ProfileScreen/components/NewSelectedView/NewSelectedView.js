import React, { memo, useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, Animated } from 'react-native'

const ItemHeight = 36
const PaddingTop = ItemHeight * 3

const NewSelectedView = ({
    onValueChange,
    dataSource,
    selectedIndex,
    containerStyle,
    textStyle,
    specialCharacter = ""
}) => {
    const [listData, setListData] = useState([])
    const refFlatList = useRef(null)

    const [indexSelected, setIndexSelected] = useState(0)

    useEffect(() => {
        if (dataSource) {
            setListData([...dataSource, '', '', '', '', '', ''])
        } else {
            setListData([])
        }
    }, [dataSource])

    useEffect(() => {
        if (selectedIndex && refFlatList.current && listData.length > selectedIndex) {
            refFlatList.current?.scrollToIndex({ animated: true, index: selectedIndex });
            setIndexSelected(selectedIndex)
        }
    }, [selectedIndex, refFlatList, listData])

    const renderItemSelected = ({ item, index }) => {
        if (item == "") {
            return <View style={{
                height: ItemHeight
            }} />
        }
        return (
            <View style={{
                height: ItemHeight,
                justifyContent: 'center',
            }}>
                <Text style={[{
                    textAlign: 'center',
                    fontSize: (index == indexSelected || index == indexSelected - 1 || index == indexSelected + 1) ? 15 : 13,
                    fontWeight: index == indexSelected ? '700' : '400',
                    color: index == indexSelected ? '#000' : (index == indexSelected - 1 || index == indexSelected + 1) ? '#222' : '#999'
                }, textStyle]}>{item}{specialCharacter}</Text>
            </View>
        )
    }

    const onScrollToChangeValue = ({ nativeEvent }) => {
        let indexTmp = 0
        try {
            indexTmp = parseInt((nativeEvent?.contentOffset?.y / ItemHeight))
        } catch (err) {
            indexTmp = 0
        }
        // setIndexSelected(indexTmp)
        // onValueChange && onValueChange(dataSource[indexTmp])
    }

    const onItemIndexChange = React.useCallback(setIndexSelected, []);

    return (
        <View style={[{
            height: ItemHeight * 7,
            justifyContent: 'center',
            overflow: 'hidden'
        }, containerStyle]}>
            <Animated.FlatList
                ref={refFlatList}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{
                    height: ItemHeight * 7,
                    paddingTop: PaddingTop,
                    zIndex: 10,
                }}
                data={listData}
                onScrollToIndexFailed={(error) => {
                    refFlatList.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                    setTimeout(() => {
                        if (listData.length !== 0 && refFlatList.current !== null) {
                            refFlatList.current?.scrollToIndex({ index: error.index, animated: true });
                        }
                    }, 100);
                }}
                removeClippedSubviews
                renderItem={renderItemSelected}
                keyExtractor={(item, index) => `item_page_${index}_${specialCharacter}`}
                snapToAlignment={"start"}
                snapToInterval={ItemHeight}
                decelerationRate={"fast"}
                pagingEnabled
                initialNumToRender={100}
                // onScroll={onScrollToChangeValue}
                scrollEventThrottle={16}
                renderToHardwareTextureAndroid
                bounces={false}
                onMomentumScrollEnd={(ev) => {
                    const newIndex = Math.round(
                        ev.nativeEvent.contentOffset.y / ItemHeight
                    );

                    if (onItemIndexChange) {
                        onItemIndexChange(newIndex);
                        onValueChange && onValueChange(dataSource[newIndex])
                    }
                }}
            />
            <View
                style={{
                    height: ItemHeight,
                    position: 'absolute',
                    backgroundColor: '#fde6e9',
                    width: '100%',
                    zIndex: 0
                }}
            />
        </View>
    )
}

export default memo(NewSelectedView)