import { getCountStepsToday } from '../../../core/db/NativeDB';
import {
    getIsOnOfApp,
    getNotiStep,
} from '../../../core/storage';
import * as scheduler from '../../../core/notifyScheduler';

import BackgroundJob from './../../../core/service_stepcounter'

export const StartServiceStepCounter = () => {
    let isRun = BackgroundJob.isRunning();
    if (!isRun) {
        BackgroundJob.start();
    }
}

export const StopServiceStepCounter = () => {
    let isRun = BackgroundJob.isRunning();
    if (isRun) {
        BackgroundJob.stop()
    }
}

export const setValueShowStepTarget = (value) => {
    if (isRun) {
        BackgroundJob.setValueShowStepTarget(value)
    }
}

export const taskPushNotificationStepWarning7Pm = async () => {
    let checkOnOff = await getIsOnOfApp()
    if (checkOnOff == undefined) {
        checkOnOff = true
    }

    let tmpStep = await getNotiStep()
    if (tmpStep == undefined) {
        tmpStep = true
    }
    if (checkOnOff == true && tmpStep == true) {
        let totalStep = await getCountStepsToday()
        scheduler.createWarnningStepNotification(totalStep || 0)
    }
}