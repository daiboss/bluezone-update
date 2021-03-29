import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Platform, FlatList, Text } from 'react-native'
import {
    VictoryChart,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    VictoryLabel
} from 'victory-native'
import { red_bluezone } from '../../../../core/color';
import { Svg } from 'react-native-svg';

const { width } = Dimensions.get('screen')
const widthItemChart = 14
import moment from 'moment'
import MyBarChart from './MyBarChart';
import BackgroundJob from './../../../../core/service_stepcounter'
import { getDistances } from '../../../../core/calculation_steps';
import { RFValue } from '../../../../const/multiscreen';
import { STANDARD_SCREEN_HEIGHT } from '../../../../core/fontSize';

const BarChart7Item = ({
    data,
    onGetDataBySelect,
    selectedItem,
    dataTodayOld
}) => {
    const [isLast, setIsLast] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [listData, setListData] = useState([])

    const [currentDayData, setCurrentDayData] = useState()

    useEffect(() => {
        setIsLast(false)
        setListData([])
    }, [data])

    useEffect(() => {
        if (currentDayData) {
            syncValueTodayData()
        }
    }, [currentDayData])

    const syncValueTodayData = () => {
        if (listData.length > 0) {
            let currentItem = listData[0]
            let itemToday = currentItem?.list[currentItem?.list?.length - 1]
            let value = {
                step: currentDayData?.step,
                distance: currentDayData?.distance,
                calories: currentDayData?.calories,
                time: currentDayData?.time,
            }
            itemToday.results = value
            onGetDataBySelect(itemToday, currentItem?.list?.length - 1, 0)
        }
    }

    const addMoreData = (index) => {
        setIsLoading(true)
        let end = data.length - 7 * index
        if (end <= 0) {
            setIsLast(true)
            return
        }
        let arrTmp = data.slice((end - 7) < 0 ? 0 : (end - 7), end)

        let widthChart = width
        if (arrTmp.length > 7) {
            let tmp = (width - 60) / 6;
            widthChart = tmp * (arrTmp.length - 1)
        }
        let maxDomain = Math.max.apply(Math, data.map(function (o) { return o.y; }))
        let listValue = [...listData]
        if (index == 0) {
            listValue = []
            if (arrTmp.length > 0) {
                let itemTmp = arrTmp[arrTmp.length - 1]
                onGetDataBySelect(itemTmp, arrTmp.length - 1, 0)
            }
        }

        listValue.push({
            list: arrTmp,
            index: index,
            maxDomain: maxDomain + 1000,
            widthChart: widthChart
        })
        setListData(listValue)
        setIsLoading(false)
    }

    useEffect(() => {
        if (listData.length == 1) {
            addMoreData(1)
        } else if (listData.length == 0) {
            addMoreData(0)
        }
    }, [listData])

    const loadMoreData = (e) => {
        // console.log('loadMoreDataloadMoreData', e)
        if (isLast) { return }
        if (e >= listData.length) {
            addMoreData(listData.length)
        }
    }

    const renderLoadingMore = useMemo(() => {
        if (isLast) return <View />
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                marginLeft: 20
            }}>
                <ActivityIndicator color={red_bluezone} />
            </View>
        )
    }, [isLoading, isLast])

    const renderItemChart = ({ item, index }) => {
        return (
            <ItemPage
                key={`item_page_${index}`}
                onGetDataBySelect={onGetDataBySelect}
                widthChart={item.widthChart}
                index={item.index}
                flatlistIndex={index}
                maxDomain={item.maxDomain}
                selectedItem={selectedItem}
                listChart={item.list} />
        )
    }

    if (listData.length > 0)
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                style={{ height: RFValue(190, STANDARD_SCREEN_HEIGHT), width: '100%', marginTop: 8 }}
                data={listData}
                initialNumToRender={3}
                renderItem={renderItemChart}
                keyExtractor={(item, index) => `item_page_${index}`}
                horizontal={true}
                snapToAlignment={"start"}
                snapToInterval={width}
                decelerationRate={"fast"}
                pagingEnabled
                inverted
                onEndReached={() => loadMoreData(listData.length)}
                onEndReachedThreshold={20}
                ListFooterComponent={renderLoadingMore}
            />
        )
    else return null
}

const ItemPage = ({
    listChart,
    index = 0,
    maxDomain = 10000,
    onGetDataBySelect,
    selectedItem
}) => {
    const renderCustomChart = () => {
        return (
            <MyBarChart
                selectedItem={selectedItem}
                onGetDataBySelect={onGetDataBySelect}
                data={listChart}
                flIndex={index}
                maxDomain={maxDomain} />
        )
    }

    return (
        <View style={{
            flex: 1,
            width: width,
        }}
            key={`${index}`}
        >
            {
                renderCustomChart()
            }
        </View>
    )
}

export default BarChart7Item