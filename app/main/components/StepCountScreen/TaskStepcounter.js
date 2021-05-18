import {
    getFirstTimeSetup,
    getIsOnOfApp,
    setFirstTimeSetup,
} from '../../../core/storage';

import BackgroundJob from './../../../core/service_stepcounter'

// export const taskStepCounter = async () => {
//     await new Promise(async () => {
//         console.log('Dang chay.....')
//         let checkOnOff = await getIsOnOfApp()
//         if (checkOnOff == undefined) {
//             checkOnOff = true
//         }
//         if (!checkOnOff) {
//             console.log('DA BAT SERVICE NHUNG CAI DAT LA TAT')
//             StopServiceStepCounter()
//         }

//         let isFirst = await getFirstTimeSetup()
//         if (isFirst == undefined) {
//             await setFirstTimeSetup()
//         }
//     })
// }

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