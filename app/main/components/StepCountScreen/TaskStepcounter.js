import {
    getResultSteps,
    setResultSteps,
    getAutoChange,
    getIsShowNotification,
    getNotiStep,
    getFirstTimeSetup,
    setFirstTimeSetup,
    getIsOnOfApp
} from '../../../core/storage';

import {
    addStepCounter,
    getListHistory,
    addHistory,
    removeAllStepDay,
    getListStepDayBefore,
} from './../../../core/db/RealmDb'

import {
    getStepsTotal,
    getStepsTotalPromise,
    getDistancesWithData
} from '../../../core/calculation_steps';
import BackgroundJob from './../../../core/service_stepcounter'
import { CalculationStepTargetAndroid } from '../../../core/calculation_step_target';

import moment from 'moment'
import * as scheduler from '../../../core/notifyScheduler';

export const options = {
    taskName: 'Bluezone',
    taskTitle: 'Bluezone - Tiện ích sức khoẻ',
    taskDesc: 'Bluezone đếm bước chân',
    taskIcon: {
        name: 'icon_bluezone',
        type: 'mipmap',
    },
    linkingURI: 'mic.bluezone://bluezone/HomeStack/stepCount',
    parameters: {
        delay: 1000,
    },
    targetStep: 10000,
    currentStep: 0,
    isShowStep: true,
    valueTarget: 1021
};

export const taskStepCounter = async () => {
    await new Promise(async () => {
        let isFirst = await getFirstTimeSetup()
        if (isFirst == undefined) {
            await setFirstTimeSetup()
        }

        loopTimeToSchedule()

        getStepsTotal(async total => {
            let targetSteps = await getResultSteps();
            let isShowStep = await getIsShowNotification()
            BackgroundJob.updateNotification({
                ...options,
                currentStep: total || 0,
                targetStep: targetSteps?.step || 10000,
                isShowStep: isShowStep
            })
        })

        BackgroundJob.observerStep(async steps => {
            let targetSteps = await getResultSteps();
            let isShowStep = await getIsShowNotification()


            if (steps.stepCounter) {
                try {
                    await addStepCounter(steps?.startTime,
                        steps?.endTime,
                        steps?.stepCounter)
                    BackgroundJob.sendEmitSaveSuccess()
                } catch (er) {
                }
            }

            getStepsTotal(total => {
                BackgroundJob.updateNotification({
                    ...options,
                    currentStep: total || 0,
                    targetStep: parseInt(targetSteps?.step || 10000),
                    isShowStep: isShowStep,
                    valueTarget: 123
                })
            })
        })

        BackgroundJob.observerHistorySaveChange(async () => {
            await autoChangeStepsTarget()
        })
    })
}

const loopTimeToSchedule = async (oldId) => {
    if (oldId) {
        BackgroundJob.clearTimeout(oldId);
    }
    await switchTimeToSchedule();
    let currentTime = new moment()
    let today7pm = new moment().set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
    let tomorow = new moment(currentTime).add(1, 'days')
    tomorow.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

    let timeDiff = tomorow.diff(currentTime, 'milliseconds')
    let timeDiff7h = 10001
    if (today7pm.isAfter(currentTime)) {
        timeDiff7h = today7pm.diff(currentTime, 'milliseconds')
    }
    let tmpTime = Math.min(timeDiff, timeDiff7h)
    if (tmpTime > 10000) {
        tmpTime = 10000
    }
    const timeoutId = BackgroundJob.setTimeout(() => {
        loopTimeToSchedule(timeoutId);
    }, tmpTime)
}

const autoChangeStepsTarget = async () => {
    try {
        let stepTarget = await getResultSteps()
        let currentTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        if (stepTarget != undefined) {
            let tmp = `${stepTarget?.date}`
            if (tmp.length >= 13) {
                tmp = tmp.slice(0, 10)
            }
            let v = parseInt(tmp)
            let lastUpdateTarget = moment.unix(v).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

            if (currentTime.unix() <= v ||
                (currentTime.format('DD/MM/YYYY') == lastUpdateTarget.format('DD/MM/YYYY'))) {
                return
            }
        }

        let lastTime = await getFirstTimeSetup()
        let firstTime = new moment.unix(lastTime?.time)
        let tmpDay = new moment().diff(firstTime, 'days')

        if (tmpDay < 2) {
            return
        }

        let auto = await getAutoChange();

        if ((auto != undefined && auto?.value == false) ||
            (auto?.value == true && auto?.time == currentTime.unix())
        ) {
            return
        }

        currentTime = currentTime.toDate().getTime()
        let startDay = new moment().subtract(4, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        let listHistory = await getListHistory(startDay.unix(), new moment().unix())
        if (listHistory?.length <= 0) return

        let listData = listHistory.map(element => {
            let resultTmp = JSON.parse(element?.resultStep)
            return (resultTmp?.step || 0)
        })
        let stepTargetNew = CalculationStepTargetAndroid(listData, stepTarget?.step || 10000, tmpDay)
        let resultSave = {
            step: stepTargetNew,
            date: currentTime
        }
        await setResultSteps(resultSave)
    } catch (err) {
        console.log('setResultSteps error', err)
    }
    try {
        BackgroundJob.sendEmitSaveTargetSuccess()
        BackgroundJob.updateTypeNotification()
    } catch (_) { }
}

const switchTimeToSchedule = async () => {
    let currentTime = new moment()
    let tmpStart1 = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    let tmpEnd1 = new moment().set({ hour: 0, minute: 0, second: 9, millisecond: 59 })
    let tmpStart2 = new moment().set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
    let tmpEnd2 = new moment().set({ hour: 19, minute: 0, second: 9, millisecond: 59 })
    if (currentTime.isAfter(tmpStart1) && currentTime.isBefore(tmpEnd1)) {
        await scheduleLastDay()
    } else if (currentTime.isAfter(tmpStart2) && currentTime.isBefore(tmpEnd2)) {
        await schedule7PM()
    }
}

const schedule7PM = async () => {
    await pushNotificationWarning()
}

const scheduleLastDay = async () => {
    await saveHistory();
}

const saveHistory = async () => {
    try {
        let tmp = new moment().subtract(1, 'days')
        let yesterdayStart = tmp.clone().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
        let yesterdayEnd = tmp.clone().set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).unix()

        let listStepYesterday = await getListStepDayBefore()
        let result = await getDistancesWithData(listStepYesterday);
        if (Object.keys(result).length <= 0) {
            return;
        }

        try {
            await addHistory(yesterdayStart, result)
        } catch (err) {
            console.log('addHistory ERROR', err)
        }

        try {
            await removeAllStepDay(yesterdayStart * 1000, yesterdayEnd * 1000)
        } catch (err) {
            console.log('removeAllStepDay ERROR', err)
        }

        BackgroundJob.sendEmitSaveHistorySuccess()
        BackgroundJob.updateTypeNotification()
    } catch (error) {
        console.log('saveHistory error', error)
    }
}

const pushNotificationWarning = async () => {
    let checkOnOff = await getIsOnOfApp()
    if (checkOnOff == undefined) {
        checkOnOff = true
    }

    let tmpStep = await getNotiStep()
    if (tmpStep == undefined) {
        tmpStep = true
    }
    if (checkOnOff == true && tmpStep == true) {
        let totalStep = await getStepsTotalPromise();
        scheduler.createWarnningStepNotification(totalStep || 0)
    }
}

export const StartServiceStepCounter = () => {
    let isRun = BackgroundJob.isRunning();
    if (!isRun) {
        BackgroundJob.start(taskStepCounter, options);
    }
}

export const StopServiceStepCounter = () => {
    let isRun = BackgroundJob.isRunning();
    if (isRun) {
        BackgroundJob.stop()
    }
}